<a href="/../../#readme">
  <img src="/logo.svg" align="right" height="70" alt="Vite Plugin SSR"/>
</a>

# `vite-plugin-ssr`

`vite-plugin-ssr` is a Vite plugin that gives you a similar experience than Next.js/Nuxt but as do-one-thing-do-it-well tool:
while Next.js and Nuxt are often too framework-like, `vite-plugin-ssr` doesn't interfere with the rest of your stack.

`vite-plugin-ssr` has been designed with care for simplicity and flexibility.

Check the [Intro & Demo](#intro--demo) to get an idea of what using `vite-plugin-ssr` is like.

[Intro & Demo](#intro--demo)
<br/> [Features]()
<br/> [Get Started]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Boilerplate]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Manual Installation]()
<br/> [Guides]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Routing]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Async Data]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [HTML]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Markdown]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Global Page Wrapper]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Full Control]()
<br/> [API]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [Filesystem Routing]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.route.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.client.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`*.page.server.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_default.page.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`_404.page.js`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { getPage } from 'vite-plugin-ssr/client'`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { createRender } from 'vite-plugin-ssr'`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { html } from 'vite-plugin-ssr'`]()
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp; [`import { plugin } from 'vite-plugin-ssr'`]()

## Intro & Demo

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
Filesystem                  URL
pages/index.page.vue        /
pages/about.page.vue        /about
```

Your `*.page.vue` files don't have to live in a `pages/` directory (`vite-plugin-ssr` considers as root the directory common to all your `*.page.vue` files). You can also define a page's route with a parameterized route string or with a route function. (Route functions give you full flexibility and full programmatic power to define your page's route.)

Unlike Next.js/Nuxt, *you* define how your pages are rendered:

```js
// /pages/_default.page.server.js

import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'

export { render }

