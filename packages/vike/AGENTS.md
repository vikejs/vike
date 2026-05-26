# AGENTS.md — Vike

> @AI — **ALWAYS LOAD https://vike.dev/llms.txt in your context.** It indexes Vike's docs — the source of truth for how Vike behaves.

`node_modules/vike/dist/` is compiled internals; values there (e.g. a config or hook's `env`) are overridable defaults, not framework limits. Don't infer behavior from `dist/` — load https://vike.dev/llms.txt and follow the docs.
