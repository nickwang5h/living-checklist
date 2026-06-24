# 活頁清單

[English](README.md) · [Français](README.fr.md) · [简体中文](README.zh.md) · **繁體中文** · [日本語](README.ja.md)

[![GitHub Stars](https://img.shields.io/github/stars/MtsYama/living-checklist?style=social)](https://github.com/MtsYama/living-checklist/stargazers)

> **覺得有用？** 給個 ⭐ Star 是對我最大的鼓勵，也歡迎分享 / 推薦給可能需要的人。
> 關注我：[GitHub @MtsYama](https://github.com/MtsYama) · [領英 LinkedIn](https://www.linkedin.com/in/zhengshen-shu/)

> **點開就能試（不用裝任何東西）：** https://mtsyama.github.io/living-checklist/

## 安裝（一次貼上）

用 Claude Code 的話，把這個 repo 當 plugin marketplace 加進去，再裝 skill：

```
/plugin marketplace add MtsYama/living-checklist
/plugin install living-checklist@living-checklist
```

然後要麼跑 `/living-checklist:living-checklist`，要麼直接跟 AI 說「給我做一份關於 X 的清單」——它會幫你把模板填好。

不用 Claude Code？還有兩種走法：把 repo clone 到 `~/.claude/skills/living-checklist/`，或者乾脆不裝，[把 prompt 複製](#三種用法)到任意網頁 AI 聊天裡。詳見下面[三種用法](#三種用法)。


「Step by step HTML」，我一般也這麼叫它。

一份「活的」、分步驟的清單引擎，整個就是**一個 HTML 檔案**。雙擊打開就能用，沒有建置、沒有伺服器、不連網也能跑。

勾掉一條，它會平滑地收進這一步頂部的「✓ 已完成」分組；整步做完，卡片會掛上「✓ 已完成」徽標、就地摺疊起來（不會被挪到頁面底部）。進度自動存在瀏覽器裡，關掉再打開還在。

**這是什麼（不是什麼）。** 它不是一個裝上就能用的成品 app，而是一種用 AI、或者手動產生一份「活的」清單的方式：把需求說給 AI（ChatGPT、Claude 這些），或者自己改一下檔案，它就產出一個 HTML 檔案，雙擊就能用。工具本身不帶 AI，靠你自己的 AI 來把清單產生出來。後面也許會長成一個能對接 Notion 那類工具的獨立 app，但現在還沒有；今天它就是這一個檔案加一個 Claude skill。

**適合誰。** 已經習慣用 AI、喜歡用清單、想讓 AI 常幫你拉一份的人；或者覺得現有清單工具用著不太順手、想試點別的的人。暫時還不適合想要一個裝上就能用、且開箱即對接 Notion 的成品 app 的人。

![base 模板，淺色](assets/base-zh-Hant.png)

## 這是什麼

- **單檔案**：一個自包含的 `.html`，CSS 和 JS 全內聯，**零依賴**。透過 `file://` 雙擊打開即可，執行時不需要建置、不需要伺服器、不需要連網。
- **資料驅動**：你只改內容（`MODULES` + `SUMMARY` + `CONFIG` 三段，裡面有「在這裡填你的資料」的註解錨點），引擎程式碼原封不動。
- **「活的」**：
  - 勾選一條 → 它用 FLIP 動畫平滑收進本步頂部的「✓ 已完成」分組（不想它動？工具列點「勾完自動收起」關掉就行）；
  - 整步勾完 → 卡片掛上「✓ 已完成」徽標、就地摺疊（不會被挪到頁面底部）；
  - 頂部有總進度條；
  - **每個條目各帶一個備註框**，自動儲存，複製進度時一起帶走，方便回頭問 AI。
- **巢狀子清單**：任意條目下都能展開一層更細的子清單，某一條需要單獨拆開時用。
- **一次性新手引導**（只在模板裡）：輕輕領你走完第一次勾選、寫備註、複製進度，不看說明也能上手。
- **自動儲存**：勾選 / 摺疊 / 備註全部寫進瀏覽器的 `localStorage`，關掉再打開，原樣都在。
- **可摺疊工具列**：全部展開 / 全部摺疊 / 重設勾選 / 勾完自動收起 / 「複製進度 + 回饋」（把目前進度和每條備註打包成 markdown 放到剪貼簿，貼回 AI 對話裡就能驅動下一輪迭代）。
- **連結一律新開分頁**，點參考連結不會把清單頁跳走、丟掉進度。
- **右下角浮動控制項**：
  - 語言切換（只列出這份清單實際提供的語言）；
  - 主題三態（自動 / 淺色 / 深色，「自動」時按鈕上有個小小的「A」角標）；
  - 字型切換（Noto / 系統字型）。
- **多語言**：內建 5 種語言（zh-Hans / zh-Hant / en / fr / ja），資料按 locale 分鍵。
- **無障礙**：正文 18px 起，鍵盤可達，focus 有可見的聚焦環，ARIA 進度條 + live region，摺疊對螢幕閱讀器正確，尊重 `prefers-reduced-motion`。

## 模板

預設模板提供兩種乾淨配色——**黛藍 / Lapis blue**（預設）和**酒紅 / Burgundy**——外加一套 **MX Studio** 暗色設計師皮。模板都在 `templates/` 下。

| 模板 | 風格 | 預設主題 |
| --- | --- | --- |
| `base.html` | 乾淨的行事曆 App 風，淺色、克制，黛藍點綴（系統黑體 / Noto）。預設通用模板。 | 自動 |
| `base-burgundy.html` | 同一套乾淨預設模板，換成暖調的酒紅點綴。 | 自動 |
| `mx-studio.html` | 深色 noir + 金色，襯線字型（Cormorant Garamond + Alegreya + 霞鶩文楷 + IBM Plex Mono），大號 folio 步驟編號，Phosphor 圖示。 | 深色 |

![mx-studio 模板，深色](assets/mx-zh-Hant.png)

## 三種用法

### 1. 當人手動用

複製一份模板，改裡面的 `[1] DATA` 和 `[2] CONFIG` 兩段，打開檔案。不用建置。

### 2. 當 Claude skill 用（這個 repo 本身就是 skill）

在 Claude Code 裡最快的方式是一次貼上裝好：

```
/plugin marketplace add MtsYama/living-checklist
/plugin install living-checklist@living-checklist
```

然後跑 `/living-checklist:living-checklist`，或者直接跟你的 AI 說「給我做一份關於 X 的清單」，它會幫你把模板填好。不想走 marketplace？也可以把 repo 直接 clone 到 `~/.claude/skills/living-checklist/`——根目錄的 `SKILL.md` + `templates/` 就是這個 skill 的全部。

### 3. 純聊天（沒有命令列也行）

打開任意一份清單，點頂部橫幅裡的「複製這段提示詞」按鈕，貼到任意網頁版 AI 對話裡（ChatGPT / Claude / Gemini 等），它會產生一份簡單的清單 HTML。

## 一個完整例子

`examples/` 裡放了一個走通的例子：

- `examples/europe-japan-trip.html`（base 模板）
- `examples/europe-japan-trip-mx.html`（mx 模板）
- `examples/europe-japan-trip-prompt.md`（輸入的原始需求）

它演示的是：把一段語音口述、亂糟糟的旅行需求（「7 月 15 號到 8 月 15 號休假，想去法國 + 義大利 + 日本，中國護照，吃的很挑，想挑個人少的日子去羅浮宮……」）變成一份有條理、可勾選、按時間排好的計劃：7 個模組（簽證、機票、住宿、吃、博物館 / 展覽、禮物、出發前）。

這個例子也展示了「按上下文產生」：2 張已經訂好的機票預先勾上，身分資訊預先填好（範例 John Doe），不確定的欄位留成提示性的佔位符。

![旅行例子](assets/example-zh-Hant.png)

## 倉庫結構

```
living-checklist/
  README.md          英文說明
  README.zh.md       簡體中文說明
  LICENSE            MIT
  SKILL.md           Claude skill 定義
  templates/
    base.html        乾淨淺色預設模板（黛藍點綴）
    base-burgundy.html 同款預設模板（酒紅點綴）
    mx-studio.html   noir 設計師皮（深色 / 金）
  examples/
    europe-japan-trip.html       走通的例子（base）
    europe-japan-trip-mx.html     走通的例子（mx）
    europe-japan-trip-prompt.md   對應的輸入需求
  assets/            截圖
```

## 快速上手

1. 下載 `templates/base.html`（或 `mx-studio.html`）。
2. 用文字編輯器打開，找到 `[1] DATA` 和 `[2] CONFIG` 兩段，按裡面的註解錨點填你自己的內容。
3. 儲存，雙擊打開。開始勾。

不想手填？把模板 + 你的需求丟給 AI，讓它替你填（見上面的「三種用法」）。

## 瀏覽器支援

任何現代瀏覽器（Chrome / Edge / Firefox / Safari）都行。進度存在該瀏覽器的 `localStorage` 裡，所以同一份檔案在同一個瀏覽器裡再打開，進度還在；換瀏覽器或換裝置不會同步。

## 協議

MIT，見 [LICENSE](LICENSE)。可商用。

所有字型都透過 Google Fonts 引入，授權為 OFL 或 MIT，沒有任何禁止商用的字型。

## 作者

Mts Yama（[@MtsYama](https://github.com/MtsYama)）

倉庫地址：https://github.com/MtsYama/living-checklist
