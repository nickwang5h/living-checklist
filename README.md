# Living Checklist

**English** · [Français](README.fr.md) · [简体中文](README.zh.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md)

[![Star on GitHub](https://img.shields.io/github/stars/MtsYama/living-checklist?style=social)](https://github.com/MtsYama/living-checklist/stargazers)

> **Find it useful?** A ⭐ Star is the best encouragement, and please share it with anyone who'd find it handy.
> Follow along: [GitHub @MtsYama](https://github.com/MtsYama) · [LinkedIn](https://www.linkedin.com/in/zhengshen-shu/)

> **Try it live (nothing to install):** https://mtsyama.github.io/living-checklist/

> A single HTML file that turns any step-by-step process into a living, self-saving checklist.

*Step by step HTML*, which is what I usually call it.


**Living Checklist** is one self-contained `.html` file. Inline CSS, inline JS, zero dependencies. Double-click it and it opens straight from `file://` in your browser. No build step, no server, no internet needed to run it.

You don't edit code to use it. You edit the *content* (a small DATA + CONFIG section with "fill your data here" anchors) and the engine underneath stays untouched. Then it comes alive: check an item and it slides to the bottom of its step, finish a whole step and the card folds itself away into a "Done" area, and a progress bar tracks the whole thing. Every check, fold, and note is saved to your browser automatically. Close the tab and reopen it later, and your progress is right where you left it.

**What this is (and isn't).** It's not a finished app you install. It's a way to generate a *living* checklist with AI, or by hand: describe what you need to an AI (ChatGPT, Claude, and the like), or edit the file yourself, and out comes a single HTML file you double-click to use. The tool itself has no AI inside; it runs on *your* AI to build the checklist. Down the road it may grow into a standalone app that syncs with Notion and similar tools. Not yet; today it's this single file plus a Claude skill.

**Who it's for.** People who already use AI, like checklists, and want AI to spin one up often, or who find existing checklist tools a bit stiff and want to try something else. Not yet for people who want a polished, ready-made app wired into Notion out of the box.

## Screenshots

| Base template (light) | MX Studio template (dark) | Worked example |
|---|---|---|
| ![Base template, light theme](assets/base-light.png) | ![MX Studio template, dark theme](assets/mx-dark.png) | ![Europe + Japan trip example](assets/example.png) |

## Quick start

1. Download or copy a template from [`templates/`](templates/) — start with [`base.html`](templates/base.html).
2. Double-click it. It opens in your browser.
3. That's it. Click items to check them, type notes, watch steps fold away as you finish them.

To make it *yours*, open the file in any text editor and edit the two clearly marked sections near the top: `[1] DATA` (your steps and items) and `[2] CONFIG` (title, languages, theme). The engine code below them never needs touching.

## What it actually does

- **Items sink as you check them** — a smooth FLIP animation moves done items to the bottom of their step, so what's left to do stays on top.
- **Steps file themselves away** — finish every item in a step and the whole card folds and moves into a "Done" area.
- **Progress bar** at the top tracks completion across all steps.
- **A note box per step** for anything you want to jot down.
- **Everything auto-saves** to `localStorage`. Close and reopen, and your checks, folds, and notes are all still there.
- **Toolbar**: Expand all · Collapse all · Reset checks · **Copy progress + feedback** (bundles your current progress and notes into markdown on your clipboard, so you can paste it back into an AI chat and ask for the next revision).
- **Floating controls** (bottom-right): language switch (only the languages this checklist actually ships), a 3-way theme toggle (Auto / Light / Dark — the button shows a small "A" badge in Auto), and a font toggle (Noto / system).
- **5 languages** out of the box: 简体中文, 繁體中文, English, Français, 日本語. Data is keyed per locale.
- **Accessible by default**: 18px+ body text, keyboard reachable, visible focus rings, an ARIA progressbar and live regions, screen-reader-correct collapse behavior, and it honors `prefers-reduced-motion`.

## Three ways to use it

**1. As a human, by hand.** Copy a template, edit the DATA and CONFIG sections, open the file. No tooling required.

**2. As a Claude skill.** This repo *is* the skill — [`SKILL.md`](SKILL.md) at the root plus the templates. Clone it into `~/.claude/skills/living-checklist/` (or install it via a plugin marketplace) and just ask your AI: *"make me a checklist for X."* It fills the template in for you.

**3. Chat-only, no command line.** Open any checklist and click the **"Copy the prompt"** button in the top banner. Paste it into any web AI chat — ChatGPT, Claude, Gemini, whatever you use — and it generates a simple checklist HTML for you. No install, no CLI, nothing to set up.

## Worked example

[`examples/`](examples/) shows the whole point of this tool: turning a messy, dictated request into an organized, time-sequenced, checkable plan.

- **The input** → [`examples/europe-japan-trip-prompt.md`](examples/europe-japan-trip-prompt.md)
- **The result** → [`examples/europe-japan-trip.html`](examples/europe-japan-trip.html) (base skin) and [`examples/europe-japan-trip-mx.html`](examples/europe-japan-trip-mx.html) (MX skin)

The input is a single run-on, voice-dictated trip request — the kind of thing you'd actually say out loud:

> *"Off from July 15 to Aug 15, want to travel Europe, mainly France and Italy, then swing by Japan. Chinese passport. Already booked the Shanghai → France flight, return not booked yet. I'm picky about food. Definitely want the Louvre, and if there's a day it's quiet I'd rather go then even over a free day..."*

From that, the skill produces a structured plan with **7 modules**: visa, flights, stay, food, museums and exhibits, gifts, and pre-departure. It's also context-aware:

- The two flights that are already booked come **pre-checked**.
- Identity fields are **pre-filled** from what's known (a sample "John Doe").
- Everything still unknown — passport number, the return flight, visa details — is left as a **prompting placeholder** so the plan tells you exactly what's missing.

That's the loop: messy input in, organized plan out, and you check it off as you go.

## Customize / make your own skin

The two templates are two *skins* over the same engine:

| Template | Look | Fonts | Default theme |
|---|---|---|---|
| [`base.html`](templates/base.html) | Light, green accent, clean | Noto | Auto |
| [`mx-studio.html`](templates/mx-studio.html) | Dark noir + gold, editorial, big folio step numbers, Phosphor icons | Cormorant Garamond + Alegreya + LXGW WenKai + IBM Plex Mono | Dark |

To make your own skin, copy a template and change the CSS variables at the top (colors, fonts, spacing). The data and engine stay the same, so you can restyle freely without breaking any behavior. If you want a starting point that's already opinionated, fork `mx-studio.html` and swap the palette.

## Repo layout

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

## License

[MIT](LICENSE). Commercial use is fine. Fork it, sell what you build with it, no strings.

All fonts ship under OFL or MIT via Google Fonts, so there are no non-commercial font restrictions to worry about.

## Credits

Built by **Mts Yama** ([@MtsYama](https://github.com/MtsYama)) · [github.com/MtsYama/living-checklist](https://github.com/MtsYama/living-checklist)

Fonts: Noto, Cormorant Garamond, Alegreya, LXGW WenKai, and IBM Plex Mono (all via Google Fonts). Icons in the MX skin from [Phosphor](https://phosphoricons.com/).
