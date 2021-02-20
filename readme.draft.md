<a href="/../../#readme">
  <img src="/logo.svg" align="right" height="50" alt="Vite Plugin SSR"/>
</a>

Simple, flexible, and powerful SSR Vite plugin.

- [Features]()
- [Get Started]()
  - [Boilerplate]()
  - [Manual Installation]()
- [Guides]()
  - [Global Page Wrapper]()
  - [Routing]()
  - [HTML]()
  - [Markdown]()
  - [Full Control]()
- [API]()
  - [`*.page.js`]()
  - [`*.page.client.js`]()
  - [`*.page.server.js`]()
  - [`*.page.route.js`]()
  - [`_default.page.js`]()
  - [`_404.page.js`]()
  - [`import { getPage } from 'vite-plugin-ssr/client'`]()
  - [`import { createRender } from 'vite-plugin-ssr'`]()
  - [`import { html } from 'vite-plugin-ssr'`]()
  - [`import { plugin } from 'vite-plugin-ssr'`]()

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

With NPM:

```
npm init vite-plugin-ssr
```

With Yarn:

```
yarn create vite-plugin-ssr
```

### Manual Installation

1. Add `vite-plugin-ssr` to your `vite.config.js`.

2. Use `createServer` with your Express.js/Koa/... server.

3. Write `_default.page.client.js` and `_default.page.server.js`

4. Write your first page `index.page.js`

## Guides

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
Filesystem                  URL
pages/index.page.js         /
pages/about.page.js         /about
pages/HELLO.page.js         /hello     (Mapping is done lower case)
```

Your `.page.js` files can live anywhere; they don't have to live in `pages/` (`vite-plugin-ssr` considers as root the directory that is common to your all pages.)

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

**Route functions**. Route functions give you programmatic full power to define your routing logic.

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
