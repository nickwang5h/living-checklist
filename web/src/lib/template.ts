export const baseTemplate = `<!DOCTYPE html>
<html lang="zh-Hans" data-theme="light" data-font="noto">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>活页清单 · 基础模板</title>
<!--
  ============================================================================
  LIVING CHECKLIST (活页清单) engine · base template · v3
  ============================================================================
  Single HTML file · inline CSS+JS · data-driven · progress stored in localStorage.
  Uses the Noto font when online (same source/weight across CN/EN/JP); falls back
  to system fonts when offline.

  ============= FILL IN YOUR DATA HERE =============
    Search "[1] DATA"   → edit SUMMARY + MODULES (single-language array, or multi-language keyed by locale).
    Search "[2] CONFIG" → edit storagePrefix / lang / languages / theme / font.
    Search "[2b] I18N"  → UI strings, multi-language (the localization layer · usually no need to touch).
    [3] CSS / [4] ENGINE usually don't need touching.

  v3 builds on v2 (rich schema + feedback export + auto-checking) by adding:
    · Chinese product name "活页清单" · Noto font (web + system fallback) + font toggle
    · Dark / light toggle (follows the system + remembers your choice)
    · Language switch (zh-Hans / zh-Hant / EN / FR / JA · only the languages this checklist provides are shown)
    · Bottom-right floating control cluster (language · sun/moon · font)
    · Tag legend (shown only when there are tags) + soft color palette
  ============================================================================
-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Sans+SC:wght@400;600;700&family=Noto+Sans+TC:wght@400;600;700&family=Noto+Sans+JP:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  /* =========================================================================
     [3] CSS
     ========================================================================= */

  :root {
    /* Font sizes — A11y hard rule: body target 20px · caption/mono/tag >=14px */
    --fs-body: 20px;
    --fs-title: 1.35rem;
    --fs-summary-title: 1.15rem;
    --fs-caption: 14px;
    --fs-mono: 14px;

    /* —— THE ONE ACCENT —— change this single value to re-skin the whole accent color.
       Default is a calm "Lapis blue" (cool, restrained, bookish blue).
       To switch to another color, change just the --c-accent line; the other soft colors derive automatically via color-mix. */
    --c-accent: #345ea5;

    /* —— Light theme (default · clean light ground, calendar-app feel) —— */
    --c-bg: #f1f3f6;                /* very pale cool-gray page ground */
    --c-card: #ffffff;              /* cards are pure white · separated by hairlines */
    --c-panel: #e7eaf0;             /* secondary panel / done-area pale blue-gray */
    --c-ink: #1b2024;               /* near-black body text */
    --c-ink-soft: #5a626d;          /* secondary gray */
    --c-line: #dde1e8;              /* hairline divider */
    --c-accent-soft: color-mix(in srgb, var(--c-accent) 9%, #ffffff);   /* soft ground for the "Key" tag */
    --c-on-accent: #ffffff;
    --c-skip-bg: #e9ebf0;           /* gray ground for the "Skip-ok" tag */
    --c-skip-ink: #6e6e73;
    --c-done: #a6abb3;              /* done-state light gray */
    --c-focus: var(--c-accent);
    --c-ctrl-bg: rgba(255,255,255,.92);
    --c-ctrl-line: #dde1e8;

    /* Fonts —— system sans-serif first (native feel + high readability) · CJK uses clean sans · Noto supplements from the same source when online */
    --font-cjk: "PingFang SC", "Noto Sans SC", "Microsoft YaHei";
    --font-sans: -apple-system, "SF Pro Text", BlinkMacSystemFont, "Segoe UI", var(--font-cjk), "Noto Sans", "Noto Sans SC", sans-serif;
    --font-mono: "SF Mono", "SFMono-Regular", ui-monospace, "Cascadia Code", Consolas, monospace;

    --radius: 10px;
    --gap: 12px;
    --t-fast: 180ms;
    --t-mid: 340ms;
    --ease: cubic-bezier(.22,.61,.36,1);
  }

  /* CJK font switches with language (Hans→SC · Hant→TC · ja→JP · all clean sans-serif) */
  html[lang="zh-Hant"] { --font-cjk: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei"; }
  html[lang="ja"]      { --font-cjk: "Hiragino Sans", "Noto Sans JP", "Yu Gothic", "Meiryo"; }

  /* CJK languages: lead the body font with the CJK face so full-width punctuation like "：" gets its correct full-width em advance and isn't squashed by a Latin font */
  html[lang="zh-Hans"] body, html[lang="zh-Hant"] body, html[lang="ja"] body {
    font-family: var(--font-cjk), -apple-system, "Segoe UI", sans-serif;
  }

  /* Font switched to "system default" (pure system sans-serif · no Noto) */
  html[data-font="system"] {
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", var(--font-cjk), sans-serif;
  }

  /* —— Dark theme (clean neutral near-black · the calm of iOS dark) —— */
  html[data-theme="dark"] {
    --c-accent: #6a8fd6;            /* same-family lapis, brightened for dark backgrounds */
    --c-bg: #1c1c1e;                /* near-black page ground */
    --c-card: #2c2c2e;             /* cards lifted one step */
    --c-panel: #2c2c2e;
    --c-ink: #f5f5f7;
    --c-ink-soft: #98989d;
    --c-line: #38383a;             /* dark hairline */
    --c-accent-soft: color-mix(in srgb, var(--c-accent) 18%, #1c1c1e);
    --c-on-accent: #ffffff;
    --c-skip-bg: #38383a;
    --c-skip-ink: #98989d;
    --c-done: #636366;
    --c-focus: var(--c-accent);
    --c-ctrl-bg: rgba(44,44,46,.86);
    --c-ctrl-line: #38383a;
  }

  html { -webkit-text-size-adjust: 100%; }

  body {
    margin: 0;
    background: var(--c-bg);
    color: var(--c-ink);
    font-family: var(--font-sans);
    font-size: var(--fs-body);
    line-height: 1.6;
    text-wrap: pretty;
    orphans: 3;
    widows: 3;
    transition: background var(--t-mid) var(--ease), color var(--t-mid) var(--ease);
  }

  h1, h2, h3 { text-wrap: balance; line-height: 1.3; }

  .wrap { max-width: 760px; margin: 0 auto; padding: 24px 18px 96px; }

  /* ---- Header + progress ---- */
  header.app-head { margin-bottom: 8px; }
  .app-head h1 { font-size: 1.55rem; margin: 0 0 4px; }
  .app-sub { font-size: var(--fs-caption); color: var(--c-ink-soft); margin: 0 0 12px; }
  .app-aka { font-size: var(--fs-caption); color: var(--c-ink-soft); margin: -4px 0 12px; opacity: .78; }
  .app-bar { position: sticky; top: 0; z-index: 30; background: var(--c-bg); margin: 0 -18px 18px; padding: 10px 18px; border-bottom: 1px solid var(--c-line); }
  .app-bar .progress-row { margin-bottom: 10px; }
  .app-bar .toolbar { margin-bottom: 0; }

  .progress-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
  .progress-track { flex: 1 1 200px; height: 8px; background: var(--c-panel); border-radius: 99px; overflow: hidden; min-width: 140px; }
  .progress-fill { height: 100%; width: 0; background: var(--c-accent); border-radius: 99px; transition: width var(--t-mid) var(--ease); }
  .progress-label { font-variant-numeric: tabular-nums; font-weight: 700; white-space: nowrap; color: var(--c-accent); }

  /* ---- Generic button ---- */
  .btn {
    font: inherit; font-size: var(--fs-caption); cursor: pointer;
    border: 1px solid var(--c-line); background: var(--c-card); color: var(--c-ink);
    padding: 8px 14px; border-radius: 99px; line-height: 1.2;
    transition: border-color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
  }
  .btn:hover { border-color: var(--c-accent); }
  .btn:active { transform: translateY(1px); }
  .toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .toolbar[hidden] { display: none; }
  .btn-toggle[aria-pressed="true"] { border-color: var(--c-accent); color: var(--c-accent); background: var(--c-accent-soft); }
  /* Top-bar tools collapse toggle (once collapsed, only the progress bar remains) */
  .bar-toggle { margin-left: auto; font: inherit; cursor: pointer; border: 1px solid var(--c-line); background: var(--c-card); color: var(--c-ink-soft); border-radius: 99px; padding: 4px 12px; line-height: 1.2; }
  .bar-toggle:hover { border-color: var(--c-accent); color: var(--c-accent); }
  .bar-toggle .chevron { font-size: .85em; }

  /* ---- Collapse header ---- */
  .collapse-head { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: none; border: none; font: inherit; cursor: pointer; padding: 0; color: inherit; }
  .chevron { flex: 0 0 auto; width: 1em; transition: transform var(--t-mid) var(--ease); font-size: .9em; color: var(--c-ink-soft); }
  [aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .collapse-sleeve { overflow: hidden; transition: max-height var(--t-mid) var(--ease), opacity var(--t-mid) var(--ease); }

  /* ---- Top CTA (optional · prompts going to GitHub / having an AI install it · real users set cta:null to hide) ---- */
  .cta-bar { display: block; font-size: var(--fs-caption); line-height: 1.6; text-wrap: balance; line-break: strict; overflow-wrap: break-word; color: var(--c-ink-soft); background: color-mix(in srgb, var(--c-accent) 15%, #ffffff); border: 1px solid color-mix(in srgb, var(--c-accent) 22%, #ffffff); border-radius: var(--radius); padding: 12px 16px; margin-bottom: 16px; }
  .cta-bar a { color: var(--c-accent); font-weight: 600; text-decoration: none; }
  .cta-bar a:hover { text-decoration: underline; }
  .cta-copy { font: inherit; font-size: var(--fs-caption); font-weight: 600; color: var(--c-accent); background: none; border: none; padding: 0; cursor: pointer; text-decoration: none; white-space: nowrap; }
  .cta-copy:hover { text-decoration: underline; }
  .cta-line { margin-top: 5px; }
  .cta-sep { color: var(--c-line); }

  /* ---- Status block ---- */
  .summary { background: var(--c-panel); border: 1px solid var(--c-line); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 18px; }
  .summary h2 { font-size: var(--fs-summary-title); margin: 0; }
  .summary .body { margin-top: 12px; }
  .summary .body > :first-child { margin-top: 0; }
  .summary .body > :last-child { margin-bottom: 0; }

  /* ---- Tag legend ---- */
  .legend { font-size: var(--fs-caption); color: var(--c-ink-soft); margin: 0 0 18px; line-height: 1.9; }
  .legend b { color: var(--c-ink); }

  /* ---- Module card ---- */
  .module { background: var(--c-card); border: 1px solid var(--c-line); border-radius: var(--radius); padding: 14px 16px; margin-bottom: var(--gap); transition: border-color var(--t-mid) var(--ease), opacity var(--t-mid) var(--ease), background var(--t-mid) var(--ease); }
  .module-head h2 { font-size: var(--fs-title); margin: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .module-count { font-size: var(--fs-caption); color: var(--c-ink-soft); font-weight: 400; font-variant-numeric: tabular-nums; }
  .module-body { margin-top: 12px; }
  .module-done-badge { display: none; font-size: var(--fs-caption); font-weight: 700; color: var(--c-accent); background: var(--c-accent-soft); border-radius: 99px; padding: 1px 10px; margin-left: 6px; vertical-align: middle; }
  .module.done .module-done-badge { display: inline-block; }
  .module.done .module-count { display: none; }
  .module.done { opacity: .9; background: var(--c-panel); }

  /* Module-header rich info */
  .module-step {
    display: inline-block; font-size: var(--fs-caption); font-weight: 700;
    color: var(--c-on-accent); background: var(--c-accent);
    border-radius: 99px; padding: 1px 11px; vertical-align: middle;
    font-variant-numeric: tabular-nums;
  }
  .module.done .module-step { background: var(--c-done); }
  .tag { display: inline-block; font-size: var(--fs-caption); font-weight: 600; line-height: 1.3; padding: 1px 10px; border-radius: 99px; vertical-align: middle; margin-left: 4px; }
  .tag-key  { color: var(--c-accent); background: var(--c-accent-soft); }   /* soft: light ground + accent text */
  .tag-skip { color: var(--c-skip-ink); background: var(--c-skip-bg); }     /* soft: gray ground + gray text */
  .module-meta { font-size: var(--fs-caption); color: var(--c-ink-soft); margin: 6px 0 0 calc(1em + 10px); }
  .module-links { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: var(--fs-caption); }
  .module-links a { color: var(--c-accent); text-underline-offset: 3px; }
  .module-icon, .summary-icon { display: inline-flex; vertical-align: -0.12em; margin-right: 3px; }
  .module-icon svg, .summary-icon svg { width: 1.05em; height: 1.05em; fill: var(--c-accent); }

  /* ---- item (each one = main body on the left + always-on note · on wide screens the note sits in a right column, on narrow screens it stacks below) ---- */
  ul.items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  li.item { display: grid; grid-template-columns: minmax(0,1fr); gap: 8px 14px; padding: 8px; border-radius: 8px; transition: background var(--t-fast) var(--ease); }
  li.item:hover, li.item:focus-within { background: var(--c-accent-soft); box-shadow: inset 3px 0 0 var(--c-accent); }
  .item-main { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
  .item-main input[type="checkbox"] { flex: 0 0 auto; width: 22px; height: 22px; margin-top: 4px; accent-color: var(--c-accent); cursor: pointer; }
  .item-main label { cursor: text; flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; user-select: text; }
  .item-main label code { font-size: var(--fs-mono); background: var(--c-accent-soft); padding: 1px 5px; border-radius: 5px; font-family: var(--font-mono); overflow-wrap: anywhere; word-break: break-word; }
  .item-main label a { color: var(--c-accent); text-underline-offset: 3px; }
  /* When the body text mentions "a button / control elsewhere", wrap it in a little pill that looks like the real button (so it's recognized at a glance) */
  .ui-ref { display: inline-block; font-size: .92em; font-weight: 600; line-height: 1.45; padding: 1px 9px; border-radius: 99px; border: 1px solid var(--c-line); background: var(--c-card); color: var(--c-ink); white-space: nowrap; vertical-align: baseline; }
  li.item.checked .item-main label { color: var(--c-done); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--c-done) 60%, transparent); }
  /* Wide screens: the note moves to an always-on right column, and sub-lists span the full row */
  @media (min-width: 820px) {
    li.item { grid-template-columns: minmax(0,1fr) var(--note-col, 240px); align-items: start; }
    li.item > .item-main { grid-column: 1; grid-row: 1; }
    li.item > .item-note { grid-column: 2; grid-row: 1; }
    li.item > .subbranch { grid-column: 1 / -1; grid-row: 2; }
  }
  /* "Dare to click" nudge: pulse the first unchecked item's box + a one-line hint (gone for good after one check) */
  @keyframes lc-nudge-ring { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--c-accent) 55%, transparent); } 70% { box-shadow: 0 0 0 9px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
  li.item.nudge .item-main input[type="checkbox"] { border-radius: 5px; animation: lc-nudge-ring 1.5s var(--ease) infinite; }
  .nudge-hint { flex: 0 0 100%; font-size: var(--fs-caption); color: var(--c-accent); font-weight: 600; margin: 4px 0 0 34px; }
  .item-note.note-nudge textarea { animation: lc-nudge-ring 1.5s var(--ease) infinite; border-color: var(--c-accent); }
  .item-note.note-nudge .nudge-hint { margin: 4px 0 0 0; }
  a.link-nudge { border-radius: 4px; animation: lc-nudge-ring 1.5s var(--ease) infinite; }
  @media (prefers-reduced-motion: reduce) { li.item.nudge .item-main input[type="checkbox"], .item-note.note-nudge textarea, a.link-nudge { animation: none; } }
  /* Second-level sub-list (nested · collapsible · sub-items checked independently) */
  .subbranch { flex: 0 0 100%; box-sizing: border-box; padding-left: 34px; margin-top: 4px; }
  .sub-toggle { font-size: .92em; color: var(--c-ink-soft); padding: 4px 0; gap: 8px; }
  .sub-toggle .chevron { font-size: .8em; }
  ul.subitems { list-style: none; margin: 6px 0 2px; padding: 0 0 0 12px; display: flex; flex-direction: column; gap: 3px; border-left: 2px solid var(--c-line); }
  li.subitem { display: flex; gap: 10px; align-items: flex-start; padding: 5px 6px; border-radius: 6px; font-size: .95em; transition: background var(--t-fast) var(--ease); }
  li.subitem:hover, li.subitem:focus-within { background: var(--c-accent-soft); }
  li.subitem input[type="checkbox"] { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 3px; accent-color: var(--c-accent); cursor: pointer; }
  li.subitem label { cursor: text; flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; user-select: text; }
  li.subitem.checked label { color: var(--c-done); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--c-done) 60%, transparent); }

  /* ---- Per-item always-on note (prominent, never folded · obviously writable at a glance) ---- */
  .item-note { display: block; min-width: 0; }
  .item-note textarea { width: 100%; box-sizing: border-box; font: inherit; font-size: var(--fs-caption); padding: 6px 10px; border: 1px solid var(--c-line); border-radius: 8px; resize: vertical; min-height: 32px; background: transparent; color: var(--c-ink); transition: min-height var(--t-fast) var(--ease), background var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease); }
  .item-note textarea::placeholder { color: var(--c-ink-soft); opacity: .75; }
  /* Empty = subtle; focused or filled = becomes prominent (accent ground + grows taller) */
  .item-note textarea:focus, .item-note textarea:not(:placeholder-shown) { min-height: 64px; background: var(--c-accent-soft); border-color: var(--c-ink-soft); }

  /* ---- fillData: pre-filled for you + one-click copy ---- */
  .fill-wrap { margin-top: 12px; border: 1px solid var(--c-line); border-radius: 8px; overflow: hidden; }
  .fill-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 10px; background: var(--c-accent-soft); font-size: var(--fs-caption); color: var(--c-ink-soft); }
  .fill-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-top: 1px solid var(--c-line); font-size: var(--fs-caption); }
  .fill-label { flex: 0 0 auto; min-width: 88px; color: var(--c-ink-soft); }
  .fill-value { flex: 1 1 auto; font-family: var(--font-mono); color: var(--c-ink); word-break: break-all; }
  .fill-copy, .fill-copyall { flex: 0 0 auto; font: inherit; font-size: 13px; cursor: pointer; border: 1px solid var(--c-line); background: var(--c-card); color: var(--c-ink); padding: 3px 11px; border-radius: 99px; }
  .fill-copy:hover, .fill-copyall:hover { border-color: var(--c-accent); color: var(--c-accent); }

  /* ---- Done divider line ---- */
  .done-divider { display: flex; align-items: center; gap: 12px; margin: 28px 0 14px; color: var(--c-done); font-size: var(--fs-caption); font-weight: 600; letter-spacing: .03em; }
  .done-divider::before, .done-divider::after { content: ""; flex: 1; height: 1px; background: var(--c-line); }
  .done-divider.hidden { display: none; }

  /* ---- Per-step top "✓ Done N" collapse group (checked items tuck in here · collapsed by default · one click to expand and find them) ---- */
  .done-group { margin: 0 0 10px; }
  .done-group[hidden] { display: none; }
  .done-group-head { width: 100%; padding: 7px 10px; border-radius: 8px; background: var(--c-panel); color: var(--c-ink-soft); font-size: var(--fs-caption); font-weight: 600; gap: 8px; }
  .done-group-head:hover { background: var(--c-accent-soft); color: var(--c-accent); }
  .done-group-head .chevron { color: inherit; }
  .done-group-head.bump { animation: dg-bump .42s var(--ease); transform-origin: left center; }
  @keyframes dg-bump { 0% { transform: none; } 30% { transform: scale(1.07); } 100% { transform: none; } }
  .items-done { margin-top: 6px; }
  .items-done li.item:hover, .items-done li.item:focus-within { box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { .done-group-head.bump { animation: none; } }

  /* ---- Floating control cluster (bottom-right · fixed) ---- */
  .float-controls {
    position: fixed; right: 16px; bottom: 16px; z-index: 50;
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end;
    max-width: calc(100vw - 32px);
    background: var(--c-card); border: 1px solid var(--c-ctrl-line);
    border-radius: 99px; padding: 6px 8px;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
  }
  .fc-langs { display: flex; gap: 2px; flex-wrap: wrap; }
  /* The four control types (handle · language · theme · font) share one height + are vertically centered, so they're no longer uneven */
  .fc-handle, .fc-lang, .fc-icon, .fc-font {
    height: 30px; display: inline-flex; align-items: center; justify-content: center;
    line-height: 1; box-sizing: border-box; padding-top: 0; padding-bottom: 0;
  }
  .fc-lang, .fc-icon {
    font: inherit; font-size: 13px; cursor: pointer;
    border: 1px solid transparent; background: transparent; color: var(--c-ink-soft);
    padding-left: 9px; padding-right: 9px; border-radius: 99px;
    transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease);
  }
  .fc-lang:hover, .fc-icon:hover { background: var(--c-accent-soft); color: var(--c-accent); }
  .fc-lang[aria-pressed="true"] { background: var(--c-accent); color: #fff; font-weight: 600; }
  .fc-sep { width: 1px; align-self: stretch; background: var(--c-ctrl-line); margin: 2px 2px; }
  .fc-icon { width: 32px; padding-left: 0; padding-right: 0; }
  .fc-icon svg { width: 18px; height: 18px; fill: currentColor; stroke: none; }
  .fc-icon .ic-moon { display: none; }
  html[data-theme="dark"] .fc-icon .ic-sun { display: none; }
  html[data-theme="dark"] .fc-icon .ic-moon { display: inline; }
  #fcTheme { position: relative; }
  html[data-theme-mode="auto"] #fcTheme::after { content: "A"; position: absolute; right: 1px; bottom: 0; font-size: 9px; line-height: 1; font-weight: 700; pointer-events: none; }
  .fc-font { width: auto; padding-left: 10px; padding-right: 10px; }
  .fc-font[aria-pressed="true"] { background: var(--c-accent); color: #fff; }
  /* Control cluster collapsed: once collapsed only a small knob remains (avoids blocking content) */
  .fc-body { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .float-controls[data-open="false"] .fc-body { display: none; }
  .fc-handle { font: inherit; font-size: 15px; cursor: pointer; border: 1px solid transparent; background: transparent; color: var(--c-ink-soft); padding-left: 9px; padding-right: 9px; border-radius: 99px; }
  .fc-handle:hover { background: var(--c-accent-soft); color: var(--c-accent); }

  /* ---- Focus ring ---- */
  a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, .collapse-head:focus-visible {
    outline: 3px solid var(--c-focus); outline-offset: 2px; border-radius: 6px;
  }

  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  [hidden] { display: none !important; }

  @media (prefers-reduced-motion: reduce) { * { transition-duration: 1ms !important; } }

  @media (max-width: 480px) {
    :root { --fs-body: 19px; }
    .wrap { padding: 18px 12px 96px; }
    .float-controls { left: 12px; right: 12px; bottom: 12px; justify-content: center; }
    .app-bar { margin: 0 -12px 14px; padding: 8px 12px; }
  }
</style>
</head>
<body>
<!-- Floating control cluster (injected by the engine) -->
<div class="float-controls" id="floatControls" aria-label="界面控制"></div>

<div class="wrap">
  <header class="app-head">
    <h1 id="app-title">活页清单 · 基础模板</h1>
    <p class="app-sub" id="app-subtitle"></p>
    <p class="app-aka" id="app-aka"></p>
  </header>

  <div class="app-bar" id="appBar">
    <div class="progress-row" role="group" aria-labelledby="progress-caption">
      <span id="progress-caption" class="sr-only"></span>
      <div class="progress-track" role="progressbar" aria-labelledby="progress-caption"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progressBar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <span class="progress-label" id="progressLabel" aria-live="polite">0 / 0</span>
      <button type="button" class="bar-toggle" id="btnBarToggle" aria-expanded="true" aria-controls="barTools"><span class="chevron" aria-hidden="true">▾</span></button>
    </div>

    <div class="toolbar" id="barTools">
      <button type="button" class="btn" id="btnExpandAll"></button>
      <button type="button" class="btn" id="btnCollapseAll"></button>
      <button type="button" class="btn" id="btnReset"></button>
      <button type="button" class="btn" id="btnCopyFeedback"></button>
      <button type="button" class="btn btn-toggle" id="btnSink" aria-pressed="true"></button>
      <button type="button" class="btn btn-toggle" id="btnSinkBottom" aria-pressed="false"></button>
    </div>
  </div>

  <div id="ctaHost"></div>
  <section id="summaryHost" aria-label="summary"></section>
  <p class="legend" id="legendHost" hidden></p>
  <main id="activeHost" aria-label="active"></main>
  <div class="done-divider hidden" id="doneDivider" aria-hidden="true"></div>
  <div id="doneHost" aria-label="done"></div>

  <div class="sr-only" id="liveRegion" role="status" aria-live="polite" aria-atomic="true"></div>
</div>

<script>
"use strict";

/* ===========================================================================
   [1] DATA —— content (single-language array, or multi-language keyed by locale)
   This demo is a "self-documenting" checklist: it demonstrates the features while
   explaining how to use itself.
   Multi-language form: SUMMARY / MODULES = { 'zh-Hans': …, 'en': … }.
   Single-language form: just give an array / string (backward compatible).
   item.id / module.id stay consistent across languages → switching language keeps your checks.
   =========================================================================== */

const SUMMARY = {
  "zh-Hans": \`
    <p><strong>现状：</strong>这是「活页清单」:一个把<strong>多步骤、需要长期追踪</strong>的流程，做成可勾选清单的单文件工具。勾选后的条目会自动沉到底部，整步完成后自动折叠归档。</p>
    <p><strong>必做：</strong>从上往下逐项勾选。所有进度都保存在本机浏览器，关闭后重新打开仍然保留。右下角可以切换语言、深浅色和字体。把这份内容换成你自己的即可。</p>\`,
  "zh-Hant": \`
    <p><strong>現狀：</strong>這是「活頁清單」:一個把<strong>多步驟、需要長期追蹤</strong>的流程，做成可勾選清單的單檔工具。勾選後的條目會自動沉到底部，整步完成後自動摺疊歸檔。</p>
    <p><strong>必做：</strong>從上往下逐項勾選。所有進度都保存在本機瀏覽器，關閉後重新開啟仍然保留。右下角可以切換語言、深淺色和字型。把這份內容換成你自己的即可。</p>\`,
  "en": \`
    <p><strong>Now:</strong> This is <strong>Living Checklist</strong>: a single-file tool that turns any <strong>multi-step process you need to track over time</strong> into a checkable list. Checked items move to the bottom automatically, and once a whole step is done it folds and files itself away.</p>
    <p><strong>To do:</strong> Work down the list, one item at a time. All your progress is saved in this browser, so it stays after you close and reopen the page. The bottom-right corner lets you switch the language, light or dark mode, and the font. Just replace this content with your own.</p>\`,
  "fr": \`
    <p><strong>Situation:</strong> Voici <strong>Living Checklist</strong> : un outil en un seul fichier qui transforme tout processus <strong>en plusieurs étapes, à suivre dans la durée</strong>, en une liste cochable. Les éléments cochés descendent automatiquement au bas, et lorsqu'une étape est terminée, elle se replie et s'archive d'elle-même.</p>
    <p><strong>À faire:</strong> Avancez dans la liste, élément par élément. Toute votre progression est enregistrée dans ce navigateur, elle reste donc après la fermeture et la réouverture de la page. Le coin inférieur droit permet de changer la langue, le mode clair ou sombre et la police. Il vous suffit de remplacer ce contenu par le vôtre.</p>\`,
  "ja": \`
    <p><strong>現状：</strong>これは「活页清单 / Living Checklist」:<strong>複数の手順があり、長く追いかけたい</strong>流れを、チェックできるリストにする単一ファイルのツールです。チェックした項目は自動的に下へ移り、ステップ全体が終わると自動的に折りたたまれて保管されます。</p>
    <p><strong>やること:</strong>上から順に、一つずつチェックしていきます。進捗はこのブラウザに保存されるので、閉じて開き直しても残ります。右下のボタンで、言語・ライト / ダーク・フォントを切り替えられます。この内容をご自身のものに差し替えてください。</p>\`,
};

/* Self-documenting: the modules explain "the UI buttons" and "how to fill in your own data".
   item.id / module.id are consistent across languages. */
const MODULES = {
  "zh-Hans": [
    {
      id: "basics", stepNum: "1", title: "怎么用这份清单", tag: "key",
      meta: "先了解基本操作，再开始往下做。",
      notePlaceholder: "这里哪些地方不顺手、或前后不一致？写下来，再点顶部的「复制进度 + 反馈」发给我。",
      items: [
        { id: "check", html: "<strong>现在就点左边的方框，把这一条勾上试试</strong>。勾完它会划掉、收走。" },
        { id: "tuck", html: "勾完的条目会收进这一步顶部的 <span class='ui-ref'>✓ 已完成</span>，下一条自动顶上来，不用往下滚去找。不想它动？顶部工具栏点 <span class='ui-ref'>勾完自动收起</span> 关掉就行。想反过来,让完成项沉到模块末、整步完成后沉到页面底部?点 <span class='ui-ref'>完成项沉底</span> 打开。" },
        { id: "note", html: "<strong>这一条右边（手机上在下面）就是备注框</strong> —— 备注、想法、疑问都能写在这,会自动保存;复制进度时一起带走,方便回头问 AI。现在写一句试试。" },
        { id: "fold", html: "<strong>点这一步的标题</strong>，能把整步展开或折叠；上方「现状」块也一样。" },
        { id: "link", html: "<strong>带下划线的是链接</strong>，比如<a href=\\"https://github.com/MtsYama/living-checklist\\">这一个</a>，点它就能打开。" },
        { id: "copy", html: "都试一遍后，点顶部 <span class='ui-ref'>复制进度 + 反馈</span>：进度和备注会整理成文字复制走，粘回 AI 对话就能接着改。" },
        { id: "nest", html: "需要更细的步骤？<strong>点下面这条的小箭头</strong>，能再展开一层子清单。", children: [
          { id: "n1", html: "子项可以单独勾选，和主条目互不影响。" },
          { id: "n2", html: "这一层可以随时<strong>折叠收起</strong>，不挤占主清单。" },
          { id: "n3", html: "以后需求细化、或讨论出新规则，就在这一层继续补细则和对应清单。" },
        ] },
      ],
    },
    {
      id: "buttons", stepNum: "2", title: "界面上这些按钮都干嘛",
      meta: "一共两处：顶部一排（随页面吸顶）和右下角一组（悬浮）。",
      notePlaceholder: "哪一条按钮的说明没看懂、或和实际对不上？写在这里告诉我。",
      items: [
        { id: "top", html: "<strong>顶部一排</strong>:<span class='ui-ref'>全部展开</span>、<span class='ui-ref'>全部折叠</span>、<span class='ui-ref'>清空打勾</span>、<span class='ui-ref'>复制进度 + 反馈</span>。" },
        { id: "lang", html: "<strong>右下角 · 语言</strong>:EN / FR / 简 / 繁 / 日；<strong>只显示这份清单提供的语言</strong>,单一语言的清单不会显示这个按钮。" },
        { id: "theme", html: "<strong>右下角 · 日 / 月</strong>:浅色与深色切换，默认跟随系统，选择后会记住。" },
        { id: "font", html: "<strong>右下角 · 字体</strong>:默认（本套用 <strong>Noto</strong>）或系统字体（离线时用）;做自己的模板时，可以在这里换成你选的字体。" },
      ],
    },
    {
      id: "fill", stepNum: "3", title: "示例：预先填好的字段", tag: "key",
      meta: "AI 先把要填的内容准备好，你点「复制」直接粘贴到表单 —— 这就是 fillData。",
      notePlaceholder: "复制后还有问题？或者已经复制、但不想手动勾选？又或者预填的内容不对？写在这里告诉我。",
      items: [
        { id: "demo", html: "实际使用时，把下面这组 <code>fillData</code> 换成你自己的字段（下面是占位示例）。" },
      ],
      fillData: [
        { label: "申请人", value: "山山山" },
        { label: "出生日期", value: "盘古元年" },
        { label: "编号", value: "test333" },
      ],
    },
    {
      id: "customize", stepNum: "4", title: "自定义 · 个性化", tag: "skip",
      meta: "只是自己用、单一语言？这一步可以跳过。",
      notePlaceholder: "想要别的配色、字体或模板，或者想加点什么？写在这里。",
      items: [
        { id: "skin", html: "想换<strong>配色和字体</strong>:本 skill 还带了一套别的风格的模板，你也可以复制一套，改成你自己的配色和字体，做成自己的模板。" },
        { id: "content", html: "想改<strong>内容</strong>:编辑文件里 <code>[1] DATA</code> 的 <code>MODULES</code>（怎么填见文件顶部的注释）,或者直接让 AI 读这个 skill 帮你生成。" },
      ],
      links: [ { text: "→ 看另一套风格：MX Studio", href: "mx-studio.html" } ],
    },
  ],
};
MODULES["zh-Hant"] = [
  {
    id: "basics", stepNum: "1", title: "怎麼用這份清單", tag: "key",
    meta: "先了解基本操作，再開始往下做。",
    notePlaceholder: "這裡哪些地方不順手、或前後不一致？寫下來，再點頂部的「複製進度 + 回饋」發給我。",
    items: [
      { id: "check", html: "<strong>現在就點左邊的方框，把這一條勾上試試</strong>。勾完它會劃掉、收走。" },
      { id: "tuck", html: "勾完的條目會收進這一步頂部的 <span class='ui-ref'>✓ 已完成</span>，下一條自動頂上來，不用往下捲去找。不想它動？頂部工具列點 <span class='ui-ref'>勾完自動收起</span> 關掉就行。想反過來,讓完成項沉到模組末、整步完成後沉到頁面底部?點 <span class='ui-ref'>完成項沉底</span> 打開。" },
      { id: "note", html: "<strong>這一條右邊（手機上在下面）就是備註框</strong> —— 備註、想法、疑問都能寫在這,會自動儲存;複製進度時一起帶走,方便回頭問 AI。現在寫一句試試。" },
      { id: "fold", html: "<strong>點這一步的標題</strong>，能把整步展開或摺疊；上方「現狀」區塊也一樣。" },
      { id: "link", html: "<strong>帶底線的是連結</strong>，比如<a href=\\"https://github.com/MtsYama/living-checklist\\">這一個</a>，點它就能開啟。" },
      { id: "copy", html: "都試一遍後，點頂部 <span class='ui-ref'>複製進度 + 回饋</span>：進度和備註會整理成文字複製走，貼回 AI 對話就能接著改。" },
      { id: "nest", html: "需要更細的步驟？<strong>點下面這條的小箭頭</strong>，能再展開一層子清單。", children: [
        { id: "n1", html: "子項可以單獨勾選，和主條目互不影響。" },
        { id: "n2", html: "這一層可以隨時<strong>摺疊收起</strong>，不擠佔主清單。" },
        { id: "n3", html: "以後需求細化、或討論出新規則，就在這一層繼續補細則和對應清單。" },
      ] },
    ],
  },
  {
    id: "buttons", stepNum: "2", title: "介面上這些按鈕都做什麼",
    meta: "一共兩處：頂部一排（隨頁面吸頂）和右下角一組（懸浮）。",
    notePlaceholder: "哪一條按鈕的說明沒看懂、或和實際對不上？寫在這裡告訴我。",
    items: [
      { id: "top", html: "<strong>頂部一排</strong>:<span class='ui-ref'>全部展開</span>、<span class='ui-ref'>全部摺疊</span>、<span class='ui-ref'>清空打勾</span>、<span class='ui-ref'>複製進度 + 回饋</span>。" },
      { id: "lang", html: "<strong>右下角 · 語言</strong>:EN / FR / 簡 / 繁 / 日；<strong>只顯示這份清單提供的語言</strong>,單一語言的清單不會顯示這個按鈕。" },
      { id: "theme", html: "<strong>右下角 · 日 / 月</strong>:淺色與深色切換，預設跟隨系統，選擇後會記住。" },
      { id: "font", html: "<strong>右下角 · 字型</strong>:預設（本套用 <strong>Noto</strong>）或系統字型（離線時使用）;做自己的模板時，可以在這裡換成你選的字型。" },
    ],
  },
  {
    id: "fill", stepNum: "3", title: "範例：預先填好的欄位", tag: "key",
    meta: "AI 先把要填的內容準備好，你點「複製」直接貼到表單 —— 這就是 fillData。",
    notePlaceholder: "複製後還有問題？或者已經複製、但不想手動勾選？又或者預填的內容不對？寫在這裡告訴我。",
    items: [
      { id: "demo", html: "實際使用時，把下面這組 <code>fillData</code> 換成你自己的欄位（下面是佔位範例）。" },
    ],
    fillData: [
      { label: "申請人", value: "巍巍" },
      { label: "出生日期", value: "女媧補天前" },
      { label: "編號", value: "test333" },
    ],
  },
  {
    id: "customize", stepNum: "4", title: "自訂 · 個人化", tag: "skip",
    meta: "只是自己用、單一語言？這一步可以跳過。",
    notePlaceholder: "想要別的配色、字型或模板，或者想加點什麼？寫在這裡。",
    items: [
      { id: "skin", html: "想換<strong>配色和字型</strong>:本 skill 還帶了一套別的風格的模板，你也可以複製一套，改成你自己的配色和字型，做成自己的模板。" },
      { id: "content", html: "想改<strong>內容</strong>:編輯檔案裡 <code>[1] DATA</code> 的 <code>MODULES</code>（怎麼填見檔案頂部的註解）,或者直接讓 AI 讀這個 skill 幫你產生。" },
    ],
    links: [ { text: "→ 看另一套風格：MX Studio", href: "mx-studio.html" } ],
  },
];

MODULES["en"] = [
  {
    id: "basics", stepNum: "1", title: "How to use this checklist", tag: "key",
    meta: "Get familiar with the basics first, then start working down the list.",
    notePlaceholder: "Anything here awkward or inconsistent? Write it down, then click “Copy progress + feedback” at the top and send it to me.",
    items: [
      { id: "check", html: "<strong>Go ahead — click the box on the left to check this item.</strong> It greys out and gets tucked away." },
      { id: "tuck", html: "Checked items tuck into the <span class='ui-ref'>✓ Done</span> strip at the top of the step, and the next one moves up — no scrolling to find it. Don’t want that? Turn off <span class='ui-ref'>Tuck away when done</span> in the toolbar. Prefer the other way? Turn on <span class='ui-ref'>Sink done to bottom</span> to sink checked items to the module’s end and drop finished steps to the bottom of the page." },
      { id: "note", html: "<strong>See the box to the right of this item (below it on mobile)? That’s its note field</strong> — notes, ideas, questions all go here; it saves automatically and rides along when you copy your progress, so you can ask an AI later. Try a line now." },
      { id: "fold", html: "<strong>Click this step’s title</strong> to fold or unfold the whole step; the “Status” block at the top works the same way." },
      { id: "link", html: "<strong>Underlined text is a link</strong> — like <a href=\\"https://github.com/MtsYama/living-checklist\\">this one</a>; click it to open." },
      { id: "copy", html: "Once you’ve tried it all, hit <span class='ui-ref'>Copy progress + feedback</span> up top: it bundles your progress and notes into text so you can paste it back into an AI chat and keep going." },
      { id: "nest", html: "Need finer steps? <strong>Click the little arrow on the item below</strong> to open a sub-list one level down.", children: [
        { id: "n1", html: "Sub-items are checked on their own and don’t affect the main item." },
        { id: "n2", html: "This layer <strong>folds away</strong> any time, so it never crowds the main list." },
        { id: "n3", html: "As needs get more specific, or a new rule comes up, keep adding finer items and checklists right here." },
      ] },
    ],
  },
  {
    id: "buttons", stepNum: "2", title: "What each button does",
    meta: "There are two places: the row at the top (it sticks to the page) and the cluster at the bottom-right (it floats).",
    notePlaceholder: "Any button explanation you didn’t follow, or that doesn’t match what you see? Tell me here.",
    items: [
      { id: "top", html: "<strong>The top row</strong>: <span class='ui-ref'>expand all</span>, <span class='ui-ref'>collapse all</span>, <span class='ui-ref'>reset checks</span>, <span class='ui-ref'>copy progress + feedback</span>." },
      { id: "lang", html: "<strong>Bottom-right · language</strong>: EN / FR / 简 / 繁 / 日； <strong>only the languages this checklist provides</strong> are shown, and a single-language checklist won’t show this button." },
      { id: "theme", html: "<strong>Bottom-right · sun / moon</strong>: switches between light and dark. It follows your system by default and remembers your choice." },
      { id: "font", html: "<strong>Bottom-right · font</strong>: Default (this template uses <strong>Noto</strong>) or your system font (used when offline); when you make your own template, you can switch in the font you prefer here." },
    ],
  },
  {
    id: "fill", stepNum: "3", title: "Example: fields filled in for you", tag: "key",
    meta: "The AI prepares the values in advance, and you click “Copy” to paste them straight into a form — that’s fillData.",
    notePlaceholder: "Still stuck after copying? Or copied but would rather not check items by hand? Or a pre-filled value is wrong? Tell me here.",
    items: [
      { id: "demo", html: "In real use, replace the <code>fillData</code> below with your own fields (the ones below are placeholders)." },
    ],
    fillData: [
      { label: "Name", value: "Mts Shu" },
      { label: "Date of birth", value: "circa Big Bang" },
      { label: "Pass No.", value: "test333" },
    ],
  },
  {
    id: "customize", stepNum: "4", title: "Customize · make it your own", tag: "skip",
    meta: "Just for yourself, in a single language? You can skip this step.",
    notePlaceholder: "Want different colours, fonts or templates, or something added? Write it here.",
    items: [
      { id: "skin", html: "To change the <strong>colours and fonts</strong>: this skill also comes with a template in a different style, and you can copy one and change it into your own colours and fonts to make your own template." },
      { id: "content", html: "To change the <strong>content</strong>: edit <code>MODULES</code> under <code>[1] DATA</code> in the file (see the comments at the top of the file for how to fill it in), or just let an AI read this skill and generate it for you." },
    ],
    links: [ { text: "→ See the other style: MX Studio", href: "mx-studio.html" } ],
  },
];

MODULES["fr"] = [
  {
    id: "basics", stepNum: "1", title: "Comment utiliser cette liste", tag: "key",
    meta: "Familiarisez-vous d'abord avec les bases, puis commencez à descendre la liste.",
    notePlaceholder: "Quelque chose ici vous gêne ou n'est pas cohérent ? Notez-le, puis cliquez sur « Copier progression + retour » en haut et envoyez-le-moi.",
    items: [
      { id: "check", html: "<strong>Allez-y — cliquez sur la case à gauche pour cocher cet élément.</strong> Il se grise et se range." },
      { id: "tuck", html: "Les éléments cochés se rangent dans <span class='ui-ref'>✓ Terminé</span> en haut de l'étape, et le suivant remonte — pas besoin de faire défiler. Vous ne voulez pas ? Désactivez <span class='ui-ref'>Ranger une fois fait</span> dans la barre d'outils. Vous préférez l'inverse ? Activez <span class='ui-ref'>Terminés en bas</span> pour faire descendre les éléments cochés à la fin du module et les étapes terminées en bas de la page." },
      { id: "note", html: "<strong>Voyez la zone à droite de cet élément (en dessous sur mobile) ? C'est son champ de note</strong> — notes, idées, questions : tout va ici ; c'est enregistré automatiquement et repart quand vous copiez votre progression, pour interroger une IA plus tard. Essayez une ligne." },
      { id: "fold", html: "<strong>Cliquez sur le titre de cette étape</strong> pour la déplier ou la replier ; le bloc « État » en haut fonctionne pareil." },
      { id: "link", html: "<strong>Le texte souligné est un lien</strong> — comme <a href=\\"https://github.com/MtsYama/living-checklist\\">celui-ci</a> ; cliquez dessus pour l'ouvrir." },
      { id: "copy", html: "Une fois tout essayé, cliquez sur <span class='ui-ref'>Copier progression + retour</span> en haut : votre progression et vos notes deviennent du texte à recoller dans une conversation IA pour continuer." },
      { id: "nest", html: "Besoin d'étapes plus fines ? <strong>Cliquez sur la petite flèche de l'élément ci-dessous</strong> pour ouvrir une sous-liste.", children: [
        { id: "n1", html: "Les sous-éléments se cochent séparément et n'affectent pas l'élément principal." },
        { id: "n2", html: "Cette couche se <strong>replie</strong> à tout moment, sans jamais encombrer la liste principale." },
        { id: "n3", html: "À mesure que les besoins se précisent, ou qu'une nouvelle règle apparaît, continuez d'ajouter ici des éléments et des listes plus fins." },
      ] },
    ],
  },
  {
    id: "buttons", stepNum: "2", title: "À quoi sert chaque bouton",
    meta: "Il y a deux endroits : la rangée en haut (qui reste fixée à la page) et le groupe en bas à droite (qui flotte).",
    notePlaceholder: "Une explication de bouton que vous n'avez pas comprise, ou qui ne correspond pas à ce que vous voyez ? Dites-le-moi ici.",
    items: [
      { id: "top", html: "<strong>La rangée du haut</strong> : <span class='ui-ref'>tout déplier</span>, <span class='ui-ref'>tout replier</span>, <span class='ui-ref'>réinitialiser les coches</span>, <span class='ui-ref'>copier progression + retour</span>." },
      { id: "lang", html: "<strong>En bas à droite · langue</strong> : EN / FR / 简 / 繁 / 日 ; <strong>seules les langues fournies par cette liste</strong> sont affichées, et une liste à une seule langue n'affiche pas ce bouton." },
      { id: "theme", html: "<strong>En bas à droite · soleil / lune</strong> : bascule entre le clair et le sombre. Par défaut, il suit votre système et mémorise votre choix." },
      { id: "font", html: "<strong>En bas à droite · police</strong> : Défaut (ce modèle utilise <strong>Noto</strong>) ou votre police système (utilisée hors ligne) ; quand vous créez votre propre modèle, vous pouvez choisir ici la police de votre choix." },
    ],
  },
  {
    id: "fill", stepNum: "3", title: "Exemple : des champs remplis pour vous", tag: "key",
    meta: "L'IA prépare les valeurs à l'avance, et vous cliquez sur « Copier » pour les coller directement dans un formulaire — c'est cela, fillData.",
    notePlaceholder: "Toujours bloqué après la copie ? Ou copié mais vous préférez ne pas cocher à la main ? Ou une valeur pré-remplie est fausse ? Dites-le-moi ici.",
    items: [
      { id: "demo", html: "En usage réel, remplacez le <code>fillData</code> ci-dessous par vos propres champs (ceux ci-dessous sont des exemples)." },
    ],
    fillData: [
      { label: "Nom", value: "Mts Shu" },
      { label: "Date de naissance", value: "au commencement" },
      { label: "N°", value: "test333" },
    ],
  },
  {
    id: "customize", stepNum: "4", title: "Personnaliser · à votre image", tag: "skip",
    meta: "Juste pour vous, en une seule langue ? Vous pouvez sauter cette étape.",
    notePlaceholder: "Envie d'autres couleurs, polices ou modèles, ou de quelque chose en plus ? Écrivez-le ici.",
    items: [
      { id: "skin", html: "Pour changer les <strong>couleurs et les polices</strong> : ce skill est également fourni avec un modèle dans un autre style, et vous pouvez en copier un et le modifier avec vos propres couleurs et polices pour en faire votre propre modèle." },
      { id: "content", html: "Pour changer le <strong>contenu</strong> : modifiez <code>MODULES</code> sous <code>[1] DATA</code> dans le fichier (voir les commentaires en haut du fichier pour savoir comment le remplir), ou laissez simplement une IA lire ce skill et le générer pour vous." },
    ],
    links: [ { text: "→ Voir l'autre style : MX Studio", href: "mx-studio.html" } ],
  },
];

MODULES["ja"] = [
  {
    id: "basics", stepNum: "1", title: "このリストの使い方", tag: "key",
    meta: "まず基本の操作を知ってから、順に進めていきましょう。",
    notePlaceholder: "ここで使いにくい所や、前後でちぐはぐな所はありますか?書き留めて、上の「進捗+フィードバックをコピー」を押して送ってください。",
    items: [
      { id: "check", html: "<strong>左のボックスをクリックして、この項目にチェックを入れてみて。</strong>グレーになって、しまわれます。" },
      { id: "tuck", html: "チェックした項目はステップ上部の <span class='ui-ref'>✓ 完了</span> にしまわれ、次の項目がすぐ上がってきます —— スクロール不要。動かしたくなければ、ツールバーの <span class='ui-ref'>完了で自動収納</span> をオフに。逆がよければ、<span class='ui-ref'>完了を最下部へ</span> をオンにすると、チェック済みはモジュール末尾へ、完了したステップはページ最下部へ沈みます。" },
      { id: "note", html: "<strong>この項目の右側(スマホでは下)にあるのがメモ欄です</strong> —— メモも、思いつきも、質問もここに書けます。自動保存され、進捗をコピーすると一緒に持ち出せるので、後で AI に聞けます。試しに一言どうぞ。" },
      { id: "fold", html: "<strong>このステップの見出しをクリック</strong>すると、ステップ全体を展開・折りたたみできます;上の「現状」ブロックも同じです。" },
      { id: "link", html: "<strong>下線のあるテキストはリンク</strong>です —— 例えば<a href=\\"https://github.com/MtsYama/living-checklist\\">これ</a>、クリックで開きます。" },
      { id: "copy", html: "一通り試したら、上の <span class='ui-ref'>進捗+フィードバックをコピー</span> を押して;進捗とメモが文章になってコピーされ、AI との会話に貼り戻せば続きを手伝ってもらえます。" },
      { id: "nest", html: "もっと細かいステップが必要?<strong>下の項目の小さな矢印をクリック</strong>すると、一段下のサブリストを開けます。", children: [
        { id: "n1", html: "サブ項目は個別にチェックでき、親項目には影響しません。" },
        { id: "n2", html: "この階層はいつでも<strong>折りたためる</strong>ので、メインのリストを圧迫しません。" },
        { id: "n3", html: "必要が具体的になったり、新しいルールが出てきたら、ここに細かい項目やリストを足し続けられます。" },
      ] },
    ],
  },
  {
    id: "buttons", stepNum: "2", title: "各ボタンの役割",
    meta: "場所は二つです:上の列(ページに追従します)と、右下のまとまり(画面に浮いています)。",
    notePlaceholder: "分かりにくかったボタンの説明や、実際の表示と合わない所はありますか?ここに書いてください。",
    items: [
      { id: "top", html: "<strong>上の列</strong>:<span class='ui-ref'>すべて展開</span>、<span class='ui-ref'>すべて折りたたみ</span>、<span class='ui-ref'>チェックをリセット</span>、<span class='ui-ref'>進捗+フィードバックをコピー</span>。" },
      { id: "lang", html: "<strong>右下 · 言語</strong>:EN / FR / 简 / 繁 / 日；<strong>このリストが用意している言語だけ</strong>が表示され、一つの言語だけのリストではこのボタンは表示されません。" },
      { id: "theme", html: "<strong>右下 · 太陽 / 月</strong>:ライトとダークを切り替えます。既定ではシステムに従い、選んだ設定を記憶します。" },
      { id: "font", html: "<strong>右下 · フォント</strong>:既定(このテンプレートは <strong>Noto</strong> を使用)か、システムのフォント(オフライン時に使われます);自分のテンプレートを作るときは、ここで好きなフォントに変えられます。" },
    ],
  },
  {
    id: "fill", stepNum: "3", title: "例：あらかじめ記入されたフィールド", tag: "key",
    meta: "AI が値を先に用意しておき、あなたは「コピー」を押してフォームへそのまま貼り付けるだけ —— これが fillData です。",
    notePlaceholder: "コピーした後もまだ問題がありますか?コピーしたけれど手でチェックしたくない?あるいは記入された値が違いますか?ここに書いてください。",
    items: [
      { id: "demo", html: "実際に使うときは、下の <code>fillData</code> をあなた自身の項目に差し替えてください(下にあるのはプレースホルダです)。" },
    ],
    fillData: [
      { label: "氏名", value: "山々" },
      { label: "生年月日", value: "天地開闢のころ" },
      { label: "番号", value: "test333" },
    ],
  },
  {
    id: "customize", stepNum: "4", title: "カスタマイズ · 自分仕様に", tag: "skip",
    meta: "自分用で、一つの言語だけなら、このステップは飛ばして構いません。",
    notePlaceholder: "別の配色・フォント・テンプレートが欲しい、何か足したいことはありますか?ここに書いてください。",
    items: [
      { id: "skin", html: "<strong>配色とフォント</strong>を変えたいとき:この skill には別の雰囲気のテンプレートも付いていて、一つ複製して自分の配色とフォントに変え、自分のテンプレートにすることもできます。" },
      { id: "content", html: "<strong>内容</strong>を変えたいとき:ファイル内の <code>[1] DATA</code> にある <code>MODULES</code> を編集します(書き方はファイル上部のコメントを参照)。あるいは、AI にこの skill を読ませて作ってもらってもかまいません。" },
    ],
    links: [ { text: "→ もう一つの雰囲気を見る:MX Studio", href: "mx-studio.html" } ],
  },
];

/* ===========================================================================
   [2] CONFIG
   =========================================================================== */
const CONFIG = {
  storagePrefix: "living-checklist::base-demo-v3::",
  tour: true,
  lang: "zh-Hans",                                   // default language
  languages: ["en", "fr", "zh-Hans", "zh-Hant", "ja"], // which languages this checklist provides (only these are shown)
  theme: "auto",                                    // "auto" | "light" | "dark" (the default · once the user switches, localStorage wins)
  font: "noto",
  cta: { href: "https://github.com/MtsYama/living-checklist" },           // top CTA · put your real GitHub link here · real users set null to hide                                     // "noto" | "system"
  summaryDefaultOpen: true,
  moduleDefaultOpen: true,
  moduleIcons: false,            // base stays clean with no icons · the MX set has this true
};

/* Icons (Phosphor regular · inline SVG · shown only when moduleIcons:true; mapped by module.id)
   To add icons to your own modules: add the Phosphor path to ICONS, then map module.id in MODULE_ICONS. */
const ICONS = {
  "compass": "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z",
  "cursor-click": "M88,24V16a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0ZM16,104h8a8,8,0,0,0,0-16H16a8,8,0,0,0,0,16ZM124.42,39.16a8,8,0,0,0,10.74-3.58l8-16a8,8,0,0,0-14.31-7.16l-8,16A8,8,0,0,0,124.42,39.16Zm-96,81.69-16,8a8,8,0,0,0,7.16,14.31l16-8a8,8,0,1,0-7.16-14.31ZM219.31,184a16,16,0,0,1,0,22.63l-12.68,12.68a16,16,0,0,1-22.63,0L132.7,168,115,214.09c0,.1-.08.21-.13.32a15.83,15.83,0,0,1-14.6,9.59l-.79,0a15.83,15.83,0,0,1-14.41-11L32.8,52.92A16,16,0,0,1,52.92,32.8L213,85.07a16,16,0,0,1,1.41,29.8l-.32.13L168,132.69ZM208,195.31,156.69,144h0a16,16,0,0,1,4.93-26l.32-.14,45.95-17.64L48,48l52.2,159.86,17.65-46c0-.11.08-.22.13-.33a16,16,0,0,1,11.69-9.34,16.72,16.72,0,0,1,3-.28,16,16,0,0,1,11.3,4.69L195.31,208Z",
  "sliders-horizontal": "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z",
  "palette": "M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89Zm13,93.71A15.89,15.89,0,0,1,198.21,160H152a32,32,0,0,0-32,32,16,16,0,0,1-21.31,15.07C62.49,194.3,40,164,40,128a88,88,0,0,1,87.09-88h.9a88.35,88.35,0,0,1,88,87.25A88.86,88.86,0,0,1,213.81,147.6ZM140,76a12,12,0,1,1-12-12A12,12,0,0,1,140,76ZM96,100A12,12,0,1,1,84,88,12,12,0,0,1,96,100Zm0,56a12,12,0,1,1-12-12A12,12,0,0,1,96,156Zm88-56a12,12,0,1,1-12-12A12,12,0,0,1,184,100Z",
};
const MODULE_ICONS = { basics: "cursor-click", buttons: "sliders-horizontal", customize: "palette" };
const SUMMARY_ICON = "compass";

/* ===========================================================================
   [2b] I18N —— UI strings (the localization layer)
   =========================================================================== */
const LANG_NAMES = { "zh-Hans": "简", "zh-Hant": "繁", "en": "EN", "fr": "FR", "ja": "日" };

const I18N = {
  "zh-Hans": { docTitle:"活页清单 · 基础模板", appTitle:"活页清单 · 基础模板", subtitle:"勾选自动沉底 · 整步完成自动归档 · 进度自动保存", aka:"「The Step-by-Step HTML」,我一般也这么叫它", subToggle:"更细的步骤", progressCaption:"总体进度", expandAll:"全部展开", collapseAll:"全部折叠", reset:"清空打勾", copyFeedback:"复制进度 + 反馈", summaryHeading:"现状 / 必做", note:"备注 · 点这里写", notePlaceholderDefault:"在这里记录本步骤的备注…", itemNotePlaceholder:"✎ 备注、疑问写这里", nudgeHint:"👆 点一下方框勾上试试 —— 看它怎么动", noteHint:"✍️ 就在这写一句备注试试", linkHint:"👆 带下划线的能点开,试试这个", sinkLabel:"勾完自动收起", sinkBottomLabel:"完成项沉底", toggleOn:"开", toggleOff:"关", doneDivider:"已完成", legendIntro:"图例", legendKey:"关键", legendKeyDesc:"卡住后面所有步骤", legendSkip:"可跳过", legendSkipDesc:"知道结论即可、不用做", legendCheck:"勾选后该条划掉并计入进度", langTitle:"语言", controlsToggle:"显示/隐藏 语言·主题·字体", barToggle:"收起/展开 工具栏", themeTitleAuto:"主题：自动", themeTitleLight:"主题：浅色", themeTitleDark:"主题：深色", fontNoto:"默认", fontSystem:"系统", fontTitle:"字体：Noto / 系统", confirmReset:"确定清空所有打勾吗？(备注保留)", announcedDone:"{title} 已完成 · 已归档到已完成区", announcedBack:"{title} 已回到待办区", announcedReset:"已清空所有打勾，全部模块回到待办区", announcedCopied:"已复制进度与反馈到剪贴板，可直接粘贴回对话", announcedCopyFail:"复制失败，请手动选择文本复制", copiedFlash:"已复制 ✓", copyFailFlash:"复制失败", progressValueText:"{done} / {total} 已完成 ({pct}%)", noteAria:"{title} 的备注", feedbackDone:"已完成", feedbackNote:"备注", fillHeading:"帮你填好的字段", fillCopy:"复制", fillCopyAll:"复制全部", fillCopied:"已复制该字段", fillCopiedAll:"已复制全部字段", ctaText:"喜欢这份清单？你也可以做一份自己的：", ctaInstall:"想以后反复用？→ 这个工具的开源代码库（在 GitHub 上，也教 AI 怎么帮你装好） ↗", ctaChat:"平时只用网页版 AI 聊天（ChatGPT / Claude / 豆包 / DeepSeek / Gemini 等）?这段提示词能让它拼出一个核心功能一样、外观更朴素的版本：", ctaCopyBtn:"复制提示词 ↗", ctaChatPrompt:"帮我做一个单文件 HTML 的「活页清单」,请严格按下面实现,最后只输出一个完整的 .html 文件(内联 CSS + JS、零外部依赖,双击就能在浏览器打开):\\n\\n【数据与引擎分离】把所有步骤写成一个数组,每一步有 标题 + 若干可勾选条目;引擎逻辑写好后我只改数据、不动代码。\\n\\n【核心行为,逐条都要】\\n1)完成方式由工具栏上两个相互独立的开关控制,可任意组合成 4 种排列:\\n  · 「勾完自动收起」(默认开):勾上一条 → 它置灰、加删除线,并收进本步骤顶部一个可折叠的「✓ 已完成」分组里;没勾的留在原位、保持可见。\\n  · 「完成项沉底」(默认关):改成让完成的条目 / 步骤沉到底部,而不是收进顶部分组。\\n  · 两个开关互不影响,可各自开 / 关(共 4 种排列),都是工具栏里的切换按钮。\\n2)某一步所有条目都勾完 → 整张卡片就地折叠,并显示一个「✓ 已完成」徽标。\\n3)每个条目各自有一个备注输入框(注意:是每个条目一个,不是每个步骤一个)。\\n4)嵌套子清单:任意一个条目下面都能再展开一层更细的子清单;子条目各自独立勾选,且不计入顶部的总进度。\\n5)顶部一条总进度条,旁边显示「已完成 / 总数」。\\n6)所有勾选状态和备注都自动存进浏览器 localStorage —— 关掉页面再打开,进度和备注都还在。\\n7)工具栏按钮:全部展开、全部折叠、清空打勾、勾完自动收起(开关)、完成项沉底(开关)、复制进度+反馈(把当前进度和每一条的备注拼成 markdown 复制到剪贴板,方便我粘回对话让你接着改)。\\n\\n【可访问性】正文字号至少 16px、所有操作可用键盘、有清晰的焦点框。\\n\\n这份清单的主题是:【在这里写你要追踪的事,例如「搬家流程」「签证材料准备」「新品上线」】。\\n\\n外观简洁清爽即可、不用花哨(这是一个样式更朴素的复刻版,但上面这些核心行为都要有);请直接给我完整的 .html 文件。" },
  "zh-Hant": { docTitle:"活頁清單 · 基礎模板", appTitle:"活頁清單 · 基礎模板", subtitle:"勾選自動沉底 · 整步完成自動歸檔 · 進度自動儲存", aka:"「The Step-by-Step HTML」,我一般也這麼叫它", subToggle:"更細的步驟", progressCaption:"總體進度", expandAll:"全部展開", collapseAll:"全部摺疊", reset:"清空打勾", copyFeedback:"複製進度 + 回饋", summaryHeading:"現狀 / 必做", note:"備註 · 點這裡寫", notePlaceholderDefault:"在這裡記錄本步驟的備註…", itemNotePlaceholder:"✎ 備註、疑問寫這裡", nudgeHint:"👆 點一下方框勾上試試 —— 看它怎麼動", noteHint:"✍️ 就在這寫一句備註試試", linkHint:"👆 帶底線的能點開,試試這個", sinkLabel:"勾完自動收起", sinkBottomLabel:"完成項沉底", toggleOn:"開", toggleOff:"關", doneDivider:"已完成", legendIntro:"圖例", legendKey:"關鍵", legendKeyDesc:"卡住後面所有步驟", legendSkip:"可跳過", legendSkipDesc:"知道結論即可、不用做", legendCheck:"勾選後該條劃掉並計入進度", langTitle:"語言", controlsToggle:"顯示/隱藏 語言·主題·字型", barToggle:"收起/展開 工具列", themeTitleAuto:"主題：自動", themeTitleLight:"主題：淺色", themeTitleDark:"主題：深色", fontNoto:"預設", fontSystem:"系統", fontTitle:"字型：Noto / 系統", confirmReset:"確定清空所有打勾嗎？(備註保留)", announcedDone:"{title} 已完成 · 已歸檔到已完成區", announcedBack:"{title} 已回到待辦區", announcedReset:"已清空所有打勾，全部模組回到待辦區", announcedCopied:"已複製進度與回饋到剪貼簿，可直接貼回對話", announcedCopyFail:"複製失敗，請手動選擇文字複製", copiedFlash:"已複製 ✓", copyFailFlash:"複製失敗", progressValueText:"{done} / {total} 已完成 ({pct}%)", noteAria:"{title} 的備註", feedbackDone:"已完成", feedbackNote:"備註", fillHeading:"幫你填好的欄位", fillCopy:"複製", fillCopyAll:"複製全部", fillCopied:"已複製該欄位", fillCopiedAll:"已複製全部欄位", ctaText:"喜歡這份清單？你也可以做一份自己的：", ctaInstall:"想以後反覆用？→ 這個工具的開源程式碼庫（在 GitHub 上，也教 AI 怎麼幫你裝好） ↗", ctaChat:"平時只用網頁版 AI 聊天（ChatGPT / Claude / 豆包 / DeepSeek / Gemini 等）?這段提示詞能讓它拼出一個核心功能一樣、外觀更樸素的版本：", ctaCopyBtn:"複製提示詞 ↗", ctaChatPrompt:"幫我做一個單檔 HTML 的「活頁清單」,請嚴格按下面實現,最後只輸出一個完整的 .html 檔案(內聯 CSS + JS、零外部依賴,雙擊就能在瀏覽器打開):\\n\\n【資料與引擎分離】把所有步驟寫成一個陣列,每一步有 標題 + 若干可勾選條目;引擎邏輯寫好後我只改資料、不動程式碼。\\n\\n【核心行為,逐條都要】\\n1)完成方式由工具列上兩個互相獨立的開關控制,可任意組合成 4 種排列:\\n  · 「勾完自動收起」(預設開):勾上一條 → 它置灰、加刪除線,並收進本步驟頂部一個可摺疊的「✓ 已完成」分組裡;沒勾的留在原位、保持可見。\\n  · 「完成項沉底」(預設關):改成讓完成的條目 / 步驟沉到底部,而不是收進頂部分組。\\n  · 兩個開關互不影響,可各自開 / 關(共 4 種排列),都是工具列裡的切換按鈕。\\n2)某一步所有條目都勾完 → 整張卡片就地摺疊,並顯示一個「✓ 已完成」徽標。\\n3)每個條目各自有一個備註輸入框(注意:是每個條目一個,不是每個步驟一個)。\\n4)嵌套子清單:任意一個條目下面都能再展開一層更細的子清單;子條目各自獨立勾選,且不計入頂部的總進度。\\n5)頂部一條總進度條,旁邊顯示「已完成 / 總數」。\\n6)所有勾選狀態和備註都自動存進瀏覽器 localStorage —— 關掉頁面再打開,進度和備註都還在。\\n7)工具列按鈕:全部展開、全部摺疊、清空打勾、勾完自動收起(開關)、完成項沉底(開關)、複製進度+回饋(把當前進度和每一條的備註拼成 markdown 複製到剪貼簿,方便我貼回對話讓你接著改)。\\n\\n【可存取性】正文字級至少 16px、所有操作可用鍵盤、有清晰的焦點框。\\n\\n這份清單的主題是:【在這裡寫你要追蹤的事,例如「搬家流程」「簽證材料準備」「新品上線」】。\\n\\n外觀簡潔清爽即可、不用花俏(這是一個樣式更樸素的複刻版,但上面這些核心行為都要有);請直接給我完整的 .html 檔案。" },
  "en": { docTitle:"Living Checklist · Base Template", appTitle:"Living Checklist · Base Template", subtitle:"Checked items sink · finished steps auto-archive · progress auto-saves", aka:"<em>The Step-by-Step HTML</em>, which is what I usually call it", subToggle:"Finer steps", progressCaption:"Overall progress", expandAll:"Expand all", collapseAll:"Collapse all", reset:"Reset checks", copyFeedback:"Copy progress + feedback", summaryHeading:"Status / To do", note:"Notes · type here", notePlaceholderDefault:"Jot a note for this step…", itemNotePlaceholder:"✎ Notes or questions", nudgeHint:"👆 give the box a click — watch what it does", noteHint:"✍️ now jot a note in here", linkHint:"👆 underlined = a link, try this one", sinkLabel:"Tuck away when done", sinkBottomLabel:"Sink done to bottom", toggleOn:"on", toggleOff:"off", doneDivider:"Done", legendIntro:"Legend", legendKey:"Key", legendKeyDesc:"blocks every later step", legendSkip:"Skip-ok", legendSkipDesc:"just know the gist, no action", legendCheck:"checking strikes it through and counts toward progress", langTitle:"Language", controlsToggle:"Show/hide settings", barToggle:"Collapse/expand toolbar", themeTitleAuto:"Theme: Auto", themeTitleLight:"Theme: Light", themeTitleDark:"Theme: Dark", fontNoto:"Default", fontSystem:"System", fontTitle:"Font: Noto / System", confirmReset:"Clear all checks? (notes are kept)", announcedDone:"{title} done · archived to the Done area", announcedBack:"{title} moved back to to-do", announcedReset:"All checks cleared; every module back in to-do", announcedCopied:"Progress + feedback copied; paste it back into chat", announcedCopyFail:"Copy failed, please select the text manually", copiedFlash:"Copied ✓", copyFailFlash:"Copy failed", progressValueText:"{done} / {total} done ({pct}%)", noteAria:"Note for {title}", feedbackDone:"done", feedbackNote:"Note", fillHeading:"Pre-filled fields", fillCopy:"Copy", fillCopyAll:"Copy all", fillCopied:"Field copied", fillCopiedAll:"All fields copied", ctaText:"Like this checklist? You can make one of your own:", ctaInstall:"Want to reuse it later? → the tool's open-source code repository (on GitHub — it also shows an AI how to set it up for you) ↗", ctaChat:"Usually just use a web AI chat (ChatGPT / Claude / Gemini / Copilot, etc.)? This prompt gets it to build you a version with the same core features, just a plainer look:", ctaCopyBtn:"Copy the prompt ↗", ctaChatPrompt:"Help me make a single-file HTML 'living checklist'. Follow the spec below exactly, and at the end give me one complete .html file (inline CSS + JS, zero external dependencies, opens in a browser with a double-click):\\n\\n[Data separate from engine] Put all the steps in one array; each step has a title plus a few checkable items. Once the engine logic is done, I only edit the data, not the code.\\n\\n[Core behaviors, every one of them]\\n1) Completion is controlled by two independent toggles in the toolbar, which combine into 4 possible arrangements:\\n  - 'Tuck away when done' (on by default): check an item and it greys out, gets a strikethrough, and tucks into a collapsible '✓ Done' group at the TOP of its step; unchecked items stay where they are, still visible.\\n  - 'Sink done to bottom' (off by default): instead, completed items / steps sink to the BOTTOM rather than tucking into the top group.\\n  - The two are independent (each can be on or off, 4 arrangements in all), and both are toggle buttons in the toolbar.\\n2) When every item in a step is checked, the whole card collapses in place and shows a '✓ Done' badge.\\n3) Every item has its own note input box (note: one per item, not one per step).\\n4) Nested sub-checklist: any single item can open one more level of finer sub-list beneath it; sub-items are checked independently and do NOT count toward the overall progress at the top.\\n5) One overall progress bar at the top, with 'done / total' shown next to it.\\n6) Every check state and note auto-saves to the browser's localStorage, so closing and reopening the page keeps both the progress and the notes.\\n7) Toolbar buttons: Expand all, Collapse all, Reset checks, Tuck away when done (toggle), Sink done to bottom (toggle), and Copy progress + feedback (bundle the current progress and every item's note into markdown on the clipboard, so I can paste it back into chat for you to keep going).\\n\\n[Accessibility] Body text at least 16px, everything operable by keyboard, clear focus rings.\\n\\nThe topic of this checklist is: [write what you want to track, e.g. 'moving house', 'visa paperwork', 'product launch'].\\n\\nKeep the look clean and simple, nothing fancy (this is a plainer-styled reproduction, but all the core behaviors above must be there); just give me the complete .html file." },
  "fr": { docTitle:"Living Checklist · Modèle de base", appTitle:"Living Checklist · Modèle de base", subtitle:"Les éléments cochés descendent · étapes finies auto-archivées · progression auto-enregistrée", aka:"<em>The Step-by-Step HTML</em>, comme je l'appelle souvent", subToggle:"Étapes détaillées", progressCaption:"Progression globale", expandAll:"Tout ouvrir", collapseAll:"Tout replier", reset:"Réinitialiser", copyFeedback:"Copier progression + retour", summaryHeading:"État / À faire", note:"Notes · écrivez ici", notePlaceholderDefault:"Une note pour cette étape…", itemNotePlaceholder:"✎ Notes ou questions", nudgeHint:"👆 cochez la case — regardez ce qu'elle fait", noteHint:"✍️ écrivez une note ici", linkHint:"👆 souligné = un lien, essayez celui-ci", sinkLabel:"Ranger une fois fait", sinkBottomLabel:"Terminés en bas", toggleOn:"activé", toggleOff:"désactivé", doneDivider:"Terminé", legendIntro:"Légende", legendKey:"Clé", legendKeyDesc:"bloque toutes les étapes suivantes", legendSkip:"Optionnel", legendSkipDesc:"il suffit de connaître l'idée", legendCheck:"cocher la barre et compte dans la progression", langTitle:"Langue", controlsToggle:"Afficher/masquer les réglages", barToggle:"Réduire/déployer la barre d'outils", themeTitleAuto:"Thème : Auto", themeTitleLight:"Thème : Clair", themeTitleDark:"Thème : Sombre", fontNoto:"Défaut", fontSystem:"Système", fontTitle:"Police : Noto / Système", confirmReset:"Effacer toutes les coches ? (les notes restent)", announcedDone:"{title} terminé · archivé", announcedBack:"{title} de retour dans à faire", announcedReset:"Coches effacées ; tous les modules de retour", announcedCopied:"Progression + retour copiés ; collez dans le chat", announcedCopyFail:"Échec de copie, sélectionnez le texte manuellement", copiedFlash:"Copié ✓", copyFailFlash:"Échec", progressValueText:"{done} / {total} terminé ({pct}%)", noteAria:"Note pour {title}", feedbackDone:"terminé", feedbackNote:"Note", fillHeading:"Champs pré-remplis", fillCopy:"Copier", fillCopyAll:"Tout copier", fillCopied:"Champ copié", fillCopiedAll:"Tous copiés", ctaText:"Cette liste vous plaît ? Vous pouvez créer la vôtre :", ctaInstall:"Pour le réutiliser plus tard ? → le dépôt de code open source de l’outil (sur GitHub — il montre aussi à une IA comment l’installer pour vous) ↗", ctaChat:"Vous utilisez d'habitude seulement une IA en ligne (ChatGPT / Claude / Gemini / Le Chat, etc.) ? Ce prompt lui fait construire une version aux mêmes fonctions de base, juste avec un rendu plus sobre :", ctaCopyBtn:"Copier l'invite ↗", ctaChatPrompt:"Aide-moi à créer une « liste vivante » en HTML, dans un seul fichier. Suis exactement les indications ci-dessous et donne-moi à la fin un fichier .html complet (CSS + JS en ligne, zéro dépendance externe, s'ouvre dans le navigateur d'un double-clic) :\\n\\n[Données séparées du moteur] Mets toutes les étapes dans un tableau ; chaque étape a un titre et quelques éléments cochables. Une fois le moteur écrit, je ne modifie que les données, pas le code.\\n\\n[Comportements clés, tous]\\n1) L'achèvement est géré par deux interrupteurs indépendants dans la barre d'outils, qui se combinent en 4 dispositions possibles :\\n  - « Ranger une fois fait » (activé par défaut) : coche un élément et il se grise, se barre et se range dans un groupe repliable « ✓ Terminé » EN HAUT de son étape ; les éléments non cochés restent à leur place, visibles.\\n  - « Terminés en bas » (désactivé par défaut) : à la place, les éléments / étapes terminés descendent EN BAS au lieu de se ranger dans le groupe du haut.\\n  - Les deux sont indépendants (chacun peut être activé ou non, 4 dispositions en tout), et tous deux sont des boutons-bascule dans la barre d'outils.\\n2) Quand tous les éléments d'une étape sont cochés, la carte entière se replie sur place et affiche un badge « ✓ Terminé ».\\n3) Chaque élément a son propre champ de note (attention : un par élément, pas un par étape).\\n4) Sous-liste imbriquée : n'importe quel élément peut ouvrir un niveau de sous-liste plus fine en dessous de lui ; les sous-éléments se cochent indépendamment et ne comptent PAS dans la progression globale en haut.\\n5) Une barre de progression globale en haut, avec « fait / total » à côté.\\n6) Tous les états de coche et les notes s'enregistrent automatiquement dans le localStorage du navigateur ; fermer puis rouvrir la page conserve la progression et les notes.\\n7) Boutons de la barre d'outils : Tout ouvrir, Tout replier, Réinitialiser, Ranger une fois fait (bascule), Terminés en bas (bascule), et Copier progression + retour (rassemble la progression actuelle et la note de chaque élément en markdown dans le presse-papiers, pour les recoller dans le chat afin que tu continues).\\n\\n[Accessibilité] Texte d'au moins 16px, tout utilisable au clavier, anneaux de focus visibles.\\n\\nLe sujet de cette liste est : [écris ce que tu veux suivre, ex. « déménagement », « dossier de visa », « lancement de produit »].\\n\\nGarde un rendu simple et net, rien de tape-à-l'œil (c'est une reproduction au style plus sobre, mais tous les comportements clés ci-dessus doivent être présents) ; donne-moi directement le fichier .html complet." },
  "ja": { docTitle:"活頁清単 · 基本テンプレート", appTitle:"活頁清単 · 基本テンプレート", subtitle:"チェックで沈む · 完了ステップは自動保管 · 進捗は自動保存", aka:"「The Step-by-Step HTML」、自分も普段そう呼んでいる", subToggle:"より細かいステップ", progressCaption:"全体の進捗", expandAll:"すべて展開", collapseAll:"すべて折りたたむ", reset:"チェックをリセット", copyFeedback:"進捗+フィードバックをコピー", summaryHeading:"現状 / やること", note:"メモ · ここに入力できます", notePlaceholderDefault:"このステップのメモ…", itemNotePlaceholder:"✎ メモ・質問はここへ", nudgeHint:"👆 ボックスをチェックしてみて — 動きを見てね", noteHint:"✍️ ここにメモを書いてみて", linkHint:"👆 下線付きはリンク、これを押してみて", sinkLabel:"完了で自動収納", sinkBottomLabel:"完了を最下部へ", toggleOn:"オン", toggleOff:"オフ", doneDivider:"完了", legendIntro:"凡例", legendKey:"重要", legendKeyDesc:"後続すべてを止める", legendSkip:"省略可", legendSkipDesc:"結論だけ分かればよい", legendCheck:"チェックで取り消し線+進捗に加算", langTitle:"言語", controlsToggle:"設定の表示/非表示", barToggle:"ツールバーの折りたたみ/展開", themeTitleAuto:"テーマ：自動", themeTitleLight:"テーマ：ライト", themeTitleDark:"テーマ：ダーク", fontNoto:"既定", fontSystem:"システム", fontTitle:"フォント:Noto / システム", confirmReset:"すべてのチェックを消す?(メモは残ります)", announcedDone:"{title} 完了 · 保管しました", announcedBack:"{title} を未完了へ戻しました", announcedReset:"チェックをすべて消去；全モジュールを未完了へ", announcedCopied:"進捗+フィードバックをコピー;チャットに貼り付け", announcedCopyFail:"コピー失敗、手動で選択してください", copiedFlash:"コピー済 ✓", copyFailFlash:"失敗", progressValueText:"{done} / {total} 完了 ({pct}%)", noteAria:"{title} のメモ", feedbackDone:"完了", feedbackNote:"メモ", fillHeading:"記入済みフィールド", fillCopy:"コピー", fillCopyAll:"全部コピー", fillCopied:"コピーしました", fillCopiedAll:"全部コピーしました", ctaText:"このリストが気に入りましたか?あなた自身のものも作れます:", ctaInstall:"あとで繰り返し使うなら？→ このツールのオープンソースのコードリポジトリ（GitHub 上。AI に導入のしかたも教えてくれます） ↗", ctaChat:"普段はウェブ版の AI チャット(ChatGPT / Claude / Gemini / Copilot など)を使うだけですか?このプロンプトで、中核の機能は同じで見た目だけ素朴な版を作ってもらえます:", ctaCopyBtn:"プロンプトをコピー ↗", ctaChatPrompt:"単一ファイルの HTML で「活頁清単(リビング・チェックリスト)」を作ってください。下記の仕様どおりに実装し、最後に完全な .html ファイルを 1 つだけ出力してください(CSS・JS はインライン、外部依存ゼロ、ダブルクリックでブラウザで開ける):\\n\\n【データとエンジンの分離】すべてのステップを 1 つの配列にし、各ステップに タイトル + いくつかのチェック項目 を持たせる。エンジンを書いたら、私はデータだけ編集し、コードは触らない。\\n\\n【中核の動作、すべて必須】\\n1)完了の扱いは、ツールバー上の独立した 2 つのトグルで決まり、自由に組み合わせて 4 通りの配置になる:\\n  · 「完了で自動収納」(既定オン):項目にチェック → グレーアウト+取り消し線になり、そのステップ上部の折りたためる「✓ 完了」グループへ収納される;未チェックの項目は元の位置に見えたまま残る。\\n  · 「完了を最下部へ」(既定オフ):上部グループに収納する代わりに、完了した項目 / ステップを最下部へ沈める。\\n  · 2 つは互いに独立していて、それぞれオン / オフできる(全部で 4 通り)。どちらもツールバーのトグルボタン。\\n2)あるステップの全項目を完了 → カード全体がその場で畳まれ、「✓ 完了」バッジを表示。\\n3)各項目にそれぞれメモ入力欄がある(注意:ステップごとに 1 つではなく、項目ごとに 1 つ)。\\n4)ネストした子チェックリスト:どの項目の下にも、もう 1 段だけ細かい子リストを開ける;子項目は独立してチェックでき、上部の全体進捗には加算されない。\\n5)上部に全体の進捗バー、横に「完了 / 合計」。\\n6)チェック状態とメモはすべてブラウザの localStorage に自動保存 —— 閉じて開き直しても進捗もメモも残る。\\n7)ツールバーのボタン:すべて展開・すべて折りたたみ・チェックをクリア・完了で自動収納(トグル)・完了を最下部へ(トグル)・進捗+フィードバックをコピー(現在の進捗と各項目のメモを markdown にまとめてクリップボードへ。チャットに貼り戻して続けられる)。\\n\\n【アクセシビリティ】本文 16px 以上、すべてキーボード操作可、明確なフォーカスリング。\\n\\nこのリストのテーマは:【追跡したいことを書く。例「引っ越し」「ビザ書類」「新商品リリース」】。\\n\\n見た目はシンプルで十分、凝らなくてよい(これは見た目をより素朴にした再現版だが、上記の中核動作はすべて備えること);完全な .html ファイルをそのままください。" },
};

/* ===========================================================================
   [4] ENGINE
   =========================================================================== */

/* ---------- 4.0 Language / content resolution ---------- */
function fallbackLang() { return CONFIG.languages.indexOf("en") >= 0 ? "en" : CONFIG.languages[0]; }
function t(key, vars) {
  const dict = I18N[CONFIG.lang] || I18N[fallbackLang()] || {};
  let s = (key in dict) ? dict[key] : ((I18N[fallbackLang()] || {})[key] || key);
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}
function isLocaleKeyed(d) {
  return d && !Array.isArray(d) && typeof d === "object" &&
         CONFIG.languages.some((l) => l in d);
}
function pickLocalized(d) {
  if (!isLocaleKeyed(d)) return d;
  return d[CONFIG.lang] != null ? d[CONFIG.lang] : (d[fallbackLang()] != null ? d[fallbackLang()] : d[CONFIG.languages[0]]);
}

let ACTIVE_MODULES = [];
let ACTIVE_SUMMARY = null;
let ITEM_DEFAULTS = new Map();

function refreshActive() {
  ACTIVE_MODULES = pickLocalized(MODULES) || [];
  ACTIVE_SUMMARY = pickLocalized(SUMMARY) || null;
  ITEM_DEFAULTS = new Map();
  for (const mod of ACTIVE_MODULES)
    for (const it of mod.items)
      ITEM_DEFAULTS.set(mod.id + "::" + it.id, !!it.defaultChecked);
}

/* ---------- 4.1 Persistence ---------- */
function loadBool(key, fb) { try { const r = localStorage.getItem(key); return r === null ? fb : r === "1"; } catch (_) { return fb; } }
function saveBool(key, v) { try { localStorage.setItem(key, v ? "1" : "0"); } catch (_) {} }
function loadStr(key, fb) { try { const r = localStorage.getItem(key); return r === null ? fb : r; } catch (_) { return fb; } }
function saveStr(key, v) { try { if (v === "") localStorage.removeItem(key); else localStorage.setItem(key, v); } catch (_) {} }
function _hashStr(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) { h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; } return String(h); }

/* ---------- 4.2 Storage keys ---------- */
const K = {
  summaryOpen: () => CONFIG.storagePrefix + "summary-open",
  toolbarOpen: () => CONFIG.storagePrefix + "toolbar-open",
  controlsOpen: () => CONFIG.storagePrefix + "controls-open",
  moduleOpen:  (mid) => CONFIG.storagePrefix + "mod-open::" + mid,
  doneGroupOpen: (mid) => CONFIG.storagePrefix + "done-open::" + mid,
  itemChecked: (mid, iid) => CONFIG.storagePrefix + "item::" + mid + "::" + iid,
  subChecked:  (mid, iid, sid) => CONFIG.storagePrefix + "sub::" + mid + "::" + iid + "::" + sid,
  subOpen:     (mid, iid) => CONFIG.storagePrefix + "sub-open::" + mid + "::" + iid,
  itemNote:    (mid, iid) => CONFIG.storagePrefix + "inote::" + mid + "::" + iid,
  noteCleared: (mid, iid, rev) => CONFIG.storagePrefix + "noteclr::" + mid + "::" + iid + "::" + rev,
  noteHash:    (mid, iid) => CONFIG.storagePrefix + "inhash::" + mid + "::" + iid,
  moduleNote:  (mid) => CONFIG.storagePrefix + "note::" + mid,
  autoSink: () => CONFIG.storagePrefix + "auto-sink",
  sinkBottom: () => CONFIG.storagePrefix + "sink-bottom",
  tourStep: () => CONFIG.storagePrefix + "tour-step",
  lang: () => CONFIG.storagePrefix + "lang",
  theme: () => CONFIG.storagePrefix + "theme",
  font: () => CONFIG.storagePrefix + "font",
};

/* ---------- 4.3 State queries ---------- */
function isItemChecked(mid, iid) { return loadBool(K.itemChecked(mid, iid), ITEM_DEFAULTS.get(mid + "::" + iid) || false); }
function isSubChecked(mid, iid, child) { return loadBool(K.subChecked(mid, iid, child.id), !!child.defaultChecked); }
function isModuleDone(m) { return m.items.length > 0 && m.items.every((it) => isItemChecked(m.id, it.id)); }
function computeProgress() { let d = 0, t2 = 0; for (const m of ACTIVE_MODULES) for (const it of m.items) { t2++; if (isItemChecked(m.id, it.id)) d++; } return { done: d, total: t2 }; }
function autoSinkOn() { return loadBool(K.autoSink(), true); }   // auto-sink on check: on by default (can be turned off in the toolbar, for people who don't want items moving)
function sinkBottomOn() { return loadBool(K.sinkBottom(), false); }   // sink completed to bottom (the old v2 behavior): off by default. ON = checked items sink to the module's end + fully-done modules collapse and sink below the "✅ 已完成" divider into doneHost
/* "Dare to click" three-step tour: ① checkbox → ② note field → ③ link. Each step completed moves the hint to the next; one-time overall, and once done it never reappears.
   Pure DOM decoration (called after render), not inlined in renderItem —— this way it can update in place when advancing without losing input focus. */
function tourStepNum() { const v = loadStr(K.tourStep(), "0"); return v === "done" ? 99 : (parseInt(v, 10) || 0); }
function maybeAdvanceTour(kind) {
  const s = tourStepNum(); if (s >= 99) return;
  let to = null;
  if (kind === "check" && s <= 0) to = "1";
  else if (kind === "note" && s <= 1) to = "2";
  else if (kind === "link" && s <= 2) to = "done";
  if (to !== null) { saveStr(K.tourStep(), to); applyTourNudge(); }
}
function applyTourNudge() {
  document.querySelectorAll("li.item.nudge").forEach((li) => li.classList.remove("nudge"));
  document.querySelectorAll(".nudge-hint").forEach((el) => el.remove());
  document.querySelectorAll(".note-nudge").forEach((el) => el.classList.remove("note-nudge"));
  document.querySelectorAll(".link-nudge").forEach((el) => el.classList.remove("link-nudge"));
  if (!CONFIG.tour) return;
  const s = tourStepNum(); if (s >= 99) return;
  const host = document.getElementById("activeHost"); if (!host) return;
  const addHint = (parent, key) => { const h = document.createElement("span"); h.className = "nudge-hint"; h.textContent = t(key); parent.appendChild(h); };
  if (s === 0) {
    const li = Array.from(host.querySelectorAll(".items-active li.item")).find((x) => !x.classList.contains("checked"));
    if (li) { li.classList.add("nudge"); const main = li.querySelector(".item-main"); if (main) addHint(main, "nudgeHint"); }
  } else if (s === 1) {
    const note = host.querySelector(".items-active li.item .item-note");
    if (note) { note.classList.add("note-nudge"); addHint(note, "noteHint"); }
  } else if (s === 2) {
    const a = host.querySelector(".items-active li.item .item-main label a");
    if (a) { a.classList.add("link-nudge"); const li = a.closest("li.item"); const main = li ? li.querySelector(".item-main") : null; if (main) addHint(main, "linkHint"); }
  }
}

/* ---------- 4.4 reduced-motion + FLIP ---------- */
function prefersReducedMotion() { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (_) { return false; } }
function flip(elements, mutate) {
  if (prefersReducedMotion()) { mutate(); return; }
  const first = new Map();
  elements.forEach((el) => first.set(el, el.getBoundingClientRect()));
  mutate();
  elements.forEach((el) => {
    const a = first.get(el); if (!a || !el.isConnected) return;
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (dx === 0 && dy === 0) return;
    el.style.transition = "none"; el.style.transform = "translate(" + dx + "px," + dy + "px)";
    requestAnimationFrame(() => {
      el.style.transition = "transform var(--t-mid) var(--ease)"; el.style.transform = "";
      el.addEventListener("transitionend", function clr(e) { if (e.propertyName !== "transform") return; el.style.transition = ""; el.removeEventListener("transitionend", clr); });
    });
  });
}

/* ---------- 4.5 Collapse animation ---------- */
function setCollapsed(sleeve, body, headBtn, open, animate) {
  headBtn.setAttribute("aria-expanded", String(open));
  if (sleeve._ch) { sleeve.removeEventListener("transitionend", sleeve._ch); sleeve._ch = null; }
  if (!animate || prefersReducedMotion()) { body.hidden = !open; sleeve.style.maxHeight = open ? "none" : "0"; sleeve.style.opacity = open ? "" : "0"; return; }
  if (open) {
    body.hidden = false; sleeve.style.opacity = ""; sleeve.style.maxHeight = "0"; void sleeve.offsetHeight;
    sleeve.style.maxHeight = sleeve.scrollHeight + "px";
    const done = (e) => { if (e.target !== sleeve || e.propertyName !== "max-height") return; sleeve.style.maxHeight = "none"; sleeve.removeEventListener("transitionend", done); sleeve._ch = null; };
    sleeve._ch = done; sleeve.addEventListener("transitionend", done);
  } else {
    sleeve.style.maxHeight = sleeve.scrollHeight + "px"; void sleeve.offsetHeight; sleeve.style.maxHeight = "0"; sleeve.style.opacity = "0";
    const done = (e) => { if (e.target !== sleeve || e.propertyName !== "max-height") return; body.hidden = true; sleeve.removeEventListener("transitionend", done); sleeve._ch = null; };
    sleeve._ch = done; sleeve.addEventListener("transitionend", done);
  }
}

/* ---------- 4.6 Rendering ---------- */
const moduleCards = new Map();

function widont(el) {
  if (!el) return;
  try {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let last = null; while (w.nextNode()) { const v = w.currentNode.nodeValue; if (v && v.trim()) last = w.currentNode; }
    if (last) last.nodeValue = last.nodeValue.replace(/(\\S)\\s+(\\S+)\\s*\$/, "\$1 \$2");
  } catch (_) {}
}
function tagInfo(tag) { if (tag === "key") return { cls: "tag-key", label: t("legendKey") }; if (tag === "skip") return { cls: "tag-skip", label: t("legendSkip") }; return null; }
function tagBadgeHTML(tag) { const ti = tagInfo(tag); return ti ? ' <span class="tag ' + ti.cls + '">' + ti.label + "</span>" : ""; }
function iconSVG(name, cls) { return ICONS[name] ? '<span class="' + cls + '"><svg viewBox="0 0 256 256" aria-hidden="true"><path d="' + ICONS[name] + '"/></svg></span> ' : ""; }
function moduleIconHTML(mid) { return (CONFIG.moduleIcons && MODULE_ICONS[mid]) ? iconSVG(MODULE_ICONS[mid], "module-icon") : ""; }
function plainTitle(m) { return stripHtml(m.title); }
function stripHtml(html) { const d = document.createElement("div"); d.innerHTML = String(html); return (d.textContent || "").replace(/\\s+/g, " ").trim(); }
function cssEscape(s) { if (window.CSS && CSS.escape) return CSS.escape(s); return String(s).replace(/[^a-zA-Z0-9_-]/g, "\\\\\$&"); }

function renderItem(module, item) {
  const checked = isItemChecked(module.id, item.id);
  const li = document.createElement("li");
  li.className = "item" + (checked ? " checked" : ""); li.dataset.itemId = item.id;
  const main = document.createElement("div"); main.className = "item-main";
  const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = checked; cb.id = "cb-" + module.id + "-" + item.id;
  const label = document.createElement("label"); label.id = cb.id + "-lbl"; cb.setAttribute("aria-labelledby", label.id); label.innerHTML = item.html; widont(label);
  cb.addEventListener("change", () => { saveBool(K.itemChecked(module.id, item.id), cb.checked); onToggle(module); maybeAdvanceTour("check"); });
  label.querySelectorAll("a").forEach((a) => { a.target = "_blank"; a.rel = "noopener noreferrer"; });   // always open links in a new tab (don't navigate the checklist page away and lose progress)
  const lk = label.querySelector("a"); if (lk) lk.addEventListener("click", () => maybeAdvanceTour("link"));
  main.appendChild(cb); main.appendChild(label);
  li.appendChild(main);
  li.appendChild(renderItemNote(module, item));
  if (item.children && item.children.length) li.appendChild(buildSubbranch(module, item));
  return li;
}
/* Second-level sub-list: hang a layer of finer, collapsible checklist under an item. Sub-items are checked independently (key prefix sub:: in its own namespace),
   and don't take part in sinking / progress / archiving —— purely additive, leaving the core logic of flat items untouched. */
function buildSubbranch(module, item) {
  const wrap = document.createElement("div"); wrap.className = "subbranch";
  const open = loadBool(K.subOpen(module.id, item.id), true);
  const toggle = document.createElement("button"); toggle.type = "button"; toggle.className = "collapse-head sub-toggle";
  toggle.setAttribute("aria-expanded", String(open));
  const chev = document.createElement("span"); chev.className = "chevron"; chev.setAttribute("aria-hidden", "true"); chev.textContent = "▼";
  const lbl = document.createElement("span"); lbl.innerHTML = item.childrenLabel || t("subToggle"); widont(lbl);
  toggle.appendChild(chev); toggle.appendChild(lbl);
  const sleeve = document.createElement("div"); sleeve.className = "collapse-sleeve";
  const ul = document.createElement("ul"); ul.className = "subitems";
  for (const c of item.children) {
    const checked = isSubChecked(module.id, item.id, c);
    const sli = document.createElement("li"); sli.className = "subitem" + (checked ? " checked" : ""); sli.dataset.subId = c.id;
    const scb = document.createElement("input"); scb.type = "checkbox"; scb.checked = checked; scb.id = "cb-sub-" + module.id + "-" + item.id + "-" + c.id;
    const slabel = document.createElement("label"); slabel.id = scb.id + "-lbl"; scb.setAttribute("aria-labelledby", slabel.id); slabel.innerHTML = c.html; widont(slabel);
    scb.addEventListener("change", () => { saveBool(K.subChecked(module.id, item.id, c.id), scb.checked); sli.classList.toggle("checked", scb.checked); });
    sli.appendChild(scb); sli.appendChild(slabel); ul.appendChild(sli);
  }
  sleeve.appendChild(ul); setCollapsed(sleeve, ul, toggle, open, false);
  toggle.addEventListener("click", () => { const nowOpen = toggle.getAttribute("aria-expanded") !== "true"; setCollapsed(sleeve, ul, toggle, nowOpen, true); saveBool(K.subOpen(module.id, item.id), nowOpen); });
  wrap.appendChild(toggle); wrap.appendChild(sleeve); return wrap;
}
function sortedItems(m) { if (!autoSinkOn() && !sinkBottomOn()) return m.items; const u = m.items.filter((it) => !isItemChecked(m.id, it.id)); const c = m.items.filter((it) => isItemChecked(m.id, it.id)); return u.concat(c); }
function renderItemList(m) { const ul = document.createElement("ul"); ul.className = "items"; for (const it of sortedItems(m)) ul.appendChild(renderItem(m, it)); return ul; }
/* Per-item always-on note: to the right of the item on wide screens, below it on narrow screens; visible at a glance, never folded (discoverability) */
function renderItemNote(module, item) {
  const wrap = document.createElement("div"); wrap.className = "item-note";
  const taId = "inote-" + module.id + "-" + item.id;
  const ta = document.createElement("textarea"); ta.id = taId; ta.rows = 1;
  // Iteration hygiene: a note is a request to the maintainer; once the item is updated this session to
  // address it (item.clearNote = a rev tag), the note is consumed and clears itself — one-shot per (item, rev).
  // Untouched items (no clearNote) keep their notes.
  if (item.clearNote) {
    const _clr = K.noteCleared(module.id, item.id, String(item.clearNote));
    if (!loadBool(_clr, false)) { saveStr(K.itemNote(module.id, item.id), ""); saveBool(_clr, true); }
  }
  const _hkey = K.noteHash(module.id, item.id);
  const _curHash = _hashStr(item.html);
  const _savedHash = loadStr(_hkey, "");
  if (loadStr(K.itemNote(module.id, item.id), "") && _savedHash && _savedHash !== _curHash) {
    saveStr(K.itemNote(module.id, item.id), ""); saveStr(_hkey, "");
  }
  ta.value = loadStr(K.itemNote(module.id, item.id), "");
  ta.placeholder = t("itemNotePlaceholder");
  ta.setAttribute("aria-label", t("note"));
  ta.addEventListener("input", () => { saveStr(K.itemNote(module.id, item.id), ta.value); maybeAdvanceTour("note"); });
  wrap.appendChild(ta); return wrap;
}
function renderLinks(m) {
  const wrap = document.createElement("div"); wrap.className = "module-links";
  for (const lk of m.links) { const a = document.createElement("a"); a.href = lk.href; a.textContent = lk.text; a.target = "_blank"; a.rel = "noopener noreferrer"; wrap.appendChild(a); }
  return wrap;
}
function buildModuleCard(module) {
  const done = isModuleDone(module);
  const openKey = K.moduleOpen(module.id);
  const open = done ? loadBool(openKey, false) : loadBool(openKey, CONFIG.moduleDefaultOpen);
  const doneCount = module.items.filter((it) => isItemChecked(module.id, it.id)).length;
  const total = module.items.length;
  const section = document.createElement("section"); section.className = "module" + (done ? " done" : ""); section.dataset.moduleId = module.id;
  const bodyId = "body-" + module.id;
  const head = document.createElement("div"); head.className = "module-head";
  const headBtn = document.createElement("button"); headBtn.type = "button"; headBtn.className = "collapse-head";
  headBtn.setAttribute("aria-expanded", String(open)); headBtn.setAttribute("aria-controls", bodyId);
  const chevron = document.createElement("span"); chevron.className = "chevron"; chevron.setAttribute("aria-hidden", "true"); chevron.textContent = "▼";
  const h2 = document.createElement("h2");
  h2.innerHTML = moduleIconHTML(module.id) + (module.stepNum ? '<span class="module-step">' + module.stepNum + "</span> " : "") + module.title + tagBadgeHTML(module.tag) + ' <span class="module-count">(' + doneCount + "/" + total + ")</span>" + ' <span class="module-done-badge">✓ ' + t("doneDivider") + '</span>';
  headBtn.appendChild(chevron); headBtn.appendChild(h2); head.appendChild(headBtn);
  if (module.meta) { const me = document.createElement("div"); me.className = "module-meta"; me.innerHTML = module.meta; widont(me); head.appendChild(me); }
  const sleeve = document.createElement("div"); sleeve.className = "collapse-sleeve";
  const body = document.createElement("div"); body.className = "module-body"; body.id = bodyId;
  // —— "✓ Done N" collapse group (pinned to top · collapsed by default · hidden when N=0 or auto-sink is off) ——
  const doneWrap = document.createElement("div"); doneWrap.className = "done-group";
  const dgOpen = loadBool(K.doneGroupOpen(module.id), false);
  const dgBtn = document.createElement("button"); dgBtn.type = "button"; dgBtn.className = "collapse-head done-group-head";
  dgBtn.setAttribute("aria-expanded", String(dgOpen));
  const dgChev = document.createElement("span"); dgChev.className = "chevron"; dgChev.setAttribute("aria-hidden", "true"); dgChev.textContent = "▼";
  const dgLbl = document.createElement("span"); dgLbl.className = "done-group-label";
  dgBtn.appendChild(dgChev); dgBtn.appendChild(dgLbl);
  const dgSleeve = document.createElement("div"); dgSleeve.className = "collapse-sleeve";
  const doneUl = document.createElement("ul"); doneUl.className = "items items-done";
  dgSleeve.appendChild(doneUl); doneWrap.appendChild(dgBtn); doneWrap.appendChild(dgSleeve);
  setCollapsed(dgSleeve, doneUl, dgBtn, dgOpen, false);
  dgBtn.addEventListener("click", () => { const o = dgBtn.getAttribute("aria-expanded") !== "true"; setCollapsed(dgSleeve, doneUl, dgBtn, o, true); saveBool(K.doneGroupOpen(module.id), o); });
  // —— Active (in-progress) list —— checked ones go into the collapse group, the rest stay here in their original order (order not shuffled)
  const activeUl = document.createElement("ul"); activeUl.className = "items items-active";
  // 收起 = collapse completed into the "✓ 已完成" group; 沉底 = put completed at the bottom (else top/in-place)
  if (autoSinkOn()) {
    for (const it of module.items) { const li = renderItem(module, it); (isItemChecked(module.id, it.id) ? doneUl : activeUl).appendChild(li); }
  } else if (sinkBottomOn()) {
    for (const it of sortedItems(module)) activeUl.appendChild(renderItem(module, it));
  } else {
    for (const it of module.items) activeUl.appendChild(renderItem(module, it));
  }
  if (sinkBottomOn()) { body.appendChild(activeUl); body.appendChild(doneWrap); } else { body.appendChild(doneWrap); body.appendChild(activeUl); }
  if (module.fillData && module.fillData.length) body.appendChild(renderFill(module));
  if (module.links && module.links.length) body.appendChild(renderLinks(module));
  sleeve.appendChild(body); setCollapsed(sleeve, body, headBtn, open, false);
  headBtn.addEventListener("click", () => { const nowOpen = headBtn.getAttribute("aria-expanded") !== "true"; setCollapsed(sleeve, body, headBtn, nowOpen, true); saveBool(openKey, nowOpen); });
  section.appendChild(head); section.appendChild(sleeve);
  const rec = { section, sleeve, body, headBtn, activeUl, doneUl, doneWrap, dgBtn };
  moduleCards.set(module.id, rec); updateDoneGroup(module, rec, false); return section;
}
function liOf(rec, iid) { return rec.section.querySelector('li.item[data-item-id="' + cssEscape(iid) + '"]'); }
function updateDoneGroup(module, rec, animate) {
  const n = module.items.filter((it) => isItemChecked(module.id, it.id)).length;
  const show = n > 0 && autoSinkOn();   // item-level: checked items tuck into the per-step "✓ 已完成" group whenever auto-sink is on (independent of 完成项沉底 = step-level)
  rec.doneWrap.hidden = !show;
  const lbl = rec.dgBtn.querySelector(".done-group-label");
  if (lbl) lbl.textContent = "✓ " + t("doneDivider") + " " + n;
  if (animate && show && !prefersReducedMotion()) { rec.dgBtn.classList.remove("bump"); void rec.dgBtn.offsetWidth; rec.dgBtn.classList.add("bump"); }
}

function renderSummary(host) {
  host.innerHTML = ""; if (!ACTIVE_SUMMARY) return;
  const open = loadBool(K.summaryOpen(), CONFIG.summaryDefaultOpen);
  const bodyId = "summary-body";
  const box = document.createElement("section"); box.className = "summary";
  const headBtn = document.createElement("button"); headBtn.type = "button"; headBtn.className = "collapse-head";
  headBtn.setAttribute("aria-expanded", String(open)); headBtn.setAttribute("aria-controls", bodyId);
  const chevron = document.createElement("span"); chevron.className = "chevron"; chevron.setAttribute("aria-hidden", "true"); chevron.textContent = "▼";
  const h2 = document.createElement("h2"); h2.innerHTML = (CONFIG.moduleIcons && SUMMARY_ICON ? iconSVG(SUMMARY_ICON, "summary-icon") : "") + t("summaryHeading");
  headBtn.appendChild(chevron); headBtn.appendChild(h2);
  const sleeve = document.createElement("div"); sleeve.className = "collapse-sleeve";
  const body = document.createElement("div"); body.className = "body"; body.id = bodyId; body.innerHTML = ACTIVE_SUMMARY;
  body.querySelectorAll("p, li").forEach(widont);
  body.querySelectorAll("a").forEach((a) => { a.target = "_blank"; a.rel = "noopener noreferrer"; });
  sleeve.appendChild(body); setCollapsed(sleeve, body, headBtn, open, false);
  headBtn.addEventListener("click", () => { const nowOpen = headBtn.getAttribute("aria-expanded") !== "true"; setCollapsed(sleeve, body, headBtn, nowOpen, true); saveBool(K.summaryOpen(), nowOpen); });
  box.appendChild(headBtn); box.appendChild(sleeve); host.appendChild(box);
}

function renderLegend() {
  const host = document.getElementById("legendHost");
  const hasTag = ACTIVE_MODULES.some((m) => m.tag === "key" || m.tag === "skip");
  if (!hasTag) { host.hidden = true; host.innerHTML = ""; return; }
  host.hidden = false;
  host.innerHTML = "<b>" + t("legendIntro") + "</b>: " +
    '<span class="tag tag-key">' + t("legendKey") + "</span> = " + t("legendKeyDesc") + " · " +
    '<span class="tag tag-skip">' + t("legendSkip") + "</span> = " + t("legendSkipDesc") + " · " +
    t("legendCheck") + "。";
}

function renderCTA() {
  const host = document.getElementById("ctaHost");
  if (!host) return;
  if (!CONFIG.cta) { host.innerHTML = ""; return; }
  host.innerHTML = '<div class="cta-bar"><div class="cta-intro">' + t("ctaText") + '</div><div class="cta-line"><a class="cta-path" href="' + (CONFIG.cta.href || "#") + '" target="_blank" rel="noopener noreferrer">' + t("ctaInstall") + '</a></div><div class="cta-line">' + t("ctaChat") + ' <button type="button" class="cta-copy">' + t("ctaCopyBtn") + '</button></div></div>';
  const _cb = host.querySelector(".cta-copy"); if (_cb) _cb.addEventListener("click", function () { copyText(t("ctaChatPrompt"), _cb, t("copiedFlash")); });
}

function renderProgress() {
  const { done, total } = computeProgress();
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressLabel").textContent = done + " / " + total;
  const bar = document.getElementById("progressBar");
  bar.setAttribute("aria-valuenow", String(pct));
  bar.setAttribute("aria-valuetext", t("progressValueText", { done: done, total: total, pct: pct }));
}

function announce(msg) { const r = document.getElementById("liveRegion"); if (!r) return; r.textContent = ""; requestAnimationFrame(() => { r.textContent = msg; }); }
function restoreFocusAndScroll(moduleId) {
  const card = document.querySelector('[data-module-id="' + cssEscape(moduleId) + '"]'); if (!card) return;
  const headBtn = card.querySelector(".collapse-head");
  if (headBtn && headBtn.focus) { try { headBtn.focus({ preventScroll: true }); } catch (_) { headBtn.focus(); } }
  if (card.scrollIntoView) card.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/* ---------- 4.7 Check interaction ---------- */
function onToggle(module) {
  const rec = moduleCards.get(module.id); if (!rec) { renderProgress(); return; }
  reflowItemsInModule(module);
  const nowDone = isModuleDone(module);
  const wasDone = rec.section.classList.contains("done");
  rec.section.classList.toggle("done", nowDone);
  if (nowDone !== wasDone) {
    const open = nowDone ? false : CONFIG.moduleDefaultOpen;   // OFF: fold in place. ON: fold + sink the whole module across to the done region
    saveBool(K.moduleOpen(module.id), open);
    if (sinkBottomOn()) {
      // ON (v2 behavior): collapse + move the module below the "✅ 已完成" divider into doneHost (or back), all module cards FLIP into place
      const allCards = Array.from(moduleCards.values()).map((r) => r.section);
      flip(allCards, () => {
        const isOpenNow = rec.headBtn.getAttribute("aria-expanded") === "true";
        if (open !== isOpenNow) setCollapsed(rec.sleeve, rec.body, rec.headBtn, open, true);
        placeModules();
      });
      restoreFocusAndScroll(module.id);
    } else {
      const isOpenNow = rec.headBtn.getAttribute("aria-expanded") === "true";
      if (open !== isOpenNow) setCollapsed(rec.sleeve, rec.body, rec.headBtn, open, true);
    }
    announce(nowDone ? t("announcedDone", { title: plainTitle(module) }) : t("announcedBack", { title: plainTitle(module) }));
  }
  renderProgress();
}
/* On check → items move between the "in-progress" list and the "✓ Done" collapse group (with FLIP animation): only items visible both before and after move are animated;
   items going into the collapse group just "tuck in", the remaining in-progress items slide up to fill the gap, and the count bumps. With auto-sink off → strike through in place, no movement. */
function reflowItemsInModule(module) {
  const rec = moduleCards.get(module.id); if (!rec) return;
  const { activeUl, doneUl } = rec;
  rec.section.querySelectorAll("li.item").forEach((li) => li.classList.toggle("checked", isItemChecked(module.id, li.dataset.itemId)));
  const cnt = rec.section.querySelector(".module-count");
  const doneCount = module.items.filter((it) => isItemChecked(module.id, it.id)).length;
  if (cnt) cnt.textContent = "(" + doneCount + "/" + module.items.length + ")";
  if (!autoSinkOn()) {
    if (sinkBottomOn()) {
      const rows = Array.from(rec.activeUl.querySelectorAll("li.item"));
      flip(rows, () => { for (const it of sortedItems(module)) { const li = liOf(rec, it.id); if (li) rec.activeUl.appendChild(li); } });
    } else {
      for (const it of module.items) { const li = liOf(rec, it.id); if (li) activeUl.appendChild(li); }   // in place: original order, checked struck
    }
    updateDoneGroup(module, rec, false); return;
  }
  const dgOpen = loadBool(K.doneGroupOpen(module.id), false);
  const targetOf = (it) => (isItemChecked(module.id, it.id) ? doneUl : activeUl);
  const visible = (parent) => parent === activeUl || (parent === doneUl && dgOpen);
  const flipEls = [];
  for (const it of module.items) { const li = liOf(rec, it.id); if (!li) continue; if (visible(li.parentNode) && visible(targetOf(it))) flipEls.push(li); }
  flip(flipEls, () => { for (const it of module.items) { const li = liOf(rec, it.id); if (li) targetOf(it).appendChild(li); } updateDoneGroup(module, rec, true); });
}

/* ---------- 4.8 Layout —— modules all stay in activeHost in their original order (completed steps fold in place, no longer moved to the bottom of the page) ---------- */
function placeModules() {
  const activeHost = document.getElementById("activeHost");
  const doneHost = document.getElementById("doneHost");
  const sink = sinkBottomOn();
  let doneAny = false;
  for (const m of ACTIVE_MODULES) {
    let rec = moduleCards.get(m.id);
    if (!rec) { buildModuleCard(m); rec = moduleCards.get(m.id); }
    if (sink && isModuleDone(m)) { if (doneHost) doneHost.appendChild(rec.section); else activeHost.appendChild(rec.section); doneAny = true; }
    else { activeHost.appendChild(rec.section); }
  }
  const divider = document.getElementById("doneDivider");
  if (divider) { const showDivider = sink && doneAny; divider.classList.toggle("hidden", !showDivider); divider.setAttribute("aria-hidden", String(!showDivider)); }
}
function renderModules() { const a = document.getElementById("activeHost"), d = document.getElementById("doneHost"); moduleCards.clear(); a.innerHTML = ""; if (d) d.innerHTML = ""; placeModules(); applyTourNudge(); }

/* ---------- 4.9 Feedback export ---------- */
function appTitleText() { const el = document.getElementById("app-title"); return el ? el.textContent.trim() : "Living Checklist"; }
function buildFeedbackMarkdown() {
  const { done, total } = computeProgress();
  const lines = ["# " + appTitleText() + "  (" + done + " / " + total + " " + t("feedbackDone") + ")", ""];
  for (const m of ACTIVE_MODULES) {
    let head = "## " + (m.stepNum ? m.stepNum + " · " : "") + stripHtml(m.title);
    const ti = tagInfo(m.tag); if (ti) head += " [" + ti.label + "]";
    lines.push(head);
    for (const it of m.items) {
      lines.push("- [" + (isItemChecked(m.id, it.id) ? "x" : " ") + "] " + stripHtml(it.html));
      const inote = loadStr(K.itemNote(m.id, it.id), "");
      if (inote && inote.trim()) lines.push("  > " + t("feedbackNote") + ": " + inote.trim().replace(/\\n/g, "\\n  > "));
      if (it.children) for (const c of it.children) lines.push("  - [" + (isSubChecked(m.id, it.id, c) ? "x" : " ") + "] " + stripHtml(c.html));
    }
    const note = loadStr(K.moduleNote(m.id), "");
    if (note && note.trim()) { lines.push(""); lines.push("> " + t("feedbackNote") + ": " + note.trim().replace(/\\n/g, "\\n> ")); }
    lines.push("");
  }
  return lines.join("\\n").replace(/\\n{3,}/g, "\\n\\n").trim() + "\\n";
}
function legacyCopy(text) {
  try { const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok; } catch (_) { return false; }
}
function flashButton(btn, msg) { if (!btn || btn.dataset.flashing === "1") return; const orig = btn.textContent; btn.dataset.flashing = "1"; btn.textContent = msg; setTimeout(() => { btn.textContent = orig; btn.dataset.flashing = "0"; }, 1600); }
function copyText(text, btn, okMsg) {
  const done = (ok) => { announce(ok ? okMsg : t("announcedCopyFail")); if (btn) flashButton(btn, ok ? t("copiedFlash") : t("copyFailFlash")); };
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(legacyCopy(text)); }); return; } } catch (_) {}
  done(legacyCopy(text));
}
function renderFill(module) {
  const wrap = document.createElement("div"); wrap.className = "fill-wrap";
  const head = document.createElement("div"); head.className = "fill-head";
  const lbl = document.createElement("span"); lbl.textContent = t("fillHeading");
  const allBtn = document.createElement("button"); allBtn.type = "button"; allBtn.className = "fill-copyall"; allBtn.textContent = t("fillCopyAll");
  allBtn.addEventListener("click", function () { copyText(module.fillData.map(function (r) { return r.label + ": " + r.value; }).join("\\n"), allBtn, t("fillCopiedAll")); });
  head.appendChild(lbl); head.appendChild(allBtn); wrap.appendChild(head);
  for (const row of module.fillData) {
    const r = document.createElement("div"); r.className = "fill-row";
    const l = document.createElement("span"); l.className = "fill-label"; l.textContent = row.label;
    const v = document.createElement("span"); v.className = "fill-value"; v.textContent = row.value;
    const b = document.createElement("button"); b.type = "button"; b.className = "fill-copy"; b.textContent = t("fillCopy");
    b.addEventListener("click", (function (val, btn) { return function () { copyText(val, btn, t("fillCopied")); }; })(row.value, b));
    r.appendChild(l); r.appendChild(v); r.appendChild(b); wrap.appendChild(r);
  }
  return wrap;
}
function copyFeedback() {
  const md = buildFeedbackMarkdown(); const btn = document.getElementById("btnCopyFeedback");
  const finish = (ok) => { announce(ok ? t("announcedCopied") : t("announcedCopyFail")); flashButton(btn, ok ? t("copiedFlash") : t("copyFailFlash")); };
  let handled = false;
  try { if (navigator.clipboard && navigator.clipboard.writeText) { handled = true; navigator.clipboard.writeText(md).then(() => finish(true), () => finish(legacyCopy(md))); } } catch (_) { handled = false; }
  if (!handled) finish(legacyCopy(md));
}

/* ---------- 4.10 Theme / font / language controls ---------- */
function effectiveTheme() {
  const saved = loadStr(K.theme(), CONFIG.theme);
  if (saved === "light" || saved === "dark") return saved;
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (_) { return "light"; }
}
function applyTheme() { const m = loadStr(K.theme(), CONFIG.theme); const mode = (m === "light" || m === "dark") ? m : "auto"; document.documentElement.setAttribute("data-theme", effectiveTheme()); document.documentElement.setAttribute("data-theme-mode", mode); }
function toggleTheme() { const order = ["auto", "light", "dark"]; const cur = loadStr(K.theme(), CONFIG.theme); const next = order[(order.indexOf(cur) + 1) % order.length]; saveStr(K.theme(), next); applyTheme(); refreshControlTitles(); }
function applyFont() { document.documentElement.setAttribute("data-font", loadStr(K.font(), CONFIG.font)); }
function toggleFont() { const next = (loadStr(K.font(), CONFIG.font) === "system") ? "noto" : "system"; saveStr(K.font(), next); applyFont(); buildControls(); }

function applyLangAttr() {
  document.documentElement.setAttribute("lang", CONFIG.lang);
  document.title = t("docTitle");
}
function setLang(lang) {
  if (CONFIG.languages.indexOf(lang) < 0) return;
  CONFIG.lang = lang; saveStr(K.lang(), lang);
  refreshActive(); applyLangAttr(); applyChrome(); buildControls();
  renderCTA();
  renderSummary(document.getElementById("summaryHost"));
  renderLegend(); renderModules(); renderProgress();
}

function applyChrome() {
  document.getElementById("app-title").textContent = t("appTitle");
  document.getElementById("app-subtitle").textContent = t("subtitle");
  { const ak = document.getElementById("app-aka"); if (ak) { const av = t("aka") || ""; ak.innerHTML = av; ak.style.display = av ? "" : "none"; } }
  document.getElementById("progress-caption").textContent = t("progressCaption");
  document.getElementById("btnExpandAll").textContent = t("expandAll");
  document.getElementById("btnCollapseAll").textContent = t("collapseAll");
  document.getElementById("btnReset").textContent = t("reset");
  document.getElementById("btnCopyFeedback").textContent = t("copyFeedback");
  refreshSinkBtn();
  refreshSinkBottomBtn();
  { const bt = document.getElementById("btnBarToggle"); if (bt) bt.setAttribute("aria-label", t("barToggle")); }
  document.getElementById("doneDivider").textContent = "✅ " + t("doneDivider");
  document.getElementById("summaryHost").setAttribute("aria-label", t("summaryHeading"));
}

const SUN_MOON_SVG = '<svg viewBox="0 0 256 256" aria-hidden="true"><path class="ic-sun" d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/><path class="ic-moon" d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"/></svg>';

function refreshControlTitles() {
  const tb = document.getElementById("fcTheme");
  if (tb) { const m = loadStr(K.theme(), CONFIG.theme); const mode = (m === "light" || m === "dark") ? m : "auto"; const lbl = t(mode === "auto" ? "themeTitleAuto" : (mode === "dark" ? "themeTitleDark" : "themeTitleLight")); tb.setAttribute("title", lbl); tb.setAttribute("aria-label", lbl); }
}
function buildControls() {
  const host = document.getElementById("floatControls"); host.innerHTML = "";
  const open = loadBool(K.controlsOpen(), true);
  host.setAttribute("data-open", String(open));
  // Collapse knob: once collapsed only this small button remains (avoids blocking content) · expanded it shows language/theme/font
  const handle = document.createElement("button"); handle.type = "button"; handle.className = "fc-handle"; handle.id = "fcHandle";
  handle.setAttribute("aria-expanded", String(open)); handle.setAttribute("aria-label", t("controlsToggle"));
  handle.textContent = open ? "⟩" : "⚙";
  handle.addEventListener("click", () => {
    const o = host.getAttribute("data-open") !== "true";
    saveBool(K.controlsOpen(), o); host.setAttribute("data-open", String(o));
    handle.setAttribute("aria-expanded", String(o)); handle.textContent = o ? "⟩" : "⚙";
  });
  host.appendChild(handle);
  const bodyWrap = document.createElement("div"); bodyWrap.className = "fc-body";
  // Language (only the languages this checklist provides; shown only when >1)
  if (CONFIG.languages.length > 1) {
    const langs = document.createElement("div"); langs.className = "fc-langs"; langs.setAttribute("role", "group"); langs.setAttribute("aria-label", t("langTitle"));
    CONFIG.languages.forEach((lg) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "fc-lang"; b.textContent = LANG_NAMES[lg] || lg;
      b.setAttribute("aria-pressed", String(lg === CONFIG.lang)); b.setAttribute("title", lg);
      b.addEventListener("click", () => setLang(lg)); langs.appendChild(b);
    });
    bodyWrap.appendChild(langs);
    const sep = document.createElement("div"); sep.className = "fc-sep"; bodyWrap.appendChild(sep);
  }
  // Theme
  const themeBtn = document.createElement("button"); themeBtn.type = "button"; themeBtn.className = "fc-icon"; themeBtn.id = "fcTheme"; themeBtn.innerHTML = SUN_MOON_SVG;
  themeBtn.addEventListener("click", toggleTheme); bodyWrap.appendChild(themeBtn);
  // Font
  const fontBtn = document.createElement("button"); fontBtn.type = "button"; fontBtn.className = "fc-icon fc-font"; fontBtn.id = "fcFont";
  const isSystem = loadStr(K.font(), CONFIG.font) === "system";
  fontBtn.textContent = isSystem ? t("fontSystem") : t("fontNoto");
  fontBtn.setAttribute("aria-pressed", String(!isSystem)); fontBtn.setAttribute("title", t("fontTitle")); fontBtn.setAttribute("aria-label", t("fontTitle"));
  fontBtn.addEventListener("click", toggleFont); bodyWrap.appendChild(fontBtn);
  host.appendChild(bodyWrap);
  refreshControlTitles();
}
function applyToolbarOpen() {
  const open = loadBool(K.toolbarOpen(), true);
  const tb = document.getElementById("barTools"); const btn = document.getElementById("btnBarToggle");
  if (tb) tb.hidden = !open;
  if (btn) btn.setAttribute("aria-expanded", String(open));
}
function toggleToolbar() { saveBool(K.toolbarOpen(), !loadBool(K.toolbarOpen(), true)); applyToolbarOpen(); }

/* ---------- 4.11 Toolbar ---------- */
function refreshSinkBtn() {
  const b = document.getElementById("btnSink"); if (!b) return;
  const on = autoSinkOn();
  b.textContent = t("sinkLabel") + ": " + (on ? t("toggleOn") : t("toggleOff"));
  b.setAttribute("aria-pressed", String(on));
}
function toggleSink() { saveBool(K.autoSink(), !autoSinkOn()); refreshSinkBtn(); renderModules(); renderProgress(); }
function refreshSinkBottomBtn() {
  const b = document.getElementById("btnSinkBottom"); if (!b) return;
  const on = sinkBottomOn();
  b.textContent = t("sinkBottomLabel") + ": " + (on ? t("toggleOn") : t("toggleOff"));
  b.setAttribute("aria-pressed", String(on));
}
function toggleSinkBottom() { saveBool(K.sinkBottom(), !sinkBottomOn()); refreshSinkBottomBtn(); renderModules(); renderProgress(); }
function setAllOpen(open) { saveBool(K.summaryOpen(), open); for (const m of ACTIVE_MODULES) saveBool(K.moduleOpen(m.id), open); renderSummary(document.getElementById("summaryHost")); renderModules(); renderProgress(); }
function resetChecks() {
  if (!window.confirm(t("confirmReset"))) return;
  for (const m of ACTIVE_MODULES) { for (const it of m.items) { saveBool(K.itemChecked(m.id, it.id), false); if (it.children) for (const c of it.children) saveBool(K.subChecked(m.id, it.id, c.id), false); } saveBool(K.moduleOpen(m.id), CONFIG.moduleDefaultOpen); }
  saveStr(K.tourStep(), "0");   // reset → the tour resets too, starting over from "click the box" (otherwise it would stay stuck at the step it had advanced to)
  renderSummary(document.getElementById("summaryHost")); renderModules(); renderProgress(); announce(t("announcedReset"));
}

/* ---------- 4.12 Startup ---------- */
function detectLang() {
  try {
    const cands = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ""];
    for (const raw of cands) {
      const l = String(raw).toLowerCase();
      let norm = null;
      if (l.indexOf("zh") === 0) norm = (l.indexOf("tw") >= 0 || l.indexOf("hk") >= 0 || l.indexOf("hant") >= 0 || l.indexOf("mo") >= 0) ? "zh-Hant" : "zh-Hans";
      else if (l.indexOf("ja") === 0) norm = "ja";
      else if (l.indexOf("fr") === 0) norm = "fr";
      else if (l.indexOf("en") === 0) norm = "en";
      if (norm && CONFIG.languages.indexOf(norm) >= 0) return norm;
    }
  } catch (_) {}
  return null;
}

function boot() {
  // Restore language: URL ?lang= > previously chosen > browser language auto-detect > CONFIG default
  let urlLang = null;
  try { urlLang = new URLSearchParams(location.search).get("lang"); } catch (_) {}
  const savedLang = loadStr(K.lang(), null);
  if (urlLang && CONFIG.languages.indexOf(urlLang) >= 0) { CONFIG.lang = urlLang; saveStr(K.lang(), urlLang); }
  else if (savedLang && CONFIG.languages.indexOf(savedLang) >= 0) CONFIG.lang = savedLang;
  else { const auto = detectLang(); if (auto) CONFIG.lang = auto; }
  applyTheme(); applyFont();
  refreshActive(); applyLangAttr(); applyChrome();
  document.getElementById("btnExpandAll").addEventListener("click", () => setAllOpen(true));
  document.getElementById("btnCollapseAll").addEventListener("click", () => setAllOpen(false));
  document.getElementById("btnReset").addEventListener("click", resetChecks);
  document.getElementById("btnCopyFeedback").addEventListener("click", copyFeedback);
  document.getElementById("btnSink").addEventListener("click", toggleSink);
  document.getElementById("btnSinkBottom").addEventListener("click", toggleSinkBottom);
  document.getElementById("btnBarToggle").addEventListener("click", toggleToolbar);
  applyToolbarOpen();
  buildControls();
  renderCTA();
  renderSummary(document.getElementById("summaryHost"));
  renderLegend(); renderModules(); renderProgress();
  // On system theme change (only follow it if the user hasn't manually specified a theme)
  try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { const s = loadStr(K.theme(), CONFIG.theme); if (s !== "light" && s !== "dark") { applyTheme(); refreshControlTitles(); } }); } catch (_) {}
}
document.addEventListener("DOMContentLoaded", boot);
</script>
</body>
</html>
`;
