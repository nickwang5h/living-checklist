'use client'

import { useState } from 'react'
import { useSettingsStore, Language } from '@/store/useSettingsStore'
import { SettingsDialog } from '@/components/SettingsDialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const T = {
  zh: {
    appTitle: '活页清单生成器',
    appDesc: '利用大语言模型，一键生成带有步骤追踪的动态网页',
    cardTitle: '你需要整理什么清单？',
    cardDesc: '详细描述你的任务、旅行计划或项目目标。AI 会将其整理成一个结构化、可互动的分步骤清单。',
    placeholder: '例如：我准备在 7-8 月去一趟欧洲和日本，重点是看艺术展和吃米其林，帮我整理一个关于签证、机票酒店预订、餐厅提前排队的时间线清单。',
    btnGen: '生成活页清单',
    outTitle: '生成结果',
    outDesc: '预览你的清单效果，或直接复制下方 HTML 源码并保存为 .html 文件进行使用。',
    btnCopy: '复制 HTML',
    copied: 'HTML 源码已复制到剪贴板！',
    backEdit: '← 返回修改',
    offlineTip: '你可以复制源码并保存为 .html 离线使用',
    errKey: '请先在设置中配置 API Key。',
    errEmpty: '请输入您的清单需求',
    errFail: '生成失败，请重试',
    success: '生成成功！',
    errReq: '发生错误',
  },
  en: {
    appTitle: 'Living Checklist',
    appDesc: 'Generate dynamic checklists with AI',
    cardTitle: 'What do you need a checklist for?',
    cardDesc: 'Describe your task, trip, or project in detail. The AI will organize it into a step-by-step checklist.',
    placeholder: 'e.g. I\'m planning a 2-week trip to Japan and Europe. I need to book flights, hotels, and plan an itinerary...',
    btnGen: 'Generate Checklist',
    outTitle: 'Generated Output',
    outDesc: 'Copy this HTML and save it as a .html file to use your checklist.',
    btnCopy: 'Copy HTML',
    copied: 'HTML copied to clipboard!',
    backEdit: '← Back to edit',
    offlineTip: 'You can copy the code and save it as .html for offline use',
    errKey: 'API Key is missing. Please configure it in settings.',
    errEmpty: 'Please enter a prompt',
    errFail: 'Failed to generate',
    success: 'Generated successfully!',
    errReq: 'An error occurred',
  },
  ja: {
    appTitle: 'Living Checklist',
    appDesc: 'AIを使ってダイナミックなチェックリストを生成',
    cardTitle: 'どのようなチェックリストが必要ですか？',
    cardDesc: 'タスク、旅行、プロジェクトなどの詳細を説明してください。AIがステップごとのチェックリストに整理します。',
    placeholder: '例：7月〜8月にヨーロッパと日本へ旅行する予定です。美術館やミシュランレストランを巡るための、ビザ・航空券・ホテル予約などのタイムラインを整理してください。',
    btnGen: 'チェックリストを生成',
    btnCopy: 'HTMLをコピー',
    copied: 'HTMLをクリップボードにコピーしました！',
    backEdit: '← 編集に戻る',
    offlineTip: 'コードをコピーして .html として保存すればオフラインでも使えます',
    errKey: 'API Key が設定されていません。設定画面で追加してください。',
    errEmpty: 'プロンプトを入力してください',
    errFail: '生成に失敗しました',
    success: '生成が完了しました！',
    errReq: 'エラーが発生しました',
  },
  fr: {
    appTitle: 'Living Checklist',
    appDesc: 'Générez des checklists dynamiques avec l\'IA',
    cardTitle: 'De quel type de checklist avez-vous besoin ?',
    cardDesc: 'Décrivez votre tâche, voyage ou projet en détail. L\'IA l\'organisera en une liste d\'étapes.',
    placeholder: 'ex: Je prévois un voyage de 2 semaines au Japon et en Europe. J\'ai besoin de réserver des vols, des hôtels et de planifier mon itinéraire...',
    btnGen: 'Générer la checklist',
    btnCopy: 'Copier le HTML',
    copied: 'Code HTML copié dans le presse-papiers !',
    backEdit: '← Retour à l\'édition',
    offlineTip: 'Vous pouvez copier le code et l\'enregistrer en tant que .html pour une utilisation hors ligne',
    errKey: 'La clé API est manquante. Veuillez la configurer dans les paramètres.',
    errEmpty: 'Veuillez saisir une requête',
    errFail: 'Échec de la génération',
    success: 'Généré avec succès !',
    errReq: 'Une erreur s\'est produite',
  }
}

export default function Home() {
  const { apiKey, provider, customEndpoint, model, language, setSettings } = useSettingsStore()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const t = T[language]

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error(t.errKey)
      return
    }
    if (!prompt.trim()) {
      toast.error(t.errEmpty)
      return
    }

    setIsLoading(true)
    setResult('')
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider, customEndpoint, model, prompt, language })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || t.errFail)
      }

      setResult(data.text)
      toast.success(t.success)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.errReq
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }



  if (result) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between p-2 px-4 border-b shrink-0 bg-zinc-50 dark:bg-zinc-900">
          <Button variant="ghost" size="sm" onClick={() => setResult('')}>
            {t.backEdit}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 mr-2 hidden sm:inline">
              {t.offlineTip}
            </span>
            <Button size="sm" onClick={() => {
              navigator.clipboard.writeText(result)
              toast.success(t.copied)
            }}>
              {t.btnCopy}
            </Button>
          </div>
        </div>
        <iframe srcDoc={result} className="w-full flex-1 border-0" title="Checklist" sandbox="allow-scripts allow-same-origin" />
      </div>
    )
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t.appTitle}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{t.appDesc}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(v) => setSettings({ language: v as Language })}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
            <SettingsDialog />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
            <CardDescription>
              {t.cardDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t.placeholder}
              className="min-h-[120px] resize-y"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.btnGen}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