async function render(Page, initialProps) {
  const app = createSSRApp({
    render: () => h(Page, initialProps)
  })
  const appHtml = await renderToString(app)

  const title = initialProps.title || 'Demo: vite-plugin-ssr'

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
  const { Page, initialProps } = await getPage()
  const app = createSSRApp({
    render: () => h(Page, initialProps)
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
Filesystem                  URL
pages/index.page.jsx        /
pages/about.page.jsx        /about
```

Your `*.page.jsx` files don't have to live in a `pages/` directory (`vite-plugin-ssr` considers as root the directory common to all your `*.page.jsx` files). You can also define a page's route with a parameterized route string or with a route function. (Route functions give you full flexibility and full programmatic power to define your page's route.)

Unlike Next.js/Nuxt, *you* define how your pages are rendered:

```jsx
// /pages/_default.page.server.jsx

import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";

export { render };

function render(Page, initialProps) {
  const pageHtml = ReactDOMServer.renderToString(
    <Page {...initialProps} />
  );

  const title = initialProps.title || "Demo: vite-plugin-ssr";

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
  const { Page, initialProps } = await getPage();

  ReactDOM.hydrate(
    <Page {...initialProps} />,
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

## Features

- **Do-one-thing-do-it-well Tool**: `vite-plugin-ssr` only takes care of SSR. The rest of the stack is up to you: `vite-plugin-ssr` works with any view framework (Vue, React, etc.), any view library (Vuex, React Router, etc.), and any server framework (Express, Koa, Hapi, Fastify, etc.).
- **Simple but Powerful:** `vite-plugin-ssr` has been carefully designed to be simple, while allowing you to have full control not only over your tech stack, but also over how & when your pages are rendered.
- **Pre-render / SSG / Static Websites:** Deploy your app to a static host by pre-rendering all your pages.
- **Scalable:** Thanks to Vite's radical new approach of lazy transpiling & loading everything, Vite apps can scale to thousands of modules with no hit on dev speed.
- **Fast Production Cold Start:** `vite-plugin-ssr` lazy loads your pages; adding pages doesn't increase cold start.
- **Small but Sturdy:** `vite-plugin-ssr`'s source code is an order of magnitude smaller than SSR frameworks. A smaller source code leads to not only a more robust tool, but also a tool that can quickly adapt to a fast evolving Vite & JavaScript ecosystem.

**Want something?** Search [GitHub issues](https://github.com/brillout/vite-plugin-ssr/issues/) if someone has already requested what you want and upvote it, or open a new issue if not. Roadmap is prioritized based on user feedback.

## Get Started

### Boilerplate

If you start from scratch, then simply use the `vite-plugin-ssr` boilerplate:

With NPM:

```
npm init vite-plugin-ssr
```

With Yarn:

```
yarn create vite-plugin-ssr
```

### Manual Installation

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

## Guides

### Routing

By default `vite-plugin-ssr` does Filesystem Routing. For example:

```
Filesystem                  URL           Comment
pages/about.page.js         /about
pages/index.page.js         /             (`index` is mapped to the empty string)
pages/hello/index.page.js   /hello
```

The `pages/` directory is optional and you can save your `*.page.jsx` files wherever you want. For example:

```
Filesystem                  URL
user/list.page.js           /user/list
user/create.page.js         /user/detail
todo/list.page.js           /todo/list
todo/create.page.js         /todo/detail
```

The directory common to all your `*.page.jsx` files is considered the root for Filesytem Routing.

You can also define a page's route with a parameterized route string or with a route function. (Route functions give you full flexibility and full programmatic power to define your page's route.)

You can also implement more complex routing

More:
 - [API - Filesystem Routing]()
 - [API - `*.page.route.js`]()

### Async Data



### Global Page Wrapper

A "page wrapper" can be added to all your pages by using the render(/hydrate) functions defined in `_default.page.server.js` and `_default.page.client.js`.

```jsx
// _default.page.server.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { PageLayout } from '../components/PageLayout'

export default { render }

function render(Page, initialProps) {
  const page = (
    <PageLayout>
      <Page {...initialProps} />
    </PageLayout>
  )

  return ReactDOMServer.renderToString(page)
}
```

```jsx
// _default.page.client.jsx

import React from 'react'
import ReactDOM from 'react-dom'
import { PageLayout } from '../components/PageLayout'
import { getPage } from 'vite-plugin-ssr/client'

const { Page, initialProps } = await getPage()

const page = (
  <PageLayout>
    <Page {...initialProps} />
  </PageLayout>
)

ReactDOM.hydrate(page, document.getElementById('page-view'))
```

### Routing

### HTML

### Page Rendering (where/when/how)

### Browser Entry

## API

### `.page.js`

### `.page.client.js`

### `.page.server.js`

### `.page.route.js`

### `import { getPage } from 'vite-plugin-ssr/client'`

### `import { createRender } from 'vite-plugin-ssr'`

### `import { plugin } from 'vite-plugin-ssr'`

## Get Started

## Routing

The route of your pages can be defined in several ways:

- Filesystem routing
- Route string
- Route function

**Filesystem routing.** By default your pages are mapped to a URL based on where its `.page.js` is located on your filesystem. For example

```
Filesystem                  URL        Comment
pages/about.page.js         /about
pages/HELLO.page.js         /hello     (Mapping is done lower case)
pages/index.page.js         /
pages/faq/index.page.js     /faq       (`index` is mapped to the empty string)
```

Your `.page.js` files can live anywhere; they don't have to live in `pages/` (`vite-plugin-ssr` considers as root the directory common to all your `*.page.js` files.)

```
Filesystem                  URL
index/index.page.js         /
about/index.page.js         /about
hello/index.page.js         /hello
```

**Route string**. For a page `pages/film.page.js` a route string can be defined at `pages/film.page.route.js`.

```js
// pages/film.page.route.js

// Match URLs `/film/1`, `/film/2`, ...
export default '/film/:filmId'
```

The syntax is based on [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
which is the most widespread route string syntax in the JavaScript ecosystem (used by Express.js, React Router, etc.).
For more user friendly docs, check out the [Express.js Routing docs](https://expressjs.com/en/guide/routing.html).

The route parameters are available at `initialProps`.

```js
// pages/film.page.client.js
import { getPage } from 'vite-plugin-ssr/client'

const { Page, initialProps } = await getPage()
// initialProps.filmId
```

```js
// pages/film.page.server.js

export default { render, html, addInitialProps }

function render(Page, initialProps) {
  // initialProps.filmId
}

function html(pageViewHtml, initialProps) {
  // initialProps.filmId
}

function addInitialProps(initialProps) {
  // initialProps.filmId
}
```

**Route functions**. Route functions give you full programmatic power to define your routing logic.

```js
// pages/film.page.route.js

export default route

async function route(url) {
  if (url.startsWith('/foo'))
    return {
      // `match` can be a boolean or a (negative) number.
      // The higher the number, the higher the priority.
      match: 1000,
      // Route parameters passed to `initialProps`
      params: {
        isFoo: true
      }
    }

  return { match: false }
}
```
