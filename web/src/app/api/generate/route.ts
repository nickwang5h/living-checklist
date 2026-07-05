import { NextResponse } from 'next/server'
import { baseTemplate } from '@/lib/template'

const getLangName = (lang: string) => {
  if (lang === 'zh') return 'Chinese (zh-Hans)'
  if (lang === 'ja') return 'Japanese (ja)'
  if (lang === 'fr') return 'French (fr)'
  return 'English (en)'
}

const getSystemPrompt = (lang: string) => `You are an expert planner and assistant. Your task is to generate data for a "Living Checklist" based on the user's request.
Output ONLY a valid JSON object without any markdown wrapping (no \`\`\`json).
The JSON must follow this exact structure:
{
  "title": "A concise project name (e.g. ${lang === 'zh' ? '欧洲日本之行' : lang === 'ja' ? 'ヨーロッパ・日本旅行' : lang === 'fr' ? 'Voyage en Europe et au Japon' : 'Europe & Japan Trip'})",
  "summary": "<p><strong>${lang === 'zh' ? '现状：' : lang === 'ja' ? '現状：' : lang === 'fr' ? 'Actuel :' : 'Current：'}</strong>Current situation / constraints</p><p><strong>${lang === 'zh' ? '必做：' : lang === 'ja' ? '必須：' : lang === 'fr' ? 'À faire :' : 'Must Do：'}</strong>Must-do items / hard deadlines</p>",
  "modules": [
    {
      "id": "unique_module_id",
      "title": "Step Title",
      "items": [
        {
          "id": "unique_item_id",
          "html": "Item text with inline HTML if needed (e.g., <strong>bold</strong>)",
          "children": [
             { "id": "sub_id", "html": "Sub-item text" }
          ]
        }
      ]
    }
  ]
}

Rules:
1. Every module and item MUST have a unique string "id" (use short English words like "visa", "flight-book", etc).
2. If the user's request is missing specific details, write placeholder text in the items asking the user, do not invent arbitrary dates/numbers.
3. Use ${getLangName(lang)} as the primary language for all titles and text contents.
4. "children" array is optional, use it only for nested finer checklists.
5. Provide actionable, step-by-step instructions.
`

