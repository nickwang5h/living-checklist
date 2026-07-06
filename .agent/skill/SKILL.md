---
name: living-checklist
summary: Maintain the Living Checklist repository, especially the web generator and its development docs.
---

# Living Checklist Agent Skill

## First step for web work

Before changing code in the web app, read [web/ARCH.md](../../web/ARCH.md) and [web/AGENTS.md](../../web/AGENTS.md).

## Development rules

- If the change touches the generation flow, provider logic, template injection, local settings, or UI behavior, update [web/ARCH.md](../../web/ARCH.md) in the same task.
- If you edit [web/src/lib/base.html](../../web/src/lib/base.html), regenerate [web/src/lib/template.ts](../../web/src/lib/template.ts) with `node scripts/convert.js`.
- Prefer keeping the generated checklist as a single offline HTML file.
- Validate with `npm run lint` and `npm run build` from the web directory when applicable.
