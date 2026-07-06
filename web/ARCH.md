# Living Checklist Web Architecture

本文档用于指导 `web/` 应用的日常开发。改功能前先读本文；功能完成后，如果架构、数据流、约定或验证方式发生变化，必须同步更新本文。

## 项目定位

`web/` 是 Living Checklist 的无状态 Web 生成器。用户在浏览器里填写自己的 LLM API Key 和需求描述，前端调用 `src/app/api/generate/route.ts`，后端把模型返回的结构化 JSON 注入到单文件清单模板中，最后前端用 `iframe srcDoc` 直接预览完整 HTML。

核心目标：

- 生成物仍然是一个可离线使用的单文件 HTML。
- Web App 不保存用户数据；API Key 和偏好只存在浏览器 localStorage。
- 后端 API 路由只做一次生成请求和模板注入，不引入数据库或长生命周期状态。

## 面向未来的开发提示

这份文档的目标不是只记录“当前已经做了什么”，而是为后续接手的人提供一条能直接复用的开发路径。后续任何改动，优先遵循下面的顺序：

- 本分支的改动优先限制在 [web/](web/) 目录内；如无明确要求，不要改动 [web/](web/) 之外的文件。

1. 先读本文和相关源码，再动手；不要凭记忆猜测现有行为。
2. 若改的是生成流程、provider、模板注入、状态字段或 UI 文案，先确认影响面，再把对应的约束写进本文。
3. 修改 `src/lib/base.html` 时，记得同步执行 `node scripts/convert.js`，否则 API 仍会使用旧的 `template.ts`。
4. 新增 provider、语言或设置项时，要同时更新 store、UI、API route 和本文中的对应章节，避免只改了一半。
5. 变更后优先跑 `npm run lint` 和 `npm run build`，并在必要时做一次生成页的手动验证，确保最终 HTML 仍然可用。

如果后续要扩展这套生成器，建议把每次新增的“坑”和“约束”都补在这里，避免后续重复踩同样的坑。

## 技术栈

- Next.js App Router，当前依赖见 `package.json`。
- React + TypeScript。
- Tailwind CSS v4 + shadcn/ui 源码组件。
- Zustand `persist` 保存本地设置。
- `lucide-react` 用于图标。

注意：`AGENTS.md` 提醒当前 Next.js 版本可能和常识不同。改 Next.js API、路由、构建配置前，先查本项目 `node_modules/next/dist/docs/` 中对应文档。

## 目录地图

```text
web/
├── ARCH.md                    # 本文档，开发约定和架构记录
├── AGENTS.md                  # Agent 注意事项
├── package.json               # scripts 和依赖
├── scripts/
│   └── convert.js             # 将 src/lib/base.html 转为 src/lib/template.ts
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts # 生成 API：调用模型、清洗 JSON、注入模板
│   │   ├── globals.css           # Tailwind/shadcn token 和全局样式
│   │   ├── layout.tsx            # 根布局、字体、Toaster
│   │   └── page.tsx              # 生成器 UI + 结果 iframe 预览
│   ├── components/
│   │   ├── SettingsDialog.tsx    # BYOK/provider/model 设置弹窗
│   │   └── ui/                   # shadcn/ui 基础组件
│   ├── lib/
│   │   ├── base.html             # 单文件清单引擎模板源
│   │   ├── template.ts           # convert.js 生成的模板字符串
│   │   └── utils.ts              # cn/className 工具
│   └── store/
│       └── useSettingsStore.ts   # provider/API key/model/language 本地状态
```

## 运行与构建

```bash
cd web
npm install
npm run dev
npm run build
npm run lint
```

`npm run dev` 和 `npm run build` 都会先跑 `predev`/`prebuild`，即 `node scripts/convert.js`。这个脚本读取 `src/lib/base.html` 并覆盖生成 `src/lib/template.ts`。

如果只改了 `src/lib/base.html`，必须重新运行 `node scripts/convert.js` 或重启 dev/build 脚本，否则 API 路由仍会使用旧的 `template.ts`。

## 端到端数据流

1. 用户在 `page.tsx` 输入需求。
2. `useSettingsStore.ts` 提供 API Key、provider、custom endpoint、model、language。
3. `page.tsx` 以 JSON POST 到 `/api/generate`。
4. `route.ts` 根据 provider 组装请求：
   - OpenAI/custom：`/chat/completions`，要求 `response_format: { type: "json_object" }`。
   - Anthropic：`/v1/messages`。
   - Gemini：`generateContent`。
5. 模型必须返回 `{ title, summary, modules }` JSON。服务端会做容错修复，例如 unwrap `checklist`/`data`、兼容 `module` 拼写、补缺失 id。
6. `injectDataIntoTemplate` 用正则替换模板里的 `<title>`、`<h1 id="app-title">`、`SUMMARY`、`MODULES` 和 `CONFIG.lang/languages`。
7. API 返回 `{ text: finalHtml, raw: providerResponse }`。
8. 前端将 `text` 放入 `<iframe srcDoc={result}>`，并提供复制 HTML 的按钮。

