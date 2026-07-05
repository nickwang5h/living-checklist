# Living Checklist Web App

这是一套为 **Living Checklist (活页清单)** 打造的无状态、所见即所得的 Web 生成器。

它允许用户自带大模型 API Key（BYOK），通过输入自然语言提示词，一键生成一个可交互的单文件 HTML 活页清单，并直接全屏预览和沉浸式使用。

---

## 🛠 技术栈 (Tech Stack)

- **框架**: [Next.js](https://nextjs.org/) (App Router 模式)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: [Shadcn UI](https://ui.shadcn.com/) (无头组件库，样式可完全自定义)
- **状态管理**: Zustand (用于本地持久化存储用户的 API Key 和偏好设置)

---

## 📂 核心目录结构

```text
web/
├── scripts/
│   └── convert.js          # 核心构建脚本：将 base.html 转译为 TypeScript 字符串
├── src/
│   ├── app/
│   │   ├── api/generate/   # 后端 API 路由：负责对接各大 LLM 模型，拼接 Prompt 并注入数据
│   │   ├── globals.css     # 全局样式 (Tailwind 引入)
│   │   ├── layout.tsx      # Next.js 根布局
│   │   └── page.tsx        # 主界面：负责用户输入、多语言切换、以及全屏 iframe 的渲染
│   ├── components/         # React 界面组件 (包含 SettingsDialog 和 Shadcn 的基础组件)
│   ├── lib/
│   │   ├── base.html       # 核心引擎：原始的单文件活页清单模板
│   │   ├── template.ts     # 自动生成：由 base.html 转译而来的常量字符串
│   │   └── utils.ts        # 工具函数 (Tailwind 类合并等)
│   └── store/
│       └── useSettingsStore.ts # 状态管理：存储用户配置 (API Key, 模型选择, 语言)
```

---

## 🧠 核心架构原理解析

为了保证最终生成的清单是一个**完全独立、离线可用的单文件 HTML**，同时又能在 Next.js 中极速响应，本应用采用了一种特殊的构建机制：

### 1. 模板预编译 (Pre-build Hook)
在每次执行 `npm run dev` 或 `npm run build` 之前，`package.json` 中的钩子会自动运行 `node scripts/convert.js`。
这个脚本会读取 `src/lib/base.html`，转义掉所有会引起语法错误的特殊字符（如反斜杠、反引号），并将其输出为 `src/lib/template.ts` 中的一个常量。
这使得 Next.js 在处理 API 请求时，无需进行磁盘 I/O 操作，直接以极高的性能在内存中拼接 HTML。

### 2. API 路由与正则注入 (`route.ts`)
当用户点击“生成”时，流程如下：
1. `route.ts` 接收用户的提示词和目标语言。
2. 构造动态 System Prompt，要求模型返回严格的 **JSON 数据**（包含 title, summary, modules）。
3. 使用预定义的正则表达式，在内存中精准替换掉 `template.ts` 里的默认数据占位符。
4. 强制注入匹配用户选择的界面语言 (`uiLang`)，以保证清单底层的按钮文字也是对应语言。
5. 将处理好的完整 HTML 源码作为纯文本返回给前端。

### 3. 全屏沉浸式渲染 (`page.tsx`)
前端收到 HTML 源码后，会立刻隐藏掉原本的生成器 UI，渲染一个 `100vw * 100vh` 的 `<iframe srcDoc={result}>`。
这让应用在视觉上瞬间“变身”为清单本身，做到了**所见即所得**。

---

## 🌍 多语言支持 (i18n)

目前系统支持四种语言：`中文 (zh)`、`English (en)`、`日本語 (ja)`、`Français (fr)`。

如果未来需要添加新的语言，需要修改以下三个地方：
1. **`useSettingsStore.ts`**: 在 `Language` 类型定义中追加新的语言缩写。
2. **`page.tsx` & `SettingsDialog.tsx`**: 在 `T` 字典对象中添加该语言的完整 UI 翻译。
3. **`route.ts`**:
   - 在 `getLangName` 函数中加入对应的语言全称指令。
   - 在 `langMap` 映射字典中，将前端选择的语言映射为 `base.html` 支持的底层 `uiLang`。

---

## 🚀 开发者指南

### 本地运行
```bash
npm install
npm run dev
```

### 如何更新底层的活页清单引擎？
如果你修改了根目录下 `examples/` 或是原本引擎的业务逻辑，只需将最新的单文件 HTML 源码覆盖到 `web/src/lib/base.html` 即可。
保存后，如果开发服务器正在运行，你需要**重启开发服务器**（因为转译脚本挂载在 `predev` 阶段），以使最新的底层代码生效。

### UI 定制
所有的组件都位于 `src/components/ui` 目录下，且完全向你开放了源码。如果想要修改某个按钮的样式或者输入框的交互，直接去对应文件里修改 Tailwind 类名即可，不需要像使用第三方组件库那样寻找晦涩的 API 覆盖。
