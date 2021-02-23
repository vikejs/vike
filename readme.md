<a href="/../../#readme">
  <img src="/logo.svg" align="right" height="70" alt="Vite Plugin SSR"/>
</a>

# `vite-plugin-ssr`

Your small but mighty SSR companion.

[Intro & Demo](#intro--demo)
<br/> [Features](#features)
<br/> Get Started
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Boilerplates](#boilerplates)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Manual Installation](#manual-installation)
<br/> Guides
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Routing](#routing)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Data Fetching](#data-fetching)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Pre-rendering](#pre-rendering)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Markdown](#markdown)
<br/> API
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Filesystem Routing](#filesystem-routing)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.js`](#pagejs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.client.js`](#pageclientjs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.server.js`](#pageserverjs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.route.js`](#pageroutejs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_default.page.*`](#_defaultpage)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_404.page.js`](#_404pagejs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { getPage } from 'vite-plugin-ssr/client'`](#import--getpage--from-vite-plugin-ssrclient)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { createRender } from 'vite-plugin-ssr'`](#import--createrender--from-vite-plugin-ssr)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { html } from 'vite-plugin-ssr'`](#import--html--from-vite-plugin-ssr)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import vitePlugin from 'vite-plugin-ssr'`](#import-viteplugin-from-vite-plugin-ssr)

<br/>


## Intro & Demo

`vite-plugin-ssr` is a Vite plugin that gives you a similar experience than Next.js/Nuxt but as do-one-thing-do-it-well tool.
Where Next.js and Nuxt are too framework-like, `vite-plugin-ssr` doesn't interfere with your stack.
And it comes with all the wonderful Vite DX.

<details>
<summary>
Vue Demo
</summary>
<br/>

Pages are defined by creating `*.page.vue` files:

```vue
<!-- /pages/index.page.vue -->

<template>
  This page is rendered to HTML and interactive:
  <button @click="state.count++">Counter {{ state.count }}</button>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const state = reactive({ count: 0 })
    return { state }
  }
}
</script>
```

By default, `vite-plugin-ssr` does filesystem routing:
```
FILESYSTEM                  URL
pages/index.page.vue        /
pages/about.page.vue        /about
```

Route can also be defined with route strings and route functions; route strings enable simple parameterized routing while route functions enable full programmatic flexibility.

Unlike Next.js/Nuxt, *you* define how your pages are rendered:

```js
// /pages/_default.page.server.js

import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'

export { render }

async function render({ Page, pageProps, contextProps }) {
  const app = createSSRApp({
    render: () => h(Page, pageProps)
  })
  const appHtml = await renderToString(app)

  const title = contextProps.title || 'Demo: vite-plugin-ssr'

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
```
```js
// /pages/_default.page.client.js

import { createSSRApp, h } from 'vue'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  // (In production, the page is `<link rel="preload">`'d.)
  const { Page, pageProps } = await getPage()
  const app = createSSRApp({
    render: () => h(Page, pageProps)
  })
  app.mount('#app')
}
```

Because you control rendering,
you can easily integrate view tools such as Vue Router or Vuex and use any Vue version you want.

The `_default.*` files can be overriden:

```js
// /pages/about.page.client.js

// This file is purposely empty which means that the `/about` page has
// zero browser-side JavaScript!
```
```vue
<!-- /pages/index.page.vue -->

<template>
  This page is only rendered to HTML!
</template>
```

You could even render some of your pages with an entire different view framework such as React!

</details>

<details>
<summary>
React Demo
</summary>
<br/>

Pages are defined by creating `*.page.jsx` files:

```jsx
// /pages/index.page.jsx

import React from "react";

export { Page };

function Page() {
  return <>
    This page is rendered to HTML and interactive: <Counter />
  </>;
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  );
}
```

By default, `vite-plugin-ssr` does filesystem routing:
```
FILESYSTEM                  URL
pages/index.page.jsx        /
pages/about.page.jsx        /about
```

Route can also be defined with route strings and route functions; route strings enable simple parameterized routing while route functions enable full programmatic flexibility.

Unlike Next.js/Nuxt, *you* define how your pages are rendered:

```jsx
// /pages/_default.page.server.jsx

import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";

export { render };

function render({ Page, pageProps, contextProps }) {
  const pageHtml = ReactDOMServer.renderToString(
    <Page {...pageProps} />
  );

  const title = contextProps.title || "Demo: vite-plugin-ssr";

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}
```
```jsx
// /pages/_default.page.client.jsx

import ReactDOM from "react-dom"
import React from "react"
import { getPage } from "vite-plugin-ssr/client"

hydrate();

async function hydrate() {
  // (In production, the page is `<link rel="preload">`'d.)
  const { Page, pageProps } = await getPage();

  ReactDOM.hydrate(
    <Page {...pageProps} />,
    document.getElementById("page-view")
  );
}
```

Because you control rendering,
you can easily integrate view tools such as React Router or Redux, and even use Preact or Inferno.

The `_default.*` files can be overriden:

```js
// /pages/about.page.client.js

// This file is purposely empty which means that the `/about` page has
// zero browser-side JavaScript!
```
```js
// /pages/about.page.jsx

export { Page };

function Page() {
  return <>
    This page is only rendered to HTML!
  <>;
}
```

You could even render some of your pages with an entire different view framework such as Vue!

</details>

<br/><br/>


## Features

- **Do-one-thing-do-it-well**: `vite-plugin-ssr` only takes care of SSR. The rest of the stack is up to you: `vite-plugin-ssr` works with any view framework (Vue, React, etc.), any view library (Vuex, React Router, etc.), and any server framework (Express, Koa, Hapi, Fastify, etc.).
- **Simple but Powerful:** `vite-plugin-ssr` has been carefully designed to be simple, while allowing you to have full control not only over your tech stack, but also over how & when your pages are rendered.
- **Pre-render / SSG / Static Websites:** Deploy your app to a static host by pre-rendering all your pages.
- **Scalable:** Thanks to Vite's radical new approach of lazy transpiling & loading everything, Vite apps can scale to thousands of modules with no hit on dev speed.
- **Fast Production Cold Start:** `vite-plugin-ssr` lazy loads your pages; adding pages doesn't increase cold start.
- **Small but Sturdy:** `vite-plugin-ssr`'s source code is an order of magnitude smaller than SSR frameworks. A smaller source code leads to not only a more robust tool, but also a tool that can quickly adapt to a fast evolving Vite & JavaScript ecosystem.

**Want something?** Search [GitHub issues](https://github.com/brillout/vite-plugin-ssr/issues/) if someone has already requested what you want and upvote it, or open a new issue if not. Roadmap is prioritized based on user feedback.

<br/><br/>


## Boilerplates

If you start from scratch, then simply use the `vite-plugin-ssr` boilerplates.

With NPM:

```
npm init vite-plugin-ssr
```

With Yarn:

```
yarn create vite-plugin-ssr
```

Follow the prompts to choose between `vue`, `vue-ts`, `react`, or `react-ts`.

<br/><br/>


## Manual Installation

If you already have an existing Vite app and don't want to start from scratch:

1. Add `vite-plugin-ssr` to your `vite.config.js`.
   - [React](/create-vite-plugin-ssr/template-react/vite.config.js)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/vite.config.ts)

2. Integrate Vite and `vite-plugin-ssr` with your server (Express.js, Koa, Hapi, Fastify, etc.).
   - [React](/create-vite-plugin-ssr/template-react/server/index.js)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/server/index.ts)

3. Define your `_default.page.client.js` and `_default.page.server.js`.
   - [React](/create-vite-plugin-ssr/template-react/pages/_default/)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/pages/_default/)

