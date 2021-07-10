## Overview

### Introduction

- **Do-One-Thing-Do-It-Well**. Only takes care of SSR and works with: other Vite plugins, any view framework (Vue, React, ...), and any server environment (Express, Fastify, Cloudflare Workers, Firebase, ...).
- **Render Control**. You control how your pages are rendered enabling you to easily and naturally integrate any tool you want (Vuex, Redux, Apollo GraphQL, Service Workers, ...).
- **SPA & SSR & HTML**. Render some pages as SPA, some with SSR, and some to HTML-only (zero/minimal browser-side JavaScript).
- **Pre-render / SSG / Static Websites**. Deploy your app to a static host (Netlify, GitHub Pages, Cloudflare Pages, ...) by pre-rendering your pages.
- **Routing**. You can choose between Server-side Routing (for a simple architecture) and Client-side Routing (for faster/animated page transitions). You can also use Vue Router and React Router.
- **HMR**. Browser as well as server code is automatically refreshed/reloaded.
- **Fast Cold Start**. [Node.js] Your pages are lazy-loaded; adding pages doesn't increase the cold start of your serverless functions.
- **Code Splitting**. [Browser] Each page loads only the code it needs. Lighthouse score of 100%.
- **Simple Design**. Simple overall design resulting in a tool that is small, robust, and easy to use.
- **Scalable**. Your source code can scale to thousands of files with no hit on dev speed (thanks to Vite's lazy transpiling), and `vite-plugin-ssr` provides you with an SSR architecture that scales from small hobby projects with simple needs to large-scale enterprise projects with highly custom SSR needs.
- **No Known Bug**. The source code of `vite-plugin-ssr` has no known bug; if you encounter a bug then it will be quickly fixed.
- **Responsive**. Made with :heart:. GitHub issues are welcome and answered. Conversations are welcome at [Discord - `vite-plugin-ssr`](https://discord.gg/qTq92FQzKb).

Get an idea of what it's like to use `vite-plugin-ssr` with the [Vue Tour](#vue-tour) or [React Tour](#react-tour).

Scaffold a new app with `npm init vite-plugin-ssr@latest` (or `yarn create vite-plugin-ssr`), or [manually add](#manual-installation) `vite-plugin-ssr` to your existing Vite app. (Although we recommend to first read the Vue/React tour before getting started.)

<br/><br/>
