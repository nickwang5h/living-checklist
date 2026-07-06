---
name: living-checklist-web-dev
description: Develop and maintain the Living Checklist web generator in the repository's web/ directory. Use when editing web app code, API generation flow, provider support, i18n, template injection, UI behavior, or developer documentation for the Next.js BYOK checklist generator.
---

# Living Checklist Web Dev

Use this skill for development work inside `web/`.

## Required First Step

Before changing code, read `web/ARCH.md` and the files directly involved in the requested change. Treat `ARCH.md` as the source of truth for current architecture, data flow, validation commands, and dev constraints.

For this branch, keep changes scoped to the web folder unless the user explicitly asks otherwise. Do not edit files outside [web/](web/).

Also read `web/AGENTS.md`. If changing Next.js APIs, routing, build config, or framework behavior, consult the matching docs under `web/node_modules/next/dist/docs/` before editing.

When the work touches the generator flow, provider handling, template injection, or local settings, update `web/ARCH.md` in the same task so future contributors can follow the same path without re-discovering the constraints.

## Workflow

1. Identify which layer changes: UI (`page.tsx`/components), local settings store, API route, template source, generated template, or docs.
2. Keep the generator stateless: API keys and preferences stay client-local unless the user explicitly asks for a backend design.
3. Preserve the single-file HTML output contract. Generated checklists must remain usable outside the web app.
4. If editing `src/lib/base.html`, regenerate `src/lib/template.ts` with `node scripts/convert.js`; do not hand-edit generated template output as the source of truth.
5. If provider, language, template injection, storage fields, or verification steps change, update `web/ARCH.md` in the same task.
6. Run the relevant validation from `web/ARCH.md`, usually `npm run lint` and `npm run build` from `web/`. Report any validation that could not be run.

## Development Notes

- Provider differences belong in `src/app/api/generate/route.ts`; the rest of the app should consume one internal checklist JSON shape.
- Language support has two layers: Web UI language (`zh | en | ja | fr`) and template locale (`zh-Hans | en | ja | fr`). Keep mappings explicit.
- The template injection regexes depend on the exact shape of `src/lib/base.html`. When changing that shape, update injection code and verify final generated HTML.
- `web/src/lib/SKILL.md` documents the checklist engine itself. Do not treat it as Web App architecture guidance.
- Prefer existing shadcn/ui components, Tailwind tokens, Zustand patterns, and lucide icons already present in this app.