function injectDataIntoTemplate(html: string, data: any, lang: string): string {
  const isZh = lang === 'zh'
  const isJa = lang === 'ja'
  const isFr = lang === 'fr'
  const titlePrefix = isZh ? '活页清单 · ' : isJa ? '動的チェックリスト · ' : isFr ? 'Liste Dynamique · ' : 'Living Checklist · '

  // Replace Title
  let result = html.replace(
    /<title>.*?<\/title>/,
    `<title>${titlePrefix}${data.title}</title>`
  )
  result = result.replace(
    /<h1 id="app-title">.*?<\/h1>/,
    `<h1 id="app-title">${titlePrefix}${data.title}</h1>`
  )

  // Replace SUMMARY and MODULES
  const safeSummary = data.summary ? JSON.stringify(data.summary).replace(/<\//g, "<\\/") : '""';
  const safeModules = data.modules ? JSON.stringify(data.modules, null, 2).replace(/<\//g, "<\\/") : "[]";
  const summaryReplacement = `const SUMMARY = ${safeSummary};`
  const modulesReplacement = `const MODULES = ${safeModules};`
  
  result = result.replace(
    /const SUMMARY = \{[\s\S]*?\};[\s\S]*?const MODULES = \{[\s\S]*?MODULES\["ja"\] = \[[\s\S]*?\];/m,
    `${summaryReplacement}\n\n${modulesReplacement}`
  )

  // Force language to hide language switcher and ensure UI strings are correct
  const langMap: Record<string, string> = { zh: 'zh-Hans', en: 'en', ja: 'ja', fr: 'fr' }
  const uiLang = langMap[lang] || 'zh-Hans'
  result = result.replace(/lang:\s*".*?",/, `lang: "${uiLang}",`)
  result = result.replace(/languages:\s*\[.*?\],/, `languages: ["${uiLang}"],`)

  return result
}

export async function POST(req: Request) {
  try {
    const { apiKey, provider, customEndpoint, model, prompt, language } = await req.json()
    const lang = language || 'zh'

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 })
    }
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let endpoint = ''
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    let payload: any = {}

    if (provider === 'openai' || provider === 'custom') {
      endpoint = customEndpoint || 'https://api.openai.com/v1'
      endpoint = `${endpoint.replace(/\/$/, '')}/chat/completions`
      headers['Authorization'] = `Bearer ${apiKey}`
      
      payload = {
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: getSystemPrompt(lang) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }
    } else if (provider === 'anthropic') {
      endpoint = 'https://api.anthropic.com/v1/messages'
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      
      payload = {
        model: model || 'claude-3-5-sonnet-20240620',
        max_tokens: 4096,
        system: getSystemPrompt(lang),
        messages: [
          { role: 'user', content: prompt }
        ],
      }
    } else if (provider === 'gemini') {
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`
      payload = {
        system_instruction: {
          parts: [{ text: getSystemPrompt(lang) }]
        },
        contents: [{ parts: [{ text: prompt }] }],
      }
    } else {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Error from API provider' },
        { status: response.status }
      )
    }

    let text = ''
    if (provider === 'openai' || provider === 'custom') {
      text = data.choices?.[0]?.message?.content || ''
    } else if (provider === 'anthropic') {
      text = data.content?.[0]?.text || ''
    } else if (provider === 'gemini') {
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    // Clean markdown wrapping if present
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '').trim()

    let jsonData
    try {
      jsonData = JSON.parse(text)
      
      // Auto-unwrap if LLM nested it under "checklist" or "data"
      if (!jsonData.modules && jsonData.checklist && jsonData.checklist.modules) {
        jsonData = jsonData.checklist
      } else if (!jsonData.modules && jsonData.data && jsonData.data.modules) {
        jsonData = jsonData.data
      }

      // Handle common typo "module" instead of "modules"
      if (!jsonData.modules && jsonData.module) {
        jsonData.modules = jsonData.module
      }

      // Ensure modules is an array
      if (!Array.isArray(jsonData.modules)) {
        console.warn("LLM did not return a modules array. Raw output:", text)
        jsonData.modules = []
      }

      // Ensure every module has an items array and unique ids
      jsonData.modules.forEach((m: any, i: number) => {
        if (!m.id) m.id = `mod_${i}_${Math.random().toString(36).substr(2, 4)}`
        if (!m.title) m.title = `Step ${i + 1}`
        if (!m.items || !Array.isArray(m.items)) m.items = []
        m.items.forEach((it: any, j: number) => {
          if (!it.id) it.id = `it_${i}_${j}_${Math.random().toString(36).substr(2, 4)}`
          if (!it.html) it.html = "Missing content"
          if (it.children && !Array.isArray(it.children)) it.children = []
          it.children?.forEach((child: any, k: number) => {
             if (!child.id) child.id = `sub_${i}_${j}_${k}_${Math.random().toString(36).substr(2, 4)}`
          })
        })
      })
      
      if (!jsonData.title) jsonData.title = lang === 'zh' ? "生成的活页清单" : "Generated Checklist"
      if (!jsonData.summary) jsonData.summary = lang === 'zh' ? "<p><strong>提示：</strong>AI 返回的格式有些缺失，已自动修复。</p>" : "<p><strong>Notice:</strong> Automatically fixed incomplete AI output format.</p>"

    } catch (e) {
      console.error('Failed to parse JSON:', text)
      return NextResponse.json({ error: 'Failed to parse JSON from AI response' }, { status: 500 })
    }

    const finalHtml = injectDataIntoTemplate(baseTemplate, jsonData, lang)

    return NextResponse.json({ text: finalHtml, raw: data })
  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
