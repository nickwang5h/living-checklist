---
name: living-checklist
description: 生成一份「活的」step-by-step 操作清单 / 进度清单 —— 单 HTML 文件、内嵌 CSS+JS、双击即开、零依赖、进度自动存浏览器。勾选条目自动收进本步顶部「✓ 已完成」分组、整步完成挂徽标就地折叠、带 FLIP 平滑重排与折叠动画、顶部进度条、每条目各带备注、嵌套子清单。触发:用户要 step-by-step 操作清单 / 活的进度清单 / 可勾选的待办流程 / 「给我做个清单照着做」/ 长流程分步追踪 时。
---

# Living Checklist 引擎

## 这是什么

一个数据驱动的单文件 HTML 清单引擎。换一份内容(MODULES + SUMMARY_HTML + CONFIG)就生成一份全新的活清单,引擎代码一行不用动。产物是单个 `.html`,纯 `file://` 双击即开,零外部依赖,所有进度(打勾 / 折叠态 / 备注)自动存当前浏览器 localStorage。

核心体验:
- 勾选一条 → 它平滑收进本步顶部的「✓ 已完成」收起组(FLIP 过渡 · 默认收起 · 可一键展开找回);可在工具栏「勾完自动收起」关掉不让它动
- 一步全勾完 → 整张卡片挂上「✓ 已完成」徽标、**就地折叠**(不再滑到页面底部 / 不归档到底部「已完成」区)
- 顶部进度条(渐变填充 + tabular-nums 计数)实时刷新
- **每个条目各带一个自动保存的备注框**(不是每步一个);备注随「复制进度 + 反馈」一起带走
- **嵌套二级子清单**:任意条目下可展开一层更细的可折叠子清单
- **一次性新手引导**(只在模板里 · `CONFIG.tour`):轻领用户走完首次勾选 / 写备注 / 复制进度
- 可折叠工具栏:全部展开 / 全部折叠 / 清空打勾 / 勾完自动收起 / **复制进度 + 反馈** 五个按钮(复制项把进度 + 勾选 + 每条备注一键拼成 markdown 进剪贴板,粘回对话即可驱动下一步迭代)
- **右下角悬浮控制**(不随滚动):语言切换(只显示该清单提供的语言)+ 主题 **3 档(Auto/Light/Dark · base 默认浅 / mx 默认暗 · 记忆)** + 字体(Noto / 系统)
- 清单内链接一律新开标签页(不把清单页跳走、丢进度)

## 何时触发

用户要 **step-by-step 操作清单** 或 **活的进度清单** 时。典型说法:「给我做个清单照着做」/「分步骤追踪这个流程」/「可勾选的待办」/「把这个长流程做成能打勾的」。**不适用**纯静态文档说明。

## 打开 / 处理任意 checklist 类 HTML 前:检测 → 询问(不默认全更新)

**触发**:要打开 / 处理任意「可勾选清单 / step-by-step 操作清单 / 进度清单」类 HTML 时(不管是不是本 skill 之前生成的)。

**动作**:
1. **先检测它用的是不是最新引擎**(标志:数据驱动 `MODULES` + 勾选收进本步顶部「✓ 已完成」组 + 整步挂徽标就地折叠 + 进度条 + localStorage + i18n/主题控制 + 每条目备注 + 嵌套子清单)。
2. **不一致**(别人做的 / 旧版 / 手搓静态 checkbox)→ **不要默认覆盖** · 先在对话里**问用户**三选一:
   - **(a) 保留原版**不动(有时就是要留旧的);
   - **(b) 升级到最新引擎**(并选哪套模板:base / mx-studio / 用户自己的);
   - **(c) 只换模板皮**(内容不动 · 只换配色字体那套)。
3. **升级时(用户选 b/c)**:**先备份** `<file>.bak`(铁律:覆写前必备份)→ 抽内容迁进新引擎 `[1] DATA`,内容**一字不动** · `item id` / `storagePrefix` 稳定(别丢勾选)→ 对 `.bak` 逐块 diff 确认零丢失。
4. **已是最新** → 直接用,不折腾。

**为什么**:清单从各种来源进来,**但不能假设全都要更新**——有时旧版就是要保留。检测到不一致 = 提醒 + 让用户决定,而不是默默升级。

## 怎么用(给 AI 的操作步骤)