## 模板与注入边界

`src/lib/base.html` 是生成物的源模板，`src/lib/template.ts` 是构建产物。日常开发优先修改 `base.html`，再生成 `template.ts`。

当前注入逻辑依赖模板中的具体文本形状：

- `<title>...</title>`
- `<h1 id="app-title">...</h1>`
- 一个包含多语言示例数据的 `const SUMMARY = ...; ... const MODULES = ...; ... MODULES["ja"] = [...];` 区块
- `CONFIG` 中的 `lang: "...",` 和 `languages: [...],`

如果改动 `base.html` 的数据区结构，必须同时更新 `route.ts` 的注入逻辑，并用实际生成请求或最小脚本验证最终 HTML 不为空、数据被替换、语言切换按预期隐藏。

不要手改 `template.ts` 来实现业务变化；它会被 `convert.js` 覆盖。

## 前端状态约定

`useSettingsStore.ts` 是唯一持久化入口，storage key 为 `living-checklist-settings`。

当前持久化字段：

- `apiKey`
- `provider`
- `customEndpoint`
- `model`
- `language`

新增设置时：

- 先扩展类型，再更新默认值和 UI。
- 明确是否需要持久化；敏感信息只保存在本地浏览器。
- 如果字段影响 API 请求，更新 `page.tsx` POST body 和 `route.ts` request parsing。

## Provider 约定

`Provider` 当前支持 `openai | anthropic | gemini | custom`。新增 provider 时至少改这些位置：

- `src/store/useSettingsStore.ts` 的 `Provider` 类型。
- `src/components/SettingsDialog.tsx` provider 下拉和必要字段。
- `src/app/api/generate/route.ts` 的 endpoint、headers、payload 和 response text extraction。
- 错误提示和 README/ARCH 中的说明。

所有 provider 都应继续输出同一份内部 JSON schema；不要让前端或模板感知 provider 差异。

## 语言约定

Web App UI 当前语言类型为 `zh | en | ja | fr`。模板底层语言使用 `zh-Hans | en | ja | fr`。映射在 `route.ts` 的 `langMap`。

新增语言时至少改：

- `Language` 类型和默认值策略。
- `page.tsx` 的 `T` 字典和语言选择器。
- `SettingsDialog.tsx` 的 `T` 字典。
- `route.ts` 的 `getLangName`、prompt 示例、标题前缀、`langMap`。
- 确认 `base.html` 模板本身支持该 locale；否则不要让 Web UI 暴露它。

## UI 设计约定

这个应用是一个工作型生成器，不是营销首页。第一屏应直接服务“输入需求 -> 设置模型 -> 生成 -> 预览/复制”的工作流。

- 使用现有 shadcn/ui 组件和 Tailwind token。
- 工具按钮优先使用 lucide 图标，必要时提供文本。
- 控件状态要完整：loading、disabled、error、success。
- 结果预览保持沉浸式 iframe；返回编辑和复制 HTML 是当前最小闭环。
- 不在 UI 中泄露实现细节，例如正则注入、template.ts 生成过程等。

## 安全与隐私

- API Key 由用户自带，前端 localStorage 保存，服务端不持久化。
- 不要添加服务端日志打印完整 API Key、prompt、生成 HTML 或 provider 原始响应，除非经过脱敏且确实用于调试。
- `iframe` 当前 sandbox 为 `allow-scripts allow-same-origin`。改 sandbox 前要确认清单模板中的 localStorage、复制、脚本执行是否仍能工作，并评估安全影响。
- 模型返回的 `html` 字段会进入最终单文件 HTML。若面向不可信公开输入，需要额外设计 sanitization；当前假设用户生成给自己使用。

## 验证清单

普通 UI 或 API 改动：

```bash
cd web
npm run lint
npm run build
```

模板或注入逻辑改动：

```bash
cd web
node scripts/convert.js
npm run build
```

再至少手动验证：

- 生成页能加载。
- 缺 API Key 时有错误提示。
- 设置 provider/model/API Key 能保存并重新打开。
- 成功生成后 iframe 展示完整清单。
- “返回修改”和“复制 HTML”工作。
- 生成的 HTML 里标题、摘要、模块、语言都被正确注入。

新增 provider 或语言时，至少用一个 mock/真实响应覆盖成功路径和错误路径。网络不可用时，说明未完成端到端验证。

## 开发注意事项

- 改功能前读本文，并查看相关源码，不凭记忆改。
- 保持 Web App 无状态；需要持久化时优先解释为什么 localStorage 不够。
- 生成数据 schema 要向 `base.html` 的 Living Checklist 引擎靠拢，不在前端发明第二套清单模型。
- 正则注入是脆弱边界。大改模板结构时，优先考虑抽出稳定占位标记或结构化注入点，再同步更新本文。
- `web/src/lib/SKILL.md` 是清单引擎 skill 的拷贝，不是 Web App 开发指南；不要把 Web App 架构规则混进去。
- 功能完成后，如果新增文件、状态字段、provider、语言、模板区块或验证命令，更新本文对应章节。
