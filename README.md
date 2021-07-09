<p></p>

<a href="/../../#readme">
  <img src="/docs/logo.svg" align="left" height="154"  width="154" alt="vite-plugin-ssr"/>
</a>

# `vite-plugin-ssr`

Vite SSR plugin. Simple, full-fledged, do-one-thing-do-it-well.

<a href="https://discord.gg/qTq92FQzKb">
  <img src="/docs/discord.svg" height="32" width="117.078" alt="Discord vite-plugin-ssr"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://twitter.com/brillout/status/1371806177424777216">
  <img src="/docs/twitter_retweet.svg" height="32" width="179" alt="Retweet vite-plugin-ssr"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="https://twitter.com/brillout">
  <img src="/docs/twitter_follow.svg" height="32" width="133" alt="Follow @brillout"/>
</a>
&nbsp;&nbsp;&nbsp;
<a href="/CHANGELOG.md">
  <img src="/docs/changelog.svg" height="32" width="116" alt="Changelog"/>
</a>

<br/>

<br/> **Overview**
<br/> &nbsp;&nbsp; [Introduction](#introduction)
<br/> &nbsp;&nbsp; [Vue Tour](#vue-tour)
<br/> &nbsp;&nbsp; [React Tour](#react-tour)
<br/>
<br/> **Get Started**
<br/> &nbsp;&nbsp; [Boilerplates](#boilerplates)
<br/> &nbsp;&nbsp; [Manual Installation](#manual-installation)
<br/>
<br/> **Guides**
<br/><sub>&nbsp;&nbsp;&nbsp; Basics</sub>
<br/> &nbsp;&nbsp; [Data Fetching](#data-fetching)
<br/> &nbsp;&nbsp; [Routing](#routing)
<br/> &nbsp;&nbsp; [Pre-rendering](#pre-rendering) (SSG)
<br/><sub>&nbsp;&nbsp;&nbsp; More</sub>
<br/> &nbsp;&nbsp; [SPA vs SSR vs HTML](#spa-vs-ssr-vs-html)
<br/> &nbsp;&nbsp; [HTML `<head>`](#html-head)
<br/> &nbsp;&nbsp; [Page Redirection](#page-redirection)
<br/> &nbsp;&nbsp; [Base URL](#base-url)
<br/> &nbsp;&nbsp; [Import Paths Alias Mapping](#import-paths-alias-mapping)
<br/> &nbsp;&nbsp; [`.env` Files](#env-files)
<br/><sub>&nbsp;&nbsp;&nbsp; Integrations</sub>
<br/> &nbsp;&nbsp; [Authentication](#authentication) (Auth0, Passport.js, Grant, ...)
<br/> &nbsp;&nbsp; [Markdown](#markdown)
<br/> &nbsp;&nbsp; [Store](#store) (Vuex, Redux, ...)
<br/> &nbsp;&nbsp; [GraphQL & RPC](#graphql--rpc) (Apollo, Relay, Wildcard API, ...)
<br/> &nbsp;&nbsp; [Tailwind CSS](#tailwind-css)
<br/> &nbsp;&nbsp; [Other Tools](#other-tools) (CSS Frameworks, Google Analytics, jQuery, Service Workers, Sentry, ...)
<br/><sub>&nbsp;&nbsp;&nbsp; Deploy</sub>
<br/> &nbsp;&nbsp; [Static Hosts](#static-hosts) (Netlify, GitHub Pages, Cloudflare Pages, ...)
<br/> &nbsp;&nbsp; [Cloudflare Workers](#cloudflare-workers)
<br/> &nbsp;&nbsp; [AWS Lambda](#aws-lambda)
<br/> &nbsp;&nbsp; [Firebase](#firebase)
<br/>
<br/> **API**
<br/><sub>&nbsp;&nbsp;&nbsp; Node.js & Browser</sub>
<br/> &nbsp;&nbsp; [`*.page.js`](#pagejs)
<br/> &nbsp;&nbsp; [`pageContext`](#pagecontext)
<br/><sub>&nbsp;&nbsp;&nbsp; Node.js</sub>
<br/> &nbsp;&nbsp; [`*.page.server.js`](#pageserverjs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { addPageContext }`](#export--addpagecontext-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { passToClient }`](#export--passtoclient-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { render }`](#export--render-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { prerender }`](#export--prerender-)
<br/> &nbsp;&nbsp; [`import { html } from 'vite-plugin-ssr'`](#import--html--from-vite-plugin-ssr)
<br/><sub>&nbsp;&nbsp;&nbsp; Browser</sub>
<br/> &nbsp;&nbsp; [`*.page.client.js`](#pageclientjs)
<br/> &nbsp;&nbsp; [`import { getPage } from 'vite-plugin-ssr/client'`](#import--getpage--from-vite-plugin-ssrclient)
<br/> &nbsp;&nbsp; [`import { useClientRouter } from 'vite-plugin-ssr/client/router'`](#import--useClientRouter--from-vite-plugin-ssrclientrouter)
<br/> &nbsp;&nbsp; [`import { navigate } from 'vite-plugin-ssr/client/router'`](#import--navigate--from-vite-plugin-ssrclientrouter)
<br/><sub>&nbsp;&nbsp;&nbsp; Routing</sub>
<br/> &nbsp;&nbsp; [`*.page.route.js`](#pageroutejs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route String](#route-string)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route Function](#route-function)
<br/> &nbsp;&nbsp; [Filesystem Routing](#filesystem-routing)
<br/><sub>&nbsp;&nbsp;&nbsp; Special Pages</sub>
<br/> &nbsp;&nbsp; [`_default.page.*`](#_defaultpage)
<br/> &nbsp;&nbsp; [`_error.page.*`](#_errorpage)
<br/><sub>&nbsp;&nbsp;&nbsp; Integration</sub>
<br/> &nbsp;&nbsp; [`import { createPageRender } from 'vite-plugin-ssr'`](#import--createpagerender--from-vite-plugin-ssr) (Server Integration Point)
<br/> &nbsp;&nbsp; [`import ssr from 'vite-plugin-ssr/plugin'`](#import-ssr-from-vite-plugin-ssrplugin) (Vite Plugin)
<br/><sub>&nbsp;&nbsp;&nbsp; CLI</sub>
<br/> &nbsp;&nbsp; [Command `prerender`](#command-prerender)

<br/>


## Overview

### Introduction

`vite-plugin-ssr` provides a similar experience than Nuxt/Next.js, but with Vite's wonderful DX, and as a do-one-thing-do-it-well tool.

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


## API

### `*.page.route.js`

Environment: `Node.js` (and `Browser` if you call `useClientRouter()`)
<br/>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.route.*([a-zA-Z0-9])`

The `*.page.route.js` files enable further control over routing with:
 - Route Strings
 - Route Functions

<br/>

#### Route String

For a page `/pages/film.page.js`, a Route String can be defined in a `/pages/film.page.route.js` adjacent file.

```js
// /pages/film.page.route.js

// Match URLs `/film/1`, `/film/2`, ...
export default '/film/:filmId'
```

If the URL matches, the value of `filmId` is available at `pageContext.routeParams.filmId`.

The syntax of Route Strings is based on [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
(the most widespread route syntax in JavaScript).
For user friendlier docs, check out the [Express.js Routing Docs](https://expressjs.com/en/guide/routing.html#route-parameters)
(Express.js uses `path-to-regexp`).

<br/>

#### Route Function

Route Functions give you full programmatic flexibility to define your routing logic.

```js
// /pages/film/admin.page.route.js

export default (pageContext) => {
  // Route Functions allow us to implement advanced routing such as route guards.
  if (! pageContext.user.isAdmin) {
    return false
  }
  const { url } = pageContext
  // We can use RegExp and any JavaScript tool we want.
  if (! /\/film\/[0-9]+\/admin/.test(url)) {
    return { match: false } // equivalent to `return false`
  }
  filmId = url.split('/')[2]
  return {
    match: true,
    // We make `filmId` available at `pageContext.routeParams.filmId`
    routeParams: { filmId }
  }
}
```

The `match` value can be a (negative) number which enables you to resolve route conflicts;
the higher the number, the higher the priority.

<br/><br/>


### Filesystem Routing

By default `vite-plugin-ssr` does Filesystem Routing: the URL of the page is determined base on where its `.page.js` file is located.

```
FILESYSTEM                        URL              COMMENT
pages/about.page.js               /about
pages/index/index.page.js         /                (`index` is mapped to the empty string)
pages/HELLO.page.js               /hello           (Mapping is done lower case)
```

In the above example, the common ancestor directory, which `vite-plugin-ssr` considers the routing root, is `pages/`.
It doesn't have to be `pages/` and you can save your `.page.js` files wherever you want. For example:

```
FILESYSTEM                        URL
user/list.page.js                 /user/list
user/create.page.js               /user/create
todo/list.page.js                 /todo/list
todo/create.page.js               /todo/create
```

You can also move your page files in a `src/` directory.

```
FILESYSTEM                        URL
src/pages/index.page.js           /
src/pages/about.page.js           /about
```

The common ancestor directory here is `src/pages/`.

For more control over routing, define Route Strings or Route Functions in [`*.page.route.js`](#pageroutejs).

<br/><br/>


### `_default.page.*`

The `_default.page.server.js` and `_default.page.client.js` files are like regular `.page.server.js` and `.page.client.js` files, but they are special in the sense that they don't apply to a single page file; instead, they apply as a default to all pages.

There can be several `_default`:

```
marketing/_default.page.server.js
marketing/_default.page.client.js
marketing/index.page.js
marketing/about.page.js
marketing/jobs.page.js
admin-panel/_default.page.server.js
admin-panel/_default.page.client.js
admin-panel/index.page.js
```

The `marketing/_default.page.*` files apply to the `marketing/*.page.js` files, while
the `admin-panel/_default.page.*` files apply to the `admin-panel/*.page.js` files.

The `_default.page.server.js` and `_default.page.client.js` files are not adjacent to any `.page.js` file:
defining `_default.page.js` or `_default.page.route.js` is forbidden.

<br/><br/>


### `_error.page.*`

The page `_error.page.js` is used for when an error occurs:
 - When no page matches the URL (acting as a `404` page).
 - When one of your `.page.*` files throws an error (acting as a `500` page).

`vite-plugin-ssr` automatically sets `pageContext.pageProps.is404: boolean` allowing you to decided whether to show a `404` or `500` page.
(Normally `pageContext.pageProps` is completely defined/controlled by you and `vite-plugin-ssr`'s source code doesn't know anything about `pageContext.pageProps` but this is the only exception.)

You can define `_error.page.js` like any other page and create `_error.page.client.js` and `_error.page.server.js`.

<br/><br/>


### `import { createPageRender } from 'vite-plugin-ssr'`

Environment: `Node.js`

`createPageRender()` is the integration point between your server and `vite-plugin-ssr`.

```js
// server/index.js

// In this example we use Express.js but we could use any other server framework.
const express = require('express')
const { createPageRender } = require('vite-plugin-ssr')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`
const base = '/'

startServer()

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, { index: false }))
  } else {
    const vite = require('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRender({ viteDevServer, isProduction, root, base })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContext = { url }
    const result = await renderPage(pageContext)
    if (result.nothingRendered) return next()
    res.status(result.statusCode).send(result.renderResult)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
```

- `viteDevServer` is the Vite dev server.
- `isProduction` is a boolean. When set to `true`, `vite-plugin-ssr` loads already-transpiled code from `dist/` instead of on-the-fly transpiling code.
- `root` is the absolute path of your app's root directory. The `root` directory is usally the directory where `vite.config.js` lives. Make sure that all your `.page.js` files are descendent of the `root` directory.
- `base` is the [Base URL](#base-url).
- `result.nothingRendered` is `true` when a) an error occurred while rendering `_error.page.js`, or b) you didn't define an `_error.page.js` and no `.page.js` matches the `url`.
- `result.statusCode` is either `200`, `404`, or `500`.
- `result.renderResult` is the value returned by the `render()` hook.

Since `createPageRender()` and `renderPage()` are agnostic to Express.js, you can use `vite-plugin-ssr` with any server framework (Koa, Hapi, Fastify, vanilla Node.js, ...) and any deploy environment such as Cloudflare Workers.

Examples:
 - [JavaScript](boilerplates/boilerplate-vue/server/index.js)
 - [TypeScript](boilerplates/boilerplate-vue-ts/server/index.ts)

<br/><br/>


### `import ssr from 'vite-plugin-ssr/plugin'`

Environment: `Node.js`

The plugin has no options.

```js
// vite.config.js

const ssr = require('vite-plugin-ssr/plugin')

module.exports = {
  // Make sure to include `ssr()` and not `ssr`.
  plugins: [ssr()]
}
```

<br/><br/>


### Command `prerender`

The command `prerender` does pre-rendering, see [Pre-rendering](#pre-rendering).

It can be called:
 - As CLI command: `$ npx vite-plugin-ssr prerender` / `$ yarn vite-plugin-ssr prerender`.
 - As JavaScript API: `import { prerender } from 'vite-plugin-ssr/cli`.

Options:
 - `partial`: Allow only a subset of pages to be pre-rendered. (Pages with a parameterized route cannot be pre-rendered without `prerender()` hook; the `--partial` option suppresses the warning telling you about pages not being pre-rendered.)
 - `no-extra-dir`/`noExtraDir`: Do not create a new directory for each page, e.g. generate `dist/client/about.html` instead of `dist/client/about/index.html`.
 - `root`: The root directory of your project (where `vite.config.js` and `dist/` live). Default: `process.cwd()`.

Options are passed like this:
 - CLI: `$ vite-plugin-ssr prerender --partial --no-extra-dir --root path/to/root`
 - API: `prerender({ partial: true, noExtraDir: true, root: 'path/to/root' })`

<br/><br/>