1. **选一套模板**(`templates/` 下):`base.html`(干净日历 App 风 · 黛蓝 Lapis blue accent · 系统黑体 / Noto · 通用默认)、`base-burgundy.html`(同款默认 · 换成酒红 Burgundy accent)或 `mx-studio.html`(暗金衬线设计师皮)。复制到项目里你存放产物的位置。
2. 只改文件里 `[1] DATA`(SUMMARY + MODULES)和 `[2] CONFIG`(storagePrefix / lang / languages / theme / font)两段(都有「在这里填你的数据」注释锚点),`[3] CSS` / `[4] ENGINE` 不动。
3. 改完即成品。无需构建、无需服务器,双击打开验证。

## 命名 / 主题 / 标点(生成实例时务必照做)

- **标题命名**:把标题(I18N 的 `appTitle`/`docTitle` + 静态 `<title>`/`<h1>`)改成 **`活页清单 · [项目专名]`**(品牌在前、专名在后、中点 `·` 分隔)。**别留模板默认的「活页清单」泛名** —— 多个实例都叫「活页清单」会分不清。模板自身:base = `活页清单 · 基础模板`、mx = `活页清单 · 设计师模板`。
- **主题默认**:base 默认 `auto`(跟随系统 · 按钮带「A」角标一眼可辨)、mx 默认 `dark`(暗金固定)。主题按钮是 **3 档循环 Auto / Light / Dark**(选择记忆)。
- **副名 aka**:两个模板副标题下那行小字(en/fr 斜体 *Step by step HTML*、简繁日「Step by step HTML」)是 **工具署名 · 只留模板**。生成真实实例时,把 5 个 locale 的 `aka` 字段都清空(`aka:""`),实例不带这个署名。
- **中文标点全角**:中文内容里 `：？！；` 用全角(不是半角 `:?!;`)。
- **缺信息别瞎编**:用户没给的具体信息(日期 / 号码 / 偏好等),把对应 `notePlaceholder` 写成"追问用户补这一项"的提示,而不是编一个值。

## 模板库(可扩)

skill 目录 `templates/` 是一个**模板库** —— 同一套引擎 + 不同皮。默认模板出两种干净配色(Lapis / Burgundy)+ MX 设计师皮:
- `base.html` — 干净的日历 App 风(浅色、克制)· **黛蓝 / Lapis blue** accent(默认)· 系统黑体 / Noto 字体(中英日同源)· 默认通用模板。
- `base-burgundy.html` — 同一套干净默认模板,换成 **酒红 / Burgundy** accent。和 base 只差一个 accent 配色。
- `mx-studio.html` — 暗金 noir + Cormorant Garamond(标题)+ Alegreya(英法正文)+ LXGW 霞鹜文楷(CJK)+ IBM Plex Mono · 编号大号 folio 浮右上角 · 每 step/现状 Phosphor 图标。
- **加你自己的模板**:复制任一套 → 改 `[3] CSS` 的 `:root` 配色 + 字体 vars → 重命名 `templates/<你的名字>.html`。引擎逻辑不用动(Lapis 与 Burgundy 就是这么来的:同一 base 换一个 accent)。
- 生成清单时:默认 `base`(黛蓝);用户要暖一点 / 红一点 → `base-burgundy`;要"暗一点 / 高级感"→ `mx-studio`;用户有自己的模板 → 用那套。

## 数据模型怎么填

`[1] DATA` 段:

- `SUMMARY_HTML`(顶部现状块,可设 null 不渲染)—— 两段式:
  - `<strong>现状:</strong>` 一句话当前处境 / 背景 / 硬约束。
  - `<strong>必做:</strong>` 不可漏的硬截止 / 关键动作。
