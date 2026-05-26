# AGENTS.md — guidance for AI coding agents using Vike

You're likely reading this while working in a project that depends on `vike`. Before inferring how Vike behaves from the code in this package, read this.

## The code in `dist/` is compiled internals, not the API contract

Files under `node_modules/vike/dist/` are Vike's compiled internals. Config and hook values you find there — especially a hook's **environment** (e.g. `env: { server: true }`) — are **overridable defaults, not framework limits**. Do not conclude "Vike can't do X" from a default value in `dist/`.

Concrete example (a real mistake agents make): `metaBuiltIn` declares `data: { env: { server: true } }`. That does **not** mean the `+data` hook is server-only. It's the *default*; `+data` can also (or only) run on the client via `.client.js` / `.shared.js` file suffixes, or by overriding `meta.env`. See https://vike.dev/data and https://vike.dev/meta.

## Treat https://vike.dev as the source of truth

For actual, current behavior, consult the docs rather than reverse-engineering `dist/`:

- Docs site: https://vike.dev
- AI-oriented index of the docs: https://vike.dev/llms.txt
- Docs source: https://github.com/vikejs/vike/tree/main/docs

When a task involves a Vike config, hook, or setting, fetch the relevant page and follow it.
