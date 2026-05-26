# AGENTS.md — for AI agents working with Vike

https://vike.dev is the source of truth for how Vike behaves. Consult it — and the AI-oriented index at https://vike.dev/llms.txt — rather than inferring behavior from `node_modules/vike/dist/`.

`dist/` is compiled internals. Values you find there (for example a config or hook's `env`) are **defaults you can override**, not framework limits — don't conclude "Vike can't do X" from them.

When a task involves a Vike config, hook, or setting, fetch the relevant docs page and follow it.
