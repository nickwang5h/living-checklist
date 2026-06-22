# 活页清单 / Living Checklist

[English](README.md) · [Français](README.fr.md) · [简体中文](README.zh.md) · [繁體中文](README.zh-Hant.md) · **日本語**

[![GitHub Stars](https://img.shields.io/github/stars/MtsYama/living-checklist?style=social)](https://github.com/MtsYama/living-checklist/stargazers)

> **役に立ちましたか？** ⭐ Star が何よりの励みになります。必要そうな人がいたら、ぜひシェアしてください。
> フォロー：[GitHub @MtsYama](https://github.com/MtsYama) · [LinkedIn](https://www.linkedin.com/in/zhengshen-shu/)

> **すぐに試す（インストール不要）：** https://mtsyama.github.io/living-checklist/

> あらゆる step-by-step なプロセスを、自分で進捗を保存し続ける「生きたチェックリスト」に変える、たった 1 つの HTML ファイル。

「Step by step HTML」、私はいつもこう呼んでいます。


**Living Checklist** は、それ自体で完結した 1 つの `.html` ファイルです。CSS も JS もインライン、依存ゼロ。ダブルクリックすれば、ブラウザで `file://` から直接開きます。ビルド工程なし、サーバーなし、動かすのにインターネットも不要です。

使うのにコードを編集する必要はありません。編集するのは*コンテンツ*（「ここにデータを書く」というアンカー付きの小さな DATA + CONFIG セクション）だけで、その下のエンジンには手を触れません。そして、それは命を持ちます。項目にチェックを入れるとそのステップの一番下へ滑り落ち、ステップ全体を終えるとカードが自分でたたまれて「完了」エリアへ移動し、進捗バーが全体を追いかけます。チェック、折りたたみ、メモはすべて自動的にブラウザへ保存されます。タブを閉じてあとで開き直しても、進捗は離れたときのままそこにあります。

**これは何か（そして何ではないか）。** インストールして使う完成済みのアプリではありません。AI を使って、あるいは手作業で、「生きた」チェックリストを生成するための手段です。必要なことを AI（ChatGPT、Claude など）に伝えるか、自分でファイルを編集すると、ダブルクリックして使える 1 つの HTML ファイルが出来上がります。ツール自体に AI は入っていません。チェックリストを組み立てるのに使うのは*あなたの* AI です。いずれは Notion などのツールと同期する独立したアプリへ育つかもしれません。まだですが。今のところ、これはこの 1 つのファイルと 1 つの Claude スキルです。

**誰のためのものか。** すでに AI を使っていて、チェックリストが好きで、AI に頻繁に作ってもらいたい人。あるいは、既存のチェックリストツールが少し堅苦しいと感じ、別のものを試してみたい人に向いています。箱から出してすぐ Notion につながる、洗練された出来合いのアプリが欲しい人には、まだ向いていません。

## スクリーンショット

| ベーステンプレート（ライト） | MX Studio テンプレート（ダーク） | 実例 |
|---|---|---|
| ![Base template, light theme](assets/base-light.png) | ![MX Studio template, dark theme](assets/mx-dark.png) | ![Europe + Japan trip example](assets/example.png) |

## クイックスタート

1. [`templates/`](templates/) からテンプレートをダウンロードまたはコピーします — まずは [`base.html`](templates/base.html) から。
2. ダブルクリックします。ブラウザで開きます。
3. これだけです。項目をクリックしてチェックを入れ、メモを書き、終わったステップがたたまれていくのを眺めましょう。

*自分のもの*にするには、テキストエディタでファイルを開き、上部の明確に印が付いた 2 つのセクションを編集します。`[1] DATA`（ステップと項目）と `[2] CONFIG`（タイトル、言語、テーマ）です。その下のエンジンコードには一切触れる必要はありません。

## 実際に何をするのか

- **チェックすると項目が沈む** — なめらかな FLIP アニメーションで、完了した項目をそのステップの一番下へ移動させ、まだ残っているものが上に保たれます。
- **ステップが自分で片付く** — 1 つのステップ内の全項目を終えると、カード全体がたたまれて「完了」エリアへ移動します。
- 上部の**進捗バー**が、全ステップの完了状況を追います。
- **ステップごとのメモ欄**で、書き留めておきたいことをなんでも記録できます。
- **すべて自動保存** — `localStorage` に保存されます。閉じて開き直しても、チェック、折りたたみ、メモはすべてそのまま残っています。
- **ツールバー**：すべて展開 ・ すべて折りたたみ ・ チェックをリセット ・ **進捗 + フィードバックをコピー**（現在の進捗とメモを markdown にまとめてクリップボードへ入れるので、AI チャットに貼り戻して次の改訂をお願いできます）。
- **フローティングコントロール**（右下）：言語切り替え（このチェックリストが実際に同梱している言語だけ）、3 段階のテーマ切り替え（自動 / ライト / ダーク — 自動のときはボタンに小さな「A」バッジが表示されます）、フォント切り替え（Noto / システム）。
- 最初から使える**5 言語**：简体中文、繁體中文、English、Français、日本語。データはロケールごとにキー付けされています。
- **デフォルトでアクセシブル**：18px 以上の本文テキスト、キーボードで到達可能、見えるフォーカスリング、ARIA progressbar と live region、スクリーンリーダーに正しい折りたたみ挙動、そして `prefers-reduced-motion` を尊重します。

## 3 つの使い方

**1. 人間が手作業で。** テンプレートをコピーし、DATA と CONFIG セクションを編集して、ファイルを開く。ツールは一切不要です。

**2. Claude のスキルとして。** このリポジトリ*こそが*スキルです — ルートにある [`SKILL.md`](SKILL.md) とテンプレート一式。これを `~/.claude/skills/living-checklist/` にクローンする（またはプラグインマーケットプレイス経由でインストールする）だけで、あとは AI に *「X のチェックリストを作って」* と頼むだけ。テンプレートを埋めてくれます。

**3. チャットだけで、コマンドライン不要。** どのチドラックリストでも開いて、上部バナーの **「プロンプトをコピー」** ボタンをクリックします。それを任意の Web AI チャット — ChatGPT、Claude、Gemini、お使いのもの何でも — に貼り付ければ、シンプルなチェックリスト HTML を生成してくれます。インストールなし、CLI なし、セットアップするものは何もありません。

## 実例

[`examples/`](examples/) は、このツールの肝を示しています。雑然と口述された依頼を、整理され、時系列に並び、チェックできる計画へと変えることです。

- **入力** → [`examples/europe-japan-trip-prompt.md`](examples/europe-japan-trip-prompt.md)
- **結果** → [`examples/europe-japan-trip.html`](examples/europe-japan-trip.html)（base スキン）と [`examples/europe-japan-trip-mx.html`](examples/europe-japan-trip-mx.html)（MX スキン）

入力は、一続きで音声口述された 1 つの旅行依頼です — 実際に口に出して言いそうな類のものです。

> *「7 月 15 日から 8 月 15 日まで休み、ヨーロッパを旅行したい、主にフランスとイタリア、それから日本にも寄りたい。中国のパスポート。上海 → フランスの便はもう予約した、復路はまだ。食べ物にはうるさい。ルーヴルは絶対行きたいし、空いてる日があるならフリーの日を潰してでもその日に行きたい……」*

そこから、スキルは **7 つのモジュール**を持つ構造化された計画を生成します。ビザ、フライト、宿泊、食事、美術館・展示、お土産、出発前です。さらに文脈も読み取ります。

- すでに予約済みの 2 便は **チェック済み** の状態で入っています。
- 身元情報のフィールドは、わかっていることから **記入済み** になります（サンプルの「John Doe」）。
- まだ不明なものはすべて — パスポート番号、復路便、ビザの詳細 — **プロンプト用のプレースホルダー**として残され、計画が何が欠けているかを正確に教えてくれます。

これがそのループです。雑然とした入力が入り、整理された計画が出てきて、進めながらチェックを付けていく。

## カスタマイズ / 自分のスキンを作る

2 つのテンプレートは、同じエンジンの上に乗った 2 つの*スキン*です。

| テンプレート | 見た目 | フォント | デフォルトテーマ |
|---|---|---|---|
| [`base.html`](templates/base.html) | ライト、グリーンのアクセント、クリーン | Noto | 自動 |
| [`mx-studio.html`](templates/mx-studio.html) | ダークノワール + ゴールド、エディトリアル、大きな folio ステップ番号、Phosphor アイコン | Cormorant Garamond + Alegreya + LXGW WenKai + IBM Plex Mono | ダーク |

自分のスキンを作るには、テンプレートをコピーして、上部の CSS 変数（色、フォント、余白）を変えます。データとエンジンはそのままなので、挙動を壊すことなく自由にスタイルを変えられます。すでに方向性のはっきりした出発点が欲しければ、`mx-studio.html` を fork してパレットだけ差し替えましょう。

## リポジトリ構成

```
living-checklist/
├── README.md              this file (English)
├── README.zh.md           简体中文
├── LICENSE                MIT
├── SKILL.md               Claude skill definition (this repo is the skill)
├── templates/
│   ├── base.html          light / green / Noto — general default
│   └── mx-studio.html     dark noir / gold / serif
├── examples/
│   ├── europe-japan-trip.html       worked example (base skin)
│   ├── europe-japan-trip-mx.html    worked example (MX skin)
│   └── europe-japan-trip-prompt.md  the messy input behind it
└── assets/
    ├── base-light.png     screenshot — base template
    ├── mx-dark.png        screenshot — MX template
    └── example.png        screenshot — the trip example
```

## ライセンス

[MIT](LICENSE)。商用利用も問題ありません。fork して、それで作ったものを売って構いません、制約はありません。

すべてのフォントは Google Fonts 経由で OFL または MIT のもとで同梱されているため、非商用のフォント制限を気にする必要はありません。

## クレジット

制作：**Mts Yama**（[@MtsYama](https://github.com/MtsYama)）· [github.com/MtsYama/living-checklist](https://github.com/MtsYama/living-checklist)

フォント：Noto、Cormorant Garamond、Alegreya、LXGW WenKai、IBM Plex Mono（すべて Google Fonts 経由）。MX スキンのアイコンは [Phosphor](https://phosphoricons.com/) より。
