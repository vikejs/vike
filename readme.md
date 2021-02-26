<a href="/../../#readme">
  <img src="/logo.svg" align="right" height="70" alt="Vite Plugin SSR"/>
</a>

# `vite-plugin-ssr`

Vite SSR Plugin. Do-One-Thing-Do-It-Well, Flexible, Simple.

[Introduction](#introduction)
<br/> [Vue Tour](#vue-tour)
<br/> [React Tour](#react-tour)
<br/> Get Started
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Boilerplates](#boilerplates)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Manual Installation](#manual-installation)
<br/> Guides
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Data Fetching](#data-fetching)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Routing](#routing)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Markdown](#markdown)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Pre-rendering](#pre-rendering)
<br/> API
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.js`](#pagejs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.client.js`](#pageclientjs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { getPage } from 'vite-plugin-ssr/client'`](#import--getpage--from-vite-plugin-ssrclient)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.route.js`](#pageroutejs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route String](#route-string)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Route Function](#route-function)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.server.js`](#pageserverjs)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { addContextProps }`](#export--addcontextprops-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { setPageProps }`](#export--setpageprops-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { prerender }`](#export--prerender-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`export { render }`](#export--render-)
<br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { html } from 'vite-plugin-ssr'`](#import--html--from-vite-plugin-ssr)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_default.*`](#_default)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_404.page.js`](#_404pagejs)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Filesystem Routing](#filesystem-routing)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { createRender } from 'vite-plugin-ssr'`](#import--createrender--from-vite-plugin-ssr)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import vitePlugin from 'vite-plugin-ssr'`](#import-viteplugin-from-vite-plugin-ssr)

<br/>


## Introduction

`vite-plugin-ssr` gives you a similar experience than Nuxt/Next.js, but with Vite's wonderful DX, and as a do-one-thing-do-it-well tool: `vite-plugin-ssr` doesn't interfere with your stack and can be used with any tool you want.

- **Do-One-Thing-Do-It-Well**. Only takes care of SSR and works with: other Vite plugins, any view framework (Vue 3, Vue 2, React, Svelte, Preact, ...), and any server framework (Express, Koa, Hapi, Fastify, ...).
- **Render Control**. You control how your pages are rendered enabling you to easily and naturally integrate view tools such as Vuex and Redux.
- **Routing**. Supports Filesystem Routing for basic needs, Route Strings for simple parameterized routes, Route Functions for full flexibility, and can be used with Vue Router or React Router for client-side dynamic nested routes.
- **Pre-render / SSG / Static Websites**. Deploy your app to a static host by pre-rendering your pages.
- **Scalable**. Thanks to Vite's lazy transpiling, Vite apps can scale to thousands of modules with no hit on dev speed.
- **Fast Production Cold Start**. Your pages' server-side code is lazy loaded so that adding pages doesn't increase cold start.
- **Code Splitting**. Each page loads only the browser-side code it needs.
- **Simple Design**. Simple overall design resulting in a small & robust tool.

To get an idea of what it's like to use `vite-plugin-ssr`, checkout the [Vue Tour](#vue-tour) or [React Tour](#react-tour).

<br/><br/>


## Vue Tour

Similarly to SSR frameworks,
pages are defined by page files.

```vue
<!-- /pages/index.page.vue -->
<!-- Environment: Browser, Node.js -->

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

You can also use Route Strings (for parameterized routes such as `/movies/:id`) and Route Functions (for full programmatic flexibility).

```js
// /pages/index.page.route.js
// Environment: Node.js

export default '/'
```

Unlike SSR frameworks,
*you* define how your pages are rendered.

```js
// /pages/_default.page.server.js
// Environment: Node.js

import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'

export { render }

async function render({ Page, pageProps }) {
  const app = createSSRApp({
    render: () => h(Page, pageProps)
  })

  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>Vite w/ SSR Demo</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
```
```js
// /pages/_default.page.client.js
// Environment: Browser

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

Note how the files we created so far end with `.page.vue`, `.page.route.js`, `.page.server.js`, and `.page.client.js`.
 - `.page.js`: defines the page's view that is rendered to HTML / the DOM.
 - `.page.client.js`: defines the page's browser-side code.
 - `.page.server.js`: defines the page's server-side lifecycle methods.
 - `.page.route.js`: defines the page's Route String or Route function.

Using `vite-plugin-ssr` consists simply of writing these four types of files.

Instead of creating a `.page.client.js` and `.page.serer.js` file for each page, you create `_default.page.client.js` and `_default.page.server.js` which apply as default for all pages.

We already defined our `_default.*` files above,
which means that we can now create a new page simply by defining a new `.page.vue` file
(and optionally a new collocated `.page.route.js` file if we want to define a parameterized route.)

The `_default.*` files can be overridden. For example, you can create a page with a different browser-side code than your other pages.

```js
// /pages/about.page.client.js

// This file is empty which means that the `/about` page has zero browser-side JavaScript.
```
```vue
<!-- /pages/about.page.vue -->

<template>
  This page is only rendered to HTML.
</template>
```

By overriding `_default.page.server.js` you can
even render some of your pages with an entire different view framework such as React.

Note how files are collocated and share the same base `/pages/about.page.*`;
this is how you tell `vite-plugin-ssr` that `/pages/about.page.client.js` is the browser-side code of `/pages/about.page.vue`.

The `.page.server.js` and `.page.client.js` files give you full control over rendering.
This enables you to easily integrate tools, such as
Vue Router or Vuex, and use any Vue version you want.

Let's now have a look at how to fetch data for a page that has a parameterized route.

```vue
<!-- /pages/star-wars/movie.page.vue -->
<!-- Environment: Browser, Node.js -->

<template>
  <h1>{{movie.title}}</h1>
  <p>Release Date: {{movie.release_date}}</p>
  <p>Director: {{movie.director}}</p>
</template>

<script lang="ts">
const pageProps = ['movie']
export default { props: pageProps }
</script>
```
```js
// /pages/star-wars/movie.page.route.js
// Environment: Node.js

export default '/star-wars/:movieId'
```
```js
// /pages/star-wars/movie.page.server.js
// Environment: Node.js

import fetch from 'node-fetch'

export { addContextProps }
export { setPageProps }

async function addContextProps({ contextProps }) {
  // Route parameters are available at `contextProps`
  const { movieId } = contextProps
  // We could also use SQL/ORM queries here
  const response = await fetch(`https://swapi.dev/api/films/${movieId}`)
  const movie = await response.json()
  return { movie }
}

// The `contextProps` are available only on the server; only the `pageProps`
// are serialized and passed to the browser.
function setPageProps({ contextProps }) {
  // We select only the data we need in order to minimize what it sent over the network
  const { title, release_date, director } = contextProps.movie
  const movie = { title, release_date, director }
  return { movie }
}
```

The `addContextProps` function always runs in Node.js,
which means you can use SQL/ORM queries to fetch data.

That's it. We have seen most of `vite-plugin-ssr`'s interface, and how flexible yet simple it is.

<br/><br/>


## React Tour

Similarly to SSR frameworks,
pages are defined by page files.

```jsx
// /pages/index.page.jsx
// Environment: Browser, Node.js

import React, { useState } from "react";

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

You can also use Route Strings (for parameterized routes such as `/movies/:id`) and Route Functions (for full programmatic flexibility).

```js
// /pages/index.page.route.js
// Environment: Node.js

export default "/";
```

Unlike SSR frameworks,
*you* define how your pages are rendered.

```jsx
// /pages/_default.page.server.jsx
// Environment: Node.js

import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";

export { render };

function render({ Page, pageProps }) {
  const viewHtml = ReactDOMServer.renderToString(
    <Page {...pageProps} />
  );

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>Vite w/ SSR Demo</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(viewHtml)}</div>
      </body>
    </html>`;
}
```
```jsx
// /pages/_default.page.client.jsx
// Environment: Browser

import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";

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

Note how the files we created so far end with `.page.jsx`, `.page.route.js`, `.page.server.jsx`, and `.page.client.jsx`.
 - `.page.js`: defines the page's view that is rendered to HTML / the DOM.
 - `.page.client.js`: defines the page's browser-side code.
 - `.page.server.js`: defines the page's server-side lifecycle methods.
 - `.page.route.js`: defines the page's Route String or Route function.

Using `vite-plugin-ssr` consists simply of writing these four types of files.

Instead of creating a `.page.client.js` and `.page.serer.js` file for each page, you create `_default.page.client.js` and `_default.page.server.js` which apply as default for all pages.

We already defined our `_default.*` files above,
which means that we can now create a new page simply by defining a new `.page.jsx` file
(and optionally a new collocated `.page.route.js` file if we want to define a parameterized route.)

The `_default.*` files can be overridden. For example, you can create a page with a different browser-side code than your other pages.

```js
// /pages/about.page.client.js

// This file is empty which means that the `/about` page has zero browser-side JavaScript.
```
```jsx
// /pages/about.page.jsx

export { Page };

function Page() {
  return <>This page is only rendered to HTML.<>;
}
```

By overriding `_default.page.server.js` you can
even render some of your pages with an entire different view framework such as Vue.

Note how files are collocated and share the same base `/pages/about.page.*`;
this is how you tell `vite-plugin-ssr` that `/pages/about.page.client.js` is the browser-side code of `/pages/about.page.jsx`.

The `.page.server.js` and `.page.client.js` files give you full control over rendering.
This enables you to easily integrate tools, such as
React Router or Redux, and use Preact, Inferno or any other React-like alternative.

Let's now have a look at how to fetch data for a page that has a parameterized route.

```jsx
// /pages/star-wars/movie.page.jsx
// Environment: Browser, Node.js

import React from "react";

export { Page };

function Page({ movie }) {
  return <>
    <h1>{movie.title}</h1>
    <p>Release Date: {movie.release_date}</p>
    <p>Director: {movie.director}</p>
  </>;
}
```
```js
// /pages/star-wars/movie.page.route.js
// Environment: Node.js

export default "/star-wars/:movieId";
```
```js
// /pages/star-wars/movie.page.server.js
// Environment: Node.js

import fetch from "node-fetch";

export { addContextProps };
export { setPageProps };

async function addContextProps({ contextProps }) {
  // Route parameters are available at `contextProps`
  const { movieId } = contextProps;
  // We could also use SQL/ORM queries here
  const response = await fetch(`https://swapi.dev/api/films/${movieId}`);
  const movie = await response.json();
  return { movie };
}

// The `contextProps` are available only on the server; only the `pageProps`
// are serialized and passed to the browser.
function setPageProps({ contextProps }) {
  // We select only the data we need in order to minimize what it sent over the network
  const { title, release_date, director } = contextProps.movie;
  const movie = { title, release_date, director };
  return { movie };
}
```

The `addContextProps` function always runs in Node.js,
which means you can use SQL/ORM queries to fetch data.

That's it. We have seen most of `vite-plugin-ssr`'s interface, and how flexible yet simple it is.

</details>

<br/><br/>


## Boilerplates

Scaffold a Vite app that uses `vite-plugin-ssr`.

With NPM:

```
npm init vite-plugin-ssr
```

With Yarn:

```
yarn create vite-plugin-ssr
```

Then choose between `vue`, `vue-ts`, `react`, and `react-ts`.

<br/><br/>


## Manual Installation

If you already have an existing Vite app:

1. Add `vite-plugin-ssr` to your `vite.config.js`.
   - [Vue](/create-vite-plugin-ssr/template-vue/vite.config.js)
   - [Vue + TypeScript](/create-vite-plugin-ssr/template-vue-ts/vite.config.ts)
   - [React](/create-vite-plugin-ssr/template-react/vite.config.js)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/vite.config.ts)

2. Add `vite-plugin-ssr` to your server (Express.js, Koa, Hapi, Fastify, ...).
   - [Vue](/create-vite-plugin-ssr/template-vue/server/index.js)
   - [Vue + TypeScript](/create-vite-plugin-ssr/template-vue-ts/server/index.ts)
   - [React](/create-vite-plugin-ssr/template-react/server/index.js)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/server/index.ts)

3. Define your `_default.page.client.js` and `_default.page.server.js`.
   - [Vue](/create-vite-plugin-ssr/template-vue/pages/_default/)
   - [Vue + TypeScript](/create-vite-plugin-ssr/template-vue-ts/pages/_default/)
   - [React](/create-vite-plugin-ssr/template-react/pages/_default/)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/pages/_default/)

4. Create your first page `index.page.js`.
   - [Vue](/create-vite-plugin-ssr/template-vue/pages/index/index.page.vue)
   - [Vue + TypeScript](/create-vite-plugin-ssr/template-vue-ts/pages/index/index.page.vue)
   - [React](/create-vite-plugin-ssr/template-react/pages/index/index.page.jsx)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/pages/index/index.page.tsx)

5. Add the `dev` and `build` scripts to your `package.json`.
   - [Vue](/create-vite-plugin-ssr/template-vue/package.json)
   - [Vue + TypeScript](/create-vite-plugin-ssr/template-vue-ts/package.json)
   - [React](/create-vite-plugin-ssr/template-react/package.json)
   - [React + TypeScript](/create-vite-plugin-ssr/template-react-ts/package.json)

<br/><br/>


## Data Fetching

> :warning: We recommend reading the [Vue Tour](#vue-tour) or [React Tour](#react-tour) before proceeding with guides.

You fech data by defining two functions: `async addContextProps()` and `setPageProps()`. The `async addContextProps()` function fetches data, while `setPageProps()` specifies the data that is serialized and passed from the server to the browser.

The `async addContextProps()` function is always called in Node.js so that ORM/SQL database queries can be used.

Both lifecycle methods are defined in `.page.server.js`.

```js
// /pages/movies.page.server.js
// Environment: Node.js

import fetch from "node-fetch";

export { addContextProps }
export { setPageProps }

async function addContextProps({ contextProps }) {
  const response = await fetch("https://api.imdb.com/api/movies/")
  const { movies } = await response.json()
  return { movies }
}

function setPageProps({ contextProps: { movies } }) {
  // We only select data we need: `vite-plugin-ssr` serializes and passes `pageProps`
  // to the client and we want to minimize what it sent over the network.
  movies = movies.map(({ title, release_date }) => ({title, release_date}))
  const pageProps = { movies }
  return pageProps
}
```

The `pageProps` are passed to your `render()` lifecycle method,
and they are serialized and passed to the client-side and returned by the `import { getPage } from 'vite-plugin-ssr/client'` function.

```jsx
// /pages/_default.page.server.js
// Environment: Node.js

import { renderView } from 'some-view-library'
import { html } from 'vite-plugin-ssr'

export { render }

async function render({ Page, pageProps }) {
  // `Page` is defined below in `/pages/movies.page.js`.
  const pageHtml = await renderView(<Page {...pageProps} />)
  return html`<html>
    <div id='view-root'>
      ${html.dangerouslySetHtml(pageHtml)}
    </div>
  </html>`
}
```
```jsx
// /pages/_default.page.client.js
// Environment: Browser

import { hydrateView } from 'some-view-library'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  await hydrateView(<Page {...pageProps} />, document.getElementById('view-root'))
}
```
```jsx
// /pages/movies.page.js
// Environment: Browser, Node.js

