### What is this?

Next Generation SSR tool.

### Status

:white_check_mark: Design.<br/>
:white_check_mark: Working basic prototype.<br/>
:construction: Feature completeness, docs, polish details.

### Features:

- **Small but Sturdy:** `vite-plugin-ssr` is only a couple of kLOCs. Not only does a small source code lead to a more robust tool, but also to a tool that can rapidly adapt to a fast evolving Vite & JavaScript ecosystem.
- **Minimal Config:** Both getting started and advanced usage is easy and quick.
- **Flexible:** being a Vite plugin, `vite-plugin-ssr` can be easily integrated into all kinds of Vite apps. It works with any view library (Vue, React, etc.), any view tool (Vuex, React Router, etc.), and any server framework (Express, Koa, Hapi, Fastify, etc.).
- **Minimal but Powerful Interface:** `vite-plugin-ssr`'s interface has been desgined with meticulous care. It's simple: you can read the entire documentation (this page) in 10 minutes. It's powerful: it aims to allow you to achieve whatever you want; if `vite-plugin-ssr` is limiting you in any way, then open a GitHub issue.
- **Scalable:** Thanks to Vite's radical new approach of lazy transpiling & loading everything, Vite apps can scale to thousands of modules with no hit on dev speed.
- **Fast Production Cold Start:** `vite-plugin-ssr` lazy loads your pages; adding pages doesn't increase your cold start.
- **Zero browser-side JavaScript:** If you create an empty `*.page.browser.*` file, then your page will have zero browser-side JavaScript!
- **Render Freedom:** You can render your pages wherever you want (browser-side, server-side, or both), whenever you want (at build-time like an SSG or at request-time), and however you want (you get to define how views are hydrated and rendered to HTML).
- **Pre-render / SSG / Static Websites:** Deploy your app to a static host by pre-rendering all your pages.

**Want more?** Search [GitHub issues](https://github.com/telefunc/telefunc/issues/) if someone has already requested what you want and upvote it, or open a new issue if not. Roadmap is prioritized based on user feedback.