4. Create your first page `index.page.js`.
   - [React](/create-vite-plugin-ssr/template-react/pages/index/index.page.jsx)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/pages/index/index.page.tsx)

5. Create the `dev` and `build` scripts.
   - [React](/create-vite-plugin-ssr/template-react/package.json)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/package.json)

<br/><br/>


## Routing

By default `vite-plugin-ssr` does Filesystem Routing.

```
FILESYSTEM                  URL
pages/index.page.js         /
pages/about.page.js         /about
pages/faq/index.page.js     /faq
```

For more control, you can define route strings in `.page.route.js` files.

```
// /pages/product.page.route.js

export default '/product/:productId'
```

The `productId` value is available at `contextProps.productId` so that you can fetch data in `async addContextProps({contextProps})` which is explained at [Data Fetching](#data-fetching).

For full programmatic flexibility, you can define route functions.

```js
// pages/admin.page.route.js

// Route functions allow us to implement advanced routing such as route guards.
export default async ({url, contextProps}) => {
  if (url==='/admin' && contextProps.user.isAdmin) {
    return { match: true }
  }
}
```

For detailed informations about Filesystem Routing, route strings, and route functions:
 - [API - Filesystem Routing](#filesystem-routing)
 - [API - `*.page.route.js`](#pageroutejs)

<br/><br/>


## Data Fetching

Data fetching is done with two functions: `async addContextProps()` and `setPageProps()`: the `async addContextProps()` function fetches data while `setPageProps()` specifies what data should be serialized and passed to the browser.

The `async addContextProps()` function is always called in Node.js so that ORM/SQL database queries can be used.

Both lifecycle methods are defined in `.page.server.js`.

```js
// pages/movies.page.server.js
// Environement: Node.js

import fetch from "node-fetch";

export { addContextProps }
export { setPageProps }

async function addContextProps({ contextProps }) {
  const response = await fetch("https://api.imdb.com/api/movies/")
  const { movies } = await response.json()
  return { movies }
}

function setPageProps({ contextProps: { movies } }) {
  // We remove data we don't need: `vite-plugin-ssr` serializes and passes `pageProps`
  // to the client and we want to minimize what it sent over the network.
  movies = movies.map(({ title, release_date }) => ({title, release_date}))

  const pageProps = { movies }
  return pageProps
}
```

The `pageProps` are passed to the server-side `render()` function (which renders the `Page` to HTML), and to the client-side `getPage()` function (which is used ot hydrate the `Page` to the DOM).

```js
// pages/movies.page.js
// Environement: Browser, Node.js

export { Page }

function Page(pageProps) {
  const { movies } = pageProps
  /* Some JSX iterating over `movies`
     ...
  */
}
```
```jsx
// /page/_default.page.server.js
// Environement: Node.js

import { renderJSX } from 'some-jsx-library'
import { html } from 'vite-plugin-ssr'

export { render }

async funcion render({ Page, pageProps }) {
  // `Page` is the function we defined in `movies.page.js`.
  const pageHtml = await renderJSX(<Page {...pageProps} />)
  return html`<html>
    <div id='jsx-root'>
      ${html.dangerouslySetHtml(pageHtml)}
    </div>
  </html>;
}
```
```jsx
// /page/_default.page.client.js
// Environement: Browser

import { hydrateJSX } from 'some-jsx-library'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async funcion hydrate() {
  // `Page` is the function we defined in `movies.page.js`.
  // `vite-plugin-ssr` serializes and passes `pageProps` to the browser
  const { Page, pageProps } = await getPage()
  await hydrate(<Page {...pageProps} />, document.getElementById('jsx-root')
}
```

<br/><br/>


## Pre-rendering

Pre-rendering is work-in-progress, ETA: 4-5 days.

<br/><br/>


## Markdown

Since `vite-plugin-ssr` is just a Vite plugin, you can use it with any Vite markdown plugin.

For example with `@brillout/vite-plugin-mdx`.
 - [/examples/react/pages/markdown.page.md](/examples/react/pages/markdown.page.md)
 - [/examples/react/vite.config.ts](/examples/react/vite.config.ts)

<br/><br/>


## Filesystem Routing

By default a page is mapped to a URL based on where its `.page.js` file is located.

```
FILESYSTEM                        URL              COMMENT
pages/about.page.js               /about
pages/index/index.page.js         /                (`index` is mapped to the empty string)
pages/HELLO.page.js               /hello           (Mapping is done lower case)
```

The `pages/` directory is optional and you can save your `*.page.js` files wherever you want.

```
FILESYSTEM                        URL
user/list.page.js                 /user/list
user/create.page.js               /user/create
todo/list.page.js                 /todo/list
todo/create.page.js               /todo/create
```

The directory common to all your `*.page.js` files is considered the routing root.

For more control over routing, define route strings and route functions in [`*.page.route.js`](#pageroutejs).

<br/><br/>


## `*.page.js`

Environement: `Browser`, `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.*([a-zA-Z0-9])`

A `*.page.js` file should have a `export { Page }` (or `export default`).

`Page` represents the page's view that is to be rendered to HTML / the DOM.

`vite-plugin-ssr` doesn't do anything with `Page` and just passes it untouched to:
 - `render({ Page })` (defined in `.page.server.js`) which renders `Page` to HTML.
 - `const { Page } = await getPage()` (from `import { getPage } from 'vite-plugin-ssr/client'`) which renders/hydrates `Page` to the DOM.

The `*.page.js` file is lazy loaded and only when needed, that is only when an HTTP request matches the page's route.

<br/><br/>


## `*.page.client.js`

Environement: `Browser`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.client.*([a-zA-Z0-9])`

A `.page.client.js` file is a `.page.js`-adjacent file that defines the page's browser-side entry.

It represents the *entire* browser-side code. This means that if you create an empty `.page.client.js` file, then the page has zero browser-side JavaScript.
(With the exception of Vite's dev code when not in production.)

<br/><br/>


## `*.page.server.js`

Environement: `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.server.*([a-zA-Z0-9])`

A `.page.server.js` file is a `.page.js`-adjacent file that defines the page's server-side lifecycle methods:
- `export { render }`
- `export { addContextProps }`
- `export { setPageProps }`

**`export { render }`**

The `async render()` function renders a `Page` to an HTML string.

```jsx
import renderToHtml from 'a-view-libray'
import { html } from 'vite-plugin-ssr'

export { render }

async function render({ Page, pageProps, contextProps }){
  const pageHtml = await renderToHtml(<Page {...pageProps} />)

  const title = contextProps.title || 'My SSR App'

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="page-root">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`
}
```

- `Page` is the `export { Page }` (or `export default`) of the adjacent `pages/demo.page.js` file.
- `pageProps` is the value returned by the `setPageProps()` function
- `contextProps` is the object passed to `createRender()({contextProps})` and merged with the object returned by the `addContextProps()` function (if the function exists).

**`export { addContextProps }`**

The `async addContextProps()` function adds values to the `contextProps` object which is available to all `.page.server.js` lifecycle methods as well as to route functions defined in `.page.route.js`.

The `async addContextProps()` function is usually used to fetch data.

Since `addContextProps()` is always called in Node.js, ORM/SQL database queries can be used.

```js
// pages/movies.page.server.js

import fetch from "node-fetch";

export { addContextProps }

async function addContextProps({ contextProps }){
  const response = await fetch("https://api.imdb.com/api/movies/")
  const { movies } = await response.json()
  return { movies }
}
```

**`export { setPageProps }`**

The `setPageProps()` returns the props `pageProps` that are to be consumed by `Page`.

The `pageProps` are serialized and passed to the browser with [`devalue`](https://github.com/Rich-Harris/devalue).

It is usally used in combination with `async addContextProps()`: data is fetched in `addContextProps` and then made available to `Page` with `setPageProps()`.

```js
// pages/movies.page.server.js

import fetch from "node-fetch";

async function addContextProps({ contextProps }) {
  const response = await fetch("https://api.imdb.com/api/movies/")
  const { movies } = await response.json()
  return { movies }
}

function setPageProps({ contextProps: { movies } }) {
  // We remove data we don't need: `vite-plugin-ssr` serializes and passes `pageProps`
  // to the client and we want to minimize what it sent over the network.
  movies = movies.map(({ title, release_date }) => ({title, release_date}))
  const pageProps = { movies }
  return pageProps
}
```
```js
// pages/movies.page.js

export { Page }

function Page({movies}) {
  /* Some JSX iterating over `movies`
     ...
  */
}
```

<br/><br/>


## `*.page.route.js`

Environement: `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.route.*([a-zA-Z0-9])`

The `*.page.route.*` files enable full control over the routing.

**Route strings**

For a page `/pages/film.page.js`, its route string can be defined at its `/pages/film.page.route.js` adjacent file.

```js
// /pages/film.page.route.js

// Match URLs `/film/1`, `/film/2`, ...
export default '/film/:filmId'
```

If the URL matches, the value of `filmId` is available at `contextProps.filmId`.

The syntax of route strings is based on [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
(the most widespread syntax in the JavaScript ecosystem).
For user friendlier docs, check out the [Express.js Routing Docs](https://expressjs.com/en/guide/routing.html)
(Express uses `path-to-regexp` as well).

**Route functions**

Route functions give you full programmatic flexibility to define your routing logic.

```js
// /pages/film/admin.page.route.js

export default route

async function route(url, contextProps) {
  if (! contextProps.user.isAdmin) {
    return {match: false}
  }
  if (! /\/film\/[0-9]+\/admin/.test(url)) {
    return {match: false}
  }
  filmId = url.split('/')[2]
  return {
    match: true,
    // Add additional context props
    contextProps: { filmId }
  }
}
```

The `match` value can be a (negative) number which allows for resolving route conflicts.
For example, `vite-plugin-ssr` internally defines `_404.page.js`'s route as:

```js
// node_modules/vite-plugin-ssr/.../_404.page.route.js

// Ensure lowest priority for the 404 page
export default () => ({match: -Infinity})
```
<br/><br/>


## `_default.page.*`

The `_default.page.server.js` and `_default.page.client.js` files are like regular `*.page.server.js` and `*.page.client.js` files but they are special in the sense that they don't apply to a single page file (in other words they are not adjacent to a `.page.js` file), instead they apply as a default to all pages.

There can be several `_default.page.*` files.

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

This has the effect that `marketing/_default.page.*` files apply to the `marketing/*.page.js` files, while
the `admin-panel/_default.page.*` files apply to the `admin-panel/*.page.js` files.

Defining a `_default.page.js` and `_default.page.route.js` files is forbidden.

<br/><br/>


## `_404.page.js`

The `_404.page.js` is like any other page with the exception that it has a predefined route.

```js
// node_modules/vite-plugin-ssr/.../_404.page.route.js

// Ensure lowest priority for the 404 page
export default () => ({match: -Infinity})
```

<br/><br/>


## `import { getPage } from 'vite-plugin-ssr/client'`

Environement: `Browser`

The `async getPage()` function is used to get the `Page` and `pageProps` in the browser.

```js
// pages/demo.page.client.js

import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  /* ... */
}
```

- `Page` is the `export { Page }` (or `export default`) of the adjacent `pages/demo.page.js` file.
- `pageProps` is the value returned by the `setPageProps()` function, which is `export { setPageProps }`'d in the adjacent `pages/demo.page.server.js` file.

The `pageProps` are serialized and passed from the server with [`devalue`](https://github.com/Rich-Harris/devalue).

In development `getPage()` dynamically `import()` the page, while in production the page is preloaded (with `<link rel="preload">`).

<br/><br/>


## `import { createRender } from 'vite-plugin-ssr'`

Environement: `Node.js`

The `createRender()` function creates the `render` function that is essentially the entry of `vite-plugin-ssr` server integration.

```js
const render = createRender({ viteDevServer, isProduction, root })

app.get('*', async (req, res, next) => {
  const url = req.originalUrl
  const contextProps = {}
  const html = await render({ url, contextProps })
  if (!html) return next()
  res.send(html)
})
```

- `isProduction` is a boolean. When set to true `vite-plugin-ssr` loads already-transpiled code from `dist/`, instead of on-the-fly transpiling your source code.
- `root` is a string holding the absolute path of your app's root directory. All your `page.*` files should be a descendent of the root directory.
- `viteDevServer` is the value returned by `const viteDevServer = await vite.createServer()`.

<br/><br/>


## `import { html } from 'vite-plugin-ssr'`

Environement: `Node.js`

The `html` template string tag is used to sanitize HTML in order to avoid XSS injections.

```js
import { html } from 'vite-plugin-ssr'

export { render }

async function render() {
  const title = 'Hello <script src="https://devil.org/evil-code"></script>'
  const pageHtml = "<div>I'm already <b>sanitized</b> by Vue/React</div>"

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="page-root">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`
}
```

The `html.sanitize()` function can be used to inject untrusted strings, while `html.dangerouslySetHtml()` should be used with caution only for HTML strings that have already been sanitized (which is the case when rendering with Vue or React).

<br/><br/>


## `import vitePlugin from 'vite-plugin-ssr'`

Environement: `Node.js`

The Vite plugin has no options, just include it in your `vite.config.js`'s `module.exports.plugins`.

```js
const ssr = require("vite-plugin-ssr");

module.exports = {
  plugins: [ssr()]
};
```

<br/><br/>


