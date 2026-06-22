# 活页清单

[English](README.md) · [Français](README.fr.md) · **简体中文** · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md)

[![GitHub Stars](https://img.shields.io/github/stars/MtsYama/living-checklist?style=social)](https://github.com/MtsYama/living-checklist/stargazers)

> **觉得有用？** 给个 ⭐ Star 是对我最大的鼓励，也欢迎分享 / 推荐给可能需要的人。
> 关注我：[GitHub @MtsYama](https://github.com/MtsYama) · [领英 LinkedIn](https://www.linkedin.com/in/zhengshen-shu/)

> **点开就能试(不用装任何东西):** https://mtsyama.github.io/living-checklist/


「Step by step HTML」,我一般也这么叫它。

一份「活的」、分步骤的清单引擎，整个就是**一个 HTML 文件**。双击打开就能用，没有构建、没有服务器、不联网也能跑。

勾掉一条，它会平滑地沉到这一步的底部；整步做完，卡片会自己折叠、归档到「已完成」区。进度自动存在浏览器里，关掉再打开还在。

**这是什么(不是什么)。** 它不是一个装上就能用的成品 app,而是一种用 AI、或者手动生成一份「活的」清单的方式:把需求说给 AI(ChatGPT、Claude 这些),或者自己改一下文件,它就产出一个 HTML 文件,双击就能用。工具本身不带 AI,靠你自己的 AI 来把清单生成出来。后面也许会长成一个能对接 Notion 那类工具的独立 app,但现在还没有;今天它就是这一个文件加一个 Claude skill。

**适合谁。** 已经习惯用 AI、喜欢用清单、想让 AI 常帮你拉一份的人;或者觉得现有清单工具用着不太顺手、想试点别的的人。暂时还不适合想要一个装上就能用、且开箱即对接 Notion 的成品 app 的人。

![base 模板，浅色](assets/base-light.png)

## 这是什么

- **单文件**：一个自包含的 `.html`，CSS 和 JS 全内联，**零依赖**。通过 `file://` 双击打开即可，运行时不需要构建、不需要服务器、不需要联网。
- **数据驱动**：你只改内容（`MODULES` + `SUMMARY` + `CONFIG` 三段，里面有「在这里填你的数据」的注释锚点），引擎代码原封不动。
- **「活的」**：
  - 勾选一条 → 它用 FLIP 动画平滑沉到本步底部；
  - 整步勾完 → 卡片折叠、自动归档到「已完成」区；
  - 顶部有总进度条；
  - 每一步带一个备注框，自动保存。
- **自动保存**：勾选 / 折叠 / 备注全部写进浏览器的 `localStorage`，关掉再打开，原样都在。
- **工具栏**：全部展开 / 全部折叠 / 重置勾选 / 「复制进度 + 反馈」（把当前进度和备注打包成 markdown 放到剪贴板，粘回 AI 对话里就能驱动下一轮迭代）。
- **右下角浮动控件**：
  - 语言切换（只列出这份清单实际提供的语言）；
  - 主题三态（自动 / 浅色 / 深色，「自动」时按钮上有个小小的「A」角标）；
  - 字体切换（Noto / 系统字体）。
- **多语言**：内置 5 种语言（zh-Hans / zh-Hant / en / fr / ja），数据按 locale 分键。
- **无障碍**：正文 18px 起，键盘可达，focus 有可见的聚焦环，ARIA 进度条 + live region，折叠对屏幕阅读器正确，尊重 `prefers-reduced-motion`。

## 两套模板

模板都在 `templates/` 下。

| 模板 | 风格 | 默认主题 |
| --- | --- | --- |
| `base.html` | 浅色、绿色点缀、Noto 字体。通用默认模板。 | 自动 |
| `mx-studio.html` | 深色 noir + 金色，衬线字体（Cormorant Garamond + Alegreya + 霞鹜文楷 + IBM Plex Mono），大号 folio 步骤编号，Phosphor 图标。 | 深色 |

![mx-studio 模板，深色](assets/mx-dark.png)

## 三种用法

### 1. 当人手动用

复制一份模板，改里面的 `[1] DATA` 和 `[2] CONFIG` 两段，打开文件。不用构建。

### 2. 当 Claude skill 用（这个 repo 本身就是 skill）

根目录的 `SKILL.md` + `templates/` 就构成一个完整的 skill。把它 clone 到 `~/.claude/skills/living-checklist/`（或者放进 plugin marketplace），然后跟你的 AI 说「给我做一份关于 X 的清单」，它会帮你把模板填好。

### 3. 纯聊天（没有命令行也行）

打开任意一份清单，点顶部横幅里的「复制这段提示词」按钮，粘到任意网页版 AI 对话里（ChatGPT / Claude / Gemini 等），它会生成一份简单的清单 HTML。

## 一个完整例子

`examples/` 里放了一个走通的例子：

- `examples/europe-japan-trip.html`（base 模板）
- `examples/europe-japan-trip-mx.html`（mx 模板）
- `examples/europe-japan-trip-prompt.md`（输入的原始需求）

它演示的是：把一段语音口述、乱糟糟的旅行需求（「7 月 15 号到 8 月 15 号休假，想去法国 + 意大利 + 日本，中国护照，吃的很挑，想挑个人少的日子去卢浮宫……」）变成一份有条理、可勾选、按时间排好的计划：7 个模块（签证、机票、住宿、吃、博物馆 / 展览、礼物、出发前）。

这个例子也展示了「按上下文生成」：2 张已经订好的机票预先勾上，身份信息预先填好（示例 John Doe），不确定的字段留成提示性的占位符。

![旅行例子](assets/example.png)

## 仓库结构

```
living-checklist/
  README.md          英文说明
  README.zh.md       简体中文说明
  LICENSE            MIT
  SKILL.md           Claude skill 定义
  templates/
    base.html        通用模板（浅色 / 绿）
    mx-studio.html   noir 模板（深色 / 金）
  examples/
    europe-japan-trip.html       走通的例子（base）
    europe-japan-trip-mx.html     走通的例子（mx）
    europe-japan-trip-prompt.md   对应的输入需求
  assets/            截图
```

## 快速上手

1. 下载 `templates/base.html`（或 `mx-studio.html`）。
2. 用文本编辑器打开，找到 `[1] DATA` 和 `[2] CONFIG` 两段，按里面的注释锚点填你自己的内容。
3. 保存，双击打开。开始勾。

不想手填？把模板 + 你的需求丢给 AI，让它替你填（见上面的「三种用法」）。

## 浏览器支持

任何现代浏览器（Chrome / Edge / Firefox / Safari）都行。进度存在该浏览器的 `localStorage` 里，所以同一份文件在同一个浏览器里再打开，进度还在；换浏览器或换设备不会同步。

## 协议

MIT，见 [LICENSE](LICENSE)。可商用。

所有字体都通过 Google Fonts 引入，授权为 OFL 或 MIT，没有任何禁止商用的字体。

## 作者

Mts Yama（[@MtsYama](https://github.com/MtsYama)）

仓库地址：https://github.com/MtsYama/living-checklist