- `MODULES`(步骤数组),每个 `{ id, title, items: [{ id, html }] }`:
  - `module.id`:步骤稳定标识,改文案别改它(否则丢历史勾选)。
  - `item.id`:**只需在同一模块内唯一**。引擎用复合键 `item::<mid>::<iid>` 存储,跨模块 / 跨清单撞名都安全(命名空间隔离)。
  - `item.html`:条目正文,支持行内 HTML(`<code>` `<strong>` `<a>` 等)。
  - **每条目自带备注框**:引擎给**每个 `item` 各渲染一个常驻备注框**(宽屏在条目右侧、窄屏在条目下方 · 自动保存 · 键 `item::<mid>::<iid>` 的备注随「复制进度 + 反馈」一起导出)。占位文案走全局 I18N `itemNotePlaceholder`(不是每步一个)。**注意**:不再是「每步一个备注框」—— 旧版那种 per-step 备注已被 per-item 取代。
  - **可选富字段(不填则降级回最简样式 · 向后兼容)**:`module.stepNum`(步骤号,如 "1")/ `module.tag`(`"key"` 关键 / `"skip"` 可跳过 → 带文字 badge)/ `module.meta`(标题下一行小字 · 背景 / 硬约束)/ `module.links`(`[{ text, href }]` 模块底部参考链接)/ `item.defaultChecked`(见下「自动勾选规则」)/ `module.fillData`(`[{ label, value }]` 帮你预填的字段 · 渲染成每字段「复制」+「复制全部」)。
  - `item.children`(嵌套二级子清单):某条目下挂一层**可折叠**的更细清单。值为 `[{ id, html, defaultChecked? }]`,另可选 `item.childrenLabel`(折叠按钮文案,缺省用 I18N `subToggle`)。子项**独立勾选**(独立命名空间键 `sub::<mid>::<iid>::<sid>`),**不收进已完成组、不计入进度、不参与整步折叠** —— 用来表达「随讨论 / 文件更新,在原有条目下补更细的规则和对应清单」。子项 `id` 只需在该父条目内唯一。**只一层**(子项自己不再嵌套)。见 basics demo 的「需要更细的步骤」条。

`[2] CONFIG` 段:换清单**务必改 `storagePrefix`**(隔离 localStorage)。`lang` 默认语言 · `languages` 这份清单提供哪些语言(**只显示这些** · 单语言则不显示语言键 · **数组顺序 = 切换器按钮顺序**)· `theme`(auto/light/dark)· `font`(noto/system)· `summaryDefaultOpen` / `moduleDefaultOpen`。

**多语言内容**:`SUMMARY` / `MODULES` 可写成纯数组(单语言 · 向后兼容)**或** 按 locale 键的对象 `{ 'zh-Hans':[…], 'en':[…] }`。多语言时各 locale 的 `module.id` / `item.id` **保持一致**,切语言不丢勾选(`item.html` / `title` 才是要翻译的文案)。支持 5 种语言:`zh-Hans` / `zh-Hant` / `en` / `fr` / `ja`。

## 顶部「现状块」怎么写

不是装饰,是这份清单的「为什么现在做、不能漏什么」。现状一句话讲清处境与硬约束,必做列硬截止与关键动作。让人扫一眼就知道全局,再往下逐项勾。写不出有信息量的现状块就设 `SUMMARY_HTML = null`,别放套话。

## A11y 硬规则(不可破坏)

这是引擎的红线,移植 / 改样式时务必保留:

- 正文 ≥18px(模板取 20px)· caption / mono ≥14px。
- `text-wrap: pretty` + 标题 `text-wrap: balance` + `orphans/widows: 3`(防孤行)。
- 键盘可达 + 显式 `:focus-visible` 焦点环。
- 进度条 `role="progressbar"` + `aria-valuenow/valuetext`,计数 `aria-live="polite"`。
- 折叠:折叠头 `aria-expanded` + `aria-controls`;内容容器用 `[hidden]` 控制语义可达性。**动画结束态必须让 `body.hidden` 与 `aria-expanded` 一致** —— 折叠动画跑在外层 `.collapse-sleeve`(只管 max-height 视觉),内层 body 的 `hidden` 才是给读屏的真相。读屏绝不能读到折叠掉的内容。
- 所有动画(FLIP 重排 + max-height 折叠)在 `prefers-reduced-motion: reduce` 下退化为瞬时切换(防眩晕)。

## 自动勾选规则(默认关)

**默认让人自己勾** —— 人确认 / 人填是这东西的意义,全自动勾有风险(全给勾了但没逐条对照看)。

处理清单时:
- **只对对话内确认过 / 一起做过**的项,才在生成 / 更新时设 `item.defaultChecked: true`,且要提醒用户复核。
- **没确认过的绝不自动勾** —— 提醒用户回 HTML 自己勾。
- 引擎保证:`defaultChecked` 只作"无 localStorage 记录时"的初始态,一旦用户勾过(有记录)**永不被覆盖**。

安全侧默认偏保守。

## 落点

生成的 `.html` 放到项目里你平时存放产物的任意位置即可 —— 它是自包含单文件,不依赖目录结构。文件名建议 `<短词>-checklist.html` 或 `操作清单.html`。

## 示例

`examples/` 目录有一个完整 worked example(一次欧洲 + 日本旅行规划),含 base 与 mx-studio 两套皮以及作为输入的 prompt,演示如何把一段散乱的需求转成有时间线、可勾选的分步计划。具体写法照着 `examples/` 看即可。