export { Page }

// `Page` is always used either by a `render()` lifecycle method, or
// in a `.page.client.js` file.
function Page(pageProps) {
  const { movies } = pageProps
  /* ... */
}
```

<br/><br/>


## Routing

> :warning: We recommend reading the [Vue Tour](#vue-tour) or [React Tour](#react-tour) before proceeding with guides.

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
// /pages/admin.page.route.js

// Route functions allow us to implement advanced routing such as route guards.
export default async ({ url, contextProps }) => {
  if (url==='/admin' && contextProps.user.isAdmin) {
    return { match: true }
  }
}
```

For detailed informations about Filesystem Routing, route strings, and route functions:
 - [API - Filesystem Routing](#filesystem-routing)
 - [API - `*.page.route.js`](#pageroutejs)

<br/><br/>


## Markdown

> :warning: We recommend reading the [Vue Tour](#vue-tour) or [React Tour](#react-tour) before proceeding with guides.

You can use `vite-plugin-ssr` with any Vite markdown plugin.

For Vue you can use `vite-plugin-md`:
 - [/examples/vue/pages/markdown.page.md](/examples/vue/pages/markdown.page.md)
 - [/examples/vue/vite.config.ts](/examples/vue/vite.config.ts)

For React you can use `@brillout/vite-plugin-mdx`:
 - [/examples/react/pages/markdown.page.md](/examples/react/pages/markdown.page.md)
 - [/examples/react/vite.config.ts](/examples/react/vite.config.ts)

<br/><br/>


## Pre-rendering

> :warning: We recommend reading the [Vue Tour](#vue-tour) or [React Tour](#react-tour) before proceeding with guides.

> :asterisk: **What is pre-rendering?**
> Pre-rendering means to render the HTML of all your pages at once.
> Normally, the HTML of a page is rendered at request-time
> (when your user goes to your website),
> but with pre-rendering the HTML of a page is rendered at build-time instead
> (when yun run `vite-plugin-ssr prerender`).
> With pre-rendering, your app consists only of static assets (HTML, JS, CSS, images, ...)
> and you can deploy your app to so-called "static hosts" such as [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/).
> Without pre-rendering, you need to use a Node.js server that will render your pages' HTML at request-time.

To pre-render your pages, run `npx vite && npx vite --ssr && npx vite-plugin-ssr prerender`. (Or with Yarn: `yarn vite && yarn vite --ssr && yarn vite-plugin-ssr prerender`.)

For pages with a parameterized route (e.g. `/movie/:movieId`), you'll have to use the [`prerender` lifecycle method](#export--prerender-).

<br/><br/>


## `*.page.js`

Environment: `Browser`, `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.*([a-zA-Z0-9])`

A `*.page.js` file should have a `export { Page }` (or `export default`).

`Page` represents the page's view that is rendered to HTML / the DOM.

`vite-plugin-ssr` doesn't do anything with `Page` and just passes it untouched to:
 - Your `render({ Page })` function (defined in your `.page.server.js` file) which renders `Page` to HTML.
 - `const { Page } = await getPage()` (from `import { getPage } from 'vite-plugin-ssr/client'`) which you typically use in a `.page.client.js` file to render/hydrate `Page` to the DOM.

The `*.page.js` file is lazy loaded only when needed, that is only when an HTTP request matches the page's route.

<br/><br/>


## `*.page.client.js`

Environment: `Browser`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.client.*([a-zA-Z0-9])`

A `.page.client.js` file is a `.page.js`-adjacent file that defines the page's browser-side code.

It represents the *entire* browser-side code. This means that if you create an empty `.page.client.js` file, then the page has zero browser-side JavaScript.
(Except of Vite's dev code when not in production.)

This also means that you have full control over the browser-side code: not only can you render/hydrate your pages as you wish, but you can also easily integrate browser libraries.

```jsx
// *.page.client.js

import { getPage } from 'vite-plugin-ssr/client'
import { hydrateView } from 'some-view-library'
import GoogleAnalytics from '@brillout/google-analytics'

main()

async function main() {
  analytics_init()
  analytics.event('[hydration] begin')
  await hydrate()
  analytics.event('[hydration] end')
}

async function hydrate() {
  const { Page, pageProps } = await getPage()
  await hydrateView(<Page {...pageProps} />, document.getElementById('view-root'))
}

let analytics
function analytics_init() {
  analytics = new GoogleAnalytics('UA-121991291')
}
```

<br/>

### `import { getPage } from 'vite-plugin-ssr/client'`

Environment: `Browser`

The `async getPage()` function provides `Page` and `pageProps` for the browser-side code `.page.client.js`.

```js
// /pages/demo.page.client.js

import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const { Page, pageProps } = await getPage()
  /* ... */
}
```

- `Page` is the `export { Page }` (or `export default`) of the adjacent `/pages/demo.page.js` file.
- `pageProps` is the value returned by your `setPageProps()` function (which you define and export in the adjacent `pages/demo.page.server.js` file).

The `pageProps` are serialized and passed from the server to the browser with [`devalue`](https://github.com/Rich-Harris/devalue).

In development `getPage()` dynamically `import()` the page, while in production the page is preloaded (with `<link rel="preload">`).

<br/><br/>


## `*.page.route.js`

Environment: `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.route.*([a-zA-Z0-9])`

The `*.page.route.js` files enable further control over routing with:
 - Route Strings
 - Route Functions

<br/>

### Route String

For a page `/pages/film.page.js`, a route string can be defined in a `/pages/film.page.route.js` adjacent file.

```js
// /pages/film.page.route.js

// Match URLs `/film/1`, `/film/2`, ...
export default '/film/:filmId'
```

If the URL matches, the value of `filmId` is available at `contextProps.filmId`.

The syntax of route strings is based on [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
(the most widespread route syntax in JavaScript).
For user friendlier docs, check out the [Express.js Routing Docs](https://expressjs.com/en/guide/routing.html#route-parameters)
(Express.js uses `path-to-regexp`).

<br/>

### Route Function

Route functions give you full programmatic flexibility to define your routing logic.

```js
// /pages/film/admin.page.route.js

export default async ({ url, contextProps }) {
  // Route functions allow us to implement advanced routing such as route guards.
  if (! contextProps.user.isAdmin) {
    return {match: false}
  }
  // We can use RegExp and any JavaScript tool we want.
  if (! /\/film\/[0-9]+\/admin/.test(url)) {
    return {match: false}
  }
  filmId = url.split('/')[2]
  return {
    match: true,
    // Add `filmId` to `contextProps`
    contextProps: { filmId }
  }
}
```

The `match` value can be a (negative) number which enables you to resolve route conflicts.
The higher the number, the higher the priority.
For example, `vite-plugin-ssr` internally defines `_404.page.js`'s route as:

```js
// node_modules/vite-plugin-ssr/.../_404.page.route.js

// Ensure lowest priority for the 404 page
export default () => ({match: -Infinity})
```

<br/><br/>


## `*.page.server.js`

Environment: `Node.js`
<br>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.server.*([a-zA-Z0-9])`

A `.page.server.js` file is a `.page.js`-adjacent file that exports the page's server-side lifecycle methods:
- `export { addContextProps }`
- `export { setPageProps }`
- `export { render }`
- `export { prerender }`

The `*.page.server.js` file is lazy loaded only when needed.

<br/>

### `export { addContextProps }`

The `async addContextProps()` function adds values to `contextProps`. The `contextProps` are available to all `.page.server.js` lifecycle methods and to all route functions defined in `.page.route.js` files.

The `async addContextProps()` function is usually used to fetch data.
Since `addContextProps()` is always called in Node.js, ORM/SQL database queries can be used.

```js
// /pages/movies.page.server.js

import fetch from "node-fetch";

export { addContextProps }

async function addContextProps({ contextProps }){
  const response = await fetch("https://api.imdb.com/api/movies/")
  const { movies } = await response.json()
  /* Or with an ORM:
  const movies = Movie.findAll() */
  /* Or with SQL:
  const movies = sql`SELECT * FROM movies;` */
  return { movies }
}
```

<br/>

### `export { setPageProps }`

The `setPageProps()` returns the `pageProps` consumed by `Page`.

The `pageProps` are serialized and passed from the server to the browser with [`devalue`](https://github.com/Rich-Harris/devalue).

It is usally used in conjunction with `async addContextProps()`: data is fetched in `async addContextProps()` and then made available to `Page` with `setPageProps()`.

```js
// /pages/movies.page.server.js

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
// /pages/movies.page.js

export { Page }

function Page(pageProps) {
  const { movies } = pageProps
  /* ... */
}
```

<br/>

### `export { prerender }`

> :asterisk: Check out the [Pre-rendering Guide](#pre-rendering) to get an overview about pre-rendering.

The lifecycle method `prerender()` enables parameterized routes (e.g. `/movie/:movieId`) to be pre-rendered:
by defining the `prerender()` function you provide the list of URLs (`/movie/1`, `/movie/2`, ...) and optionally the `contextProps` of each URL.

If you don't have any parameterized route,
then `prerender()` is optional and you can prerender your app without defining any `prerender()` function.

You can also use use the `prerender()` lifecycle method
to increase the effeciency of pre-rendering as
it enables you to fetch data for multiple pages at once.

```js
// /pages/movie.page.route.js

export default '/movie/:movieId`
```
```js
// /pages/movie.page.server.js

export { prerender }

async function prerender() {
  const movies = await Movie.findAll()

  const moviePages = (
    movies
    .map(movie => {
      const url = `/movie/${movie.id}`
      const contextProps = { movie }
      return {
        url,
        // Beacuse we already provide the `contextProps`, vite-plugin-ssr will *not* call
        // the `addContextProps()` lifecycle method.
        contextProps
      }
      // We could also return `url` wtihout `contextProps`. In that case vite-plugin-ssr would
      // call `addContextProps()`. But that would be wasteful since we already have all the data
      // of all movies from our `await Movie.findAll()` call.
      // return { url }
    })
  )

  // We can also return URLs that don't match the page's route.
  // That way we can provide the `contextProps` of other pages.
  // Here we provide the `contextProps` of the `/movies` page since
  // we already have the data.
  const movieListPage = {
    url: '/movies', // The `/movies` URL doesn't belong to the page's route `/movie/:movieId`
    contextProps: {
      movieList: movies.map(({id, title}) => ({id, title})
    },
  }

  return [movieListPage, ...moviePages];
}
```

The lifecycle method `prerender()` is only used when pre-rendering:
if you don't call
`vite-plugin-ssr prerender`
then no `prerender()` function are called.

<br/>

### `export { render }`

Your `async render()` function should render `Page` to an HTML string.

```jsx
// *.page.server.js

import renderToHtml from 'some-view-library'
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

- `Page` is the `export { Page }` (or `export default`) of the adjacent `.page.js` file.
- `pageProps` is the value returned by the `setPageProps()` function (usually defined in the same `.page.server.js` file).
- `contextProps` is the merge of the `contextProps` you passed to [`const render = createRender(/*...*/); render({ url, contextProps })`](#import--createrender--from-vite-plugin-ssr) with the `contextProps` you returned in your `addContextProps()` function (if you defined one).

<br/>

### `import { html } from 'vite-plugin-ssr'`

Environment: `Node.js`

The `html` template string tag sanitizes HTML in order to avoid XSS injections. It is used in conjunction with the `export { render }` lifecycle method defined in `..page.server.js`

```js
// *.page.server.js

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

The `html.sanitize()` function is used for injecting untrusted strings, while `html.dangerouslySetHtml()` should be used with caution only for HTML strings that have already been sanitized (which is the case when rendering a view to HTML with Vue or React).

<br/><br/>


## `_default.*`

The `_default.page.server.js` and `_default.page.client.js` files are like regular `.page.server.js` and `.page.client.js` files, but they are special in the sense that they don't apply to a single page file; instead, they apply as a default to all pages. 

There can be several `_default.*` files.

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

The `marketing/_default.*` files apply to the `marketing/*.page.js` files, while
the `admin-panel/_default.*` files apply to the `admin-panel/*.page.js` files.

The `_default.page.server.js` and `_default.page.client.js` files are not adjacent to any `.page.js` file, and
defining `_default.page.js` or `_default.page.route.js` is forbidden.

<br/><br/>


## `_404.page.js`

The `_404.page.js` page is like any other page with the exception that it has a predefined route.

```js
// node_modules/vite-plugin-ssr/.../_404.page.route.js

// Ensure lowest priority for the 404 page
export default () => ({match: -Infinity})
```

<br/><br/>


## Filesystem Routing

By default a page is mapped to a URL based on where its `.page.js` file is located.

```
FILESYSTEM                        URL              COMMENT
pages/about.page.js               /about
pages/index/index.page.js         /                (`index` is mapped to the empty string)
pages/HELLO.page.js               /hello           (Mapping is done lower case)
```

The `pages/` directory is optional and you can save your `.page.js` files wherever you want.

```
FILESYSTEM                        URL
user/list.page.js                 /user/list
user/create.page.js               /user/create
todo/list.page.js                 /todo/list
todo/create.page.js               /todo/create
```

The directory common to all your `*.page.js` files is considered the routing root.

For more control over routing, define route strings or route functions in [`*.page.route.js`](#pageroutejs).

<br/><br/>


## `import { createRender } from 'vite-plugin-ssr'`

Environment: `Node.js`

The `createRender()` is the integration point between your server and `vite-plugin-ssr`.

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

- `isProduction` is a boolean. When set to `true`, `vite-plugin-ssr` loads already-transpiled code from `dist/` instead of on-the-fly transpiling code.
- `root` is a string holding the absolute path of your app's root directory. All your `.page.js` files should be a descendent of the root directory.
- `viteDevServer` is the value returned by `const viteDevServer = await vite.createServer(/*...*/)`.

Since `render({ url, contextProps})` is agnostic to Express.js, you can use `vite-plugin-ssr` with any server framework such as Koa, Hapi, Fastify, or vanilla Node.js.

Examples:
 - [JavaScript](/create-vite-plugin-ssr/template-react/server/index.js)
 - [TypeScript](/create-vite-plugin-ssr/template-react-ts/server/index.ts)

<br/><br/>


## `import vitePlugin from 'vite-plugin-ssr'`

Environment: `Node.js`

The Vite plugin has no options.

```js
// vite.config.js

const ssr = require("vite-plugin-ssr");

module.exports = {
  plugins: [ssr()]
};
```

<br/><br/>


