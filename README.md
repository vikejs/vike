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

### `pageContext`

> :asterisk: TypeScript users can `import type { PageContextBuiltIn, PageContextBuiltInClient } from 'vite-plugin-ssr/types'`.

Built-in:
 - **`pageContext.Page`**: the `export { Page }` or `export default` of the page's `.page.js` file being rendered.
 - **`pageContext.pageExports`**: all exports of the page's `.page.js` file being rendered.
 - **`pageContext.routeParams`**: the route parameters. (E.g. `pageContext.routeParams.movieId` for a page with a Route String `/movie/:movieId`.)
 - **`pageContext.isHydration`**: *[only in the browser, and only if you use Client-side Routing]* whether the page is being hydrated or a new page is being rendered.
 - **`pageContext.url`**: The `url` you passed at your server integration point.
    ```js
    // Server Integration Point
    const renderPage = createPageRender(/*...*/)
    app.get('*', async (req, res, next) => {
      const pageContext = {}
      // `pageContext.url` is defined here
      pageContext.url = req.url
      const result = await renderPage(pageContext)
      /* ... */
    })
    ```
 - **`pageContext.urlNormalized`**: same than `pageContext.url` but with removed URL Origin and Base URL. (E.g. `pageContext.urlNormalized === '/product/42?details=yes#reviews'` for `pageContext.url === 'https://example.org/some-base-url/product/42?details=yes#reviews'`.)
 - **`pageContext.urlPathname`**: the URL's pathname (after normalization). (E.g. `/product/42` for `pageContext.url === 'https://example.org/some-base-url/product/42?details=yes#reviews'`).
 - **`pageContext.urlParsed`**: `{ pathname, search, hash }`(after normalization). (E.g. `{ pathname: 'product/42', search: { details: 'yes' }, hash: 'reviews' }`.)

Custom:
 - The `pageContext` values you returned in your page's `addPageContext()` hook (if you defined one).
 - The `pageContext` values you returned in your `_default.page.server.js`'s `addPageContext()` hook (if you defined one).
 - The `pageContext` values you passed at your server integration point.
    ```js
    // Server Integration Point
    const renderPage = createPageRender(/*...*/)
    app.get('*', async (req, res, next) => {
      const pageContext = {
        url: req.url,
        // We can add more `pageContext` here
      }
      const result = await renderPage(pageContext)
      /* ... */
    })
    ```

By default only `pageContext.Page` and `pageContext.pageExports` are available in the browser;
use [`export const passToClient: string[]`](#export--passtoclient-) to make more `pageContext` available in the browser.

The `pageContext` can be accessed at:
 - *[Node.js]* `export function addPageContext(pageContext)` (`*.page.server.js`)
 - *[Node.js]* `export function render(pageContext)` (`*.page.server.js`)
 - *[Node.js (& Browser)]* `export default function routeFunction(pageContext)` (`*.page.route.js`)
 - *[Browser]* `const pageContext = await getPage()` (`import { getPage } from 'vite-plugin-ssr/client'`)
 - *[Browser]* `useClientRouter({ render(pageContext) })` (`import { useClientRouter } from 'vite-plugin-ssr/client/router'`)

<br/><br/>


#### `export { addPageContext }`

The `addPageContext()` hook is used to provide further `pageContext` values.

The `pageContext` is passed to all hooks (defined in `.page.server.js`) and all Route Functions (defined in `.page.route.js`).

You can provide initial `pageContext` values at your server integration point [`createPageRender()`](#import--createpagerender--from-vite-plugin-ssr).
This is where you usually pass information about the authenticated user,
see [Authentication](#authentication) guide.

The `addPageContext()` hook is usually used with [`const passToClient: string[]`](#export--passtoclient-) to fetch data, see [Data Fetching](#data-fetching) guide.

Since `addPageContext()` is always called in Node.js, ORM/SQL database queries can be used.

```js
// /pages/movies.page.server.js

import fetch from "node-fetch";

export { addPageContext }

async function addPageContext(pageContext){
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

#### `export { passToClient }`

You can tell `vite-plugin-ssr` what `pageContext` to send to the browser by using `passToClient`.

The `pageContext` is serialized and passed from the server to the browser with [`devalue`](https://github.com/Rich-Harris/devalue).

It is usally used with the `addPageContext()` hook to fetch data:
data is fetched in `async addPageContext()` and then made available to the browser with `passToClient`.

```js
// *.page.server.js
// Environment: Node.js

import fetch from "node-fetch";

export { passToClient }

// Example of `pageContext` often passed to the browser
const passToClient = [
  'pageProps',
  'routeParams',
  // (Deep selection is not implemented yet; open a GitHub ticket if you want this.)
  'user.id',
  'user.name'
]
```

```js
// *.page.client.js
// Environment: Browser

import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const pageContext = await getPage()

  // Thanks to `passToClient`, these `pageContext` are available here in the browser
  pageContext.pageProps
  pageContext.routeParams
  pageContext.user.id
  pageContext.user.name

  /* ... */
}
```

Or when using Client-side Routing:

```js
// *.page.client.js
// Environment: Browser

import { useClientRouter } from 'vite-plugin-ssr/client/router'

useClientRouter({
  render(pageContext) {
    // Thanks to `passToClient`, these `pageContext` are available here in the browser
    pageContext.pageProps
    pageContext.routeParams
    pageContext.user.id
    pageContext.user.name

    /* ... */
  }
})
```

<br/>

#### `export { render }`

The `render()` hook defines how a page is rendered to HTML.

It usually returns an HTML string,
but it can also return something else than HTML which we talk more about down below.

```js
// *.page.server.js
// Environment: Node.js

import { html } from 'vite-plugin-ssr'
import { renderToHtml, createElement } from 'some-view-framework'

export { render }

async function render(pageContext){
  const { Page, pageProps } = pageContext
  const pageHtml = await renderToHtml(createElement(Page, pageProps))
  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>My SSR App</title>
      </head>
      <body>
        <div id="page-root">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
```

`Page` is the `export { Page }` (or `export default`) of the `.page.js` file being rendered.

The value `renderResult` returned by your `render()` hook doesn't have to be HTML:
`vite-plugin-ssr` doesn't do anything with `renderResult` and just passes it untouched at your server integration point [`createPageRender()`](#import--createpagerender--from-vite-plugin-ssr).

```js
// *.page.server.js

export { render }

function render(pageContext) {
  let renderResult
  /* ... */
  return renderResult
}
```
```js
// server.js

const renderPage = createPageRender(/*...*/)

app.get('*', async (req, res, next) => {
  const result = await renderPage({ url: req.originalUrl })
  // `result.renderResult` is the value returned by your `render()` hook.
  const { renderResult } = result
  /* ... */
})
```

Your `render()` hook can for example return an object like `{ redirectTo: '/some/url' }` in order to do [Page Redirection](#page-redirection).

<br/>

#### `export { prerender }`

> :asterisk: Check out the [Pre-rendering Guide](#pre-rendering) to get an overview about pre-rendering.

The `prerender()` hook enables parameterized routes (e.g. `/movie/:movieId`) to be pre-rendered:
by defining the `prerender()` hook you provide the list of URLs (`/movie/1`, `/movie/2`, ...) and (optionally) the `pageContext` of each URL.

If you don't have any parameterized route,
then you can prerender your app without defining any `prerender()` hook.
You can, however, still use the `prerender()` hook
to increase the effeciency of pre-rendering as
it enables you to fetch data for multiple pages at once.

```js
// /pages/movie.page.route.js
// Environment: Node.js

export default '/movie/:movieId`
```
```js
// /pages/movie.page.server.js
// Environment: Node.js

export { prerender }

async function prerender() {
  const movies = await Movie.findAll()

  const moviePages = (
    movies
    .map(movie => {
      const url = `/movie/${movie.id}`
      const pageContext = { movie }
      return {
        url,
        // Beacuse we already provide the `pageContext`, vite-plugin-ssr will *not* call
        // any `addPageContext()` hook for `url`.
        pageContext
      }
      // We could also only return `url`. In that case vite-plugin-ssr would call
      // `addPageContext()`. But that would be wasteful since we already have all
      // the data of all movies from our `await Movie.findAll()` call.
      // return { url }
    })
  )

  // We can also return URLs that don't match the page's route.
  // That way we can provide the `pageContext` of other pages.
  // Here we provide the `pageContext` of the `/movies` page since
  // we already have the data.
  const movieListPage = {
    url: '/movies', // The `/movies` URL doesn't belong to the page's route `/movie/:movieId`
    pageContext: {
      movieList: movies.map(({id, title}) => ({id, title})
    }
  }

  return [movieListPage, ...moviePages]
}
```

The `prerender()` hook is only used when pre-rendering:
if you don't call
`vite-plugin-ssr prerender`
then no `prerender()` hook is called.

Vue Example:
 - [/examples/vue-full/package.json](examples/vue-full/package.json) (see the `build:prerender` script)
 - [/examples/vue-full/pages/star-wars/index.page.server.ts](examples/vue-full/pages/star-wars/index.page.server.ts) (see the `prerender()` hook)
 - [/examples/vue-full/pages/hello/index.page.server.ts](examples/vue-full/pages/hello/index.page.server.ts) (see the `prerender()` hook)

React Example:
 - [/examples/react-full/package.json#build:prerender](examples/react-full/package.json) (see the `build:prerender` script)
 - [/examples/react-full/pages/star-wars/index.page.server.ts](examples/react-full/pages/star-wars/index.page.server.ts) (see the `prerender()` hook)
 - [/examples/react-full/pages/hello/index.page.server.ts](examples/react-full/pages/hello/index.page.server.ts) (see the `prerender()` hook)

<br/><br/>


### `import { html } from 'vite-plugin-ssr'`

Environment: `Node.js`

The `html` tag sanitizes HTML (to prevent XSS injections).
It is usually used in your `render()` hook defined in `.page.server.js`.

```js
// *.page.server.js
// Environment: Node.js

import { html } from 'vite-plugin-ssr'

export { render }

async function render() {
  const title = 'Hello<script src="https://devil.org/evil-code"></script>'
  const pageHtml = "<div>I'm already <b>sanitized</b>, e.g. by Vue/React</div>"

  // This HTML is safe thanks to the string template tag `html` which sanitizes `title`
  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-root">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
```

All strings, e.g. `title`, are automatically sanitized (technically speaking: HTML-escaped)
so that you can safely include untrusted strings
such as user-generated text.

The `html.dangerouslySkipEscape(str)` function injects the string `str` as-is *without* sanitizing.
It should be used with caution and
only for HTML strings that are guaranteed to be already sanitized.
It is usually used to include HTML generated by React/Vue/Solid/... as these frameworks always generate sanitized HTML.
If you find yourself using `html.dangerouslySkipEscape()` in other situations be extra careful as you run into the risk of creating a security breach.

You can assemble the overall HTML document from several pieces of HTML segments.
For example, when you want some HTML parts to be included only for certain pages:

```js
// _default.page.server.js
// Environment: Node.js

import { html } from 'vite-plugin-ssr'
import { renderToHtml } from 'some-view-framework'

export { render }

async function render(pageContext) {
  // We only include the `<meta name="description">` tag if the page has a description.
  // (Pages define `pageContext.documentProps.description` with their `addPageContext()` hook.)
  const description = pageContext.documentProps?.description
  let descriptionTag = ''
  if( description ) {
    // Note how we use the `html` string template tag for an HTML segment.
    descriptionTag = html`<meta name="description" content="${description}">`
  }

  // We use the `html` tag again for the overall HTML, and since `descriptionTag` is
  // already sanitized it will not be sanitized again.
  return html`<html>
    <head>
      ${descriptionTag}
    </head>
    <body>
      <div id="root">
        ${html.dangerouslySkipEscape(await renderToHtml(pageContext.Page))}
      </div>
    </body>
  </html>`
}
```

<br/><br/>


### `*.page.client.js`

Environment: `Browser`
<br/>
[Ext Glob](https://github.com/micromatch/micromatch#extglobs): `/**/*.page.client.*([a-zA-Z0-9])`

The `.page.client.js` file defines the page's browser-side code.

It represents the *entire* browser-side code. This means that if you create an empty `.page.client.js` file, then the page has zero browser-side JavaScript.
(Except of Vite's dev code when not in production.)

This also means that you have full control over the browser-side code. Not only can you render/hydrate your pages as you wish, but you can also easily & naturally integrate browser libraries.

```js
// *.page.client.js

import { getPage } from 'vite-plugin-ssr/client'
import { hydrateToDom, createElement } from 'some-view-framework'
import GoogleAnalytics from '@brillout/google-analytics'

main()

async function main() {
  analytics_init()
  analytics.event('[hydration] begin')
  await hydrate()
  analytics.event('[hydration] end')
}

async function hydrate() {
  const pageContext = await getPage()
  const { Page, pageProps } = pageContext
  await hydrateToDom(
    createElement(Page, pageProps),
    document.getElementById('view-root')
  )
}

let analytics
function analytics_init() {
  analytics = new GoogleAnalytics('UA-121991291')
}
```

<br/>

### `import { getPage } from 'vite-plugin-ssr/client'`

Environment: `Browser`

You use `async getPage()` to get `pageContext.Page` and furhter `pageContext` in the browser-side.

```js
// *.page.client.js

import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async function hydrate() {
  const pageContext = await getPage()
  /* ... */
}
```

- `pageContext.Page` is the `export { Page }` (or `export default`) of the `/pages/demo.page.js` file.
- `pageContext` is a subset of the `pageContext` defined on the server-side; the `passToClient` determines what `pageContext` is sent to the browser.

The `pageContext` is serialized and passed from the server to the browser with [`devalue`](https://github.com/Rich-Harris/devalue).

In development `getPage()` dynamically `import()` the page, while in production the page is preloaded (with `<link rel="preload">`).

<br/>

### `import { useClientRouter } from 'vite-plugin-ssr/client/router'`

Environment: `Browser`

By default, `vite-plugin-ssr` does Server-side Routing.
You can do Client-side Routing instead by using `useClientRouter()` in your `_default.page.client.js` (or in a page's `*.page.client.js`).

```js
// _default.page.client.js
// Environment: Browser

import { renderToDom, hydrateToDom, createElement } from 'some-view-framework'
import { useClientRouter } from 'vite-plugin-ssr/client/router'

const { hydrationPromise } = useClientRouter({
  async render(pageContext) {
    const page = createElement(pageContext.Page, pageContext.pageProps)
    const container = document.getElementById('page-view')

    // Render the page
    if (pageContext.isHydration) {
      // This is the first page rendering; the page has been rendered to HTML
      // and we now make it interactive.
      await hydrateToDom(page)
    } else {
      // Render a new page
      await renderToDom(page)
    }

    // We use `pageContext.documentProps.title` to update `<title>`.
    // (Make sure to add it to `export const passToClient = ['pageProps, 'documentProps']`,
    // and your pages can then return `documentProps` in their `addPageContext()` hook.)
    document.title =
      pageContext.documentProps?.title ||
      // A default title
      'Demo'
  },
  onTransitionStart,
  onTransitionEnd
})

hydrationPromise.then(() => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  console.log('Page transition start')
  // For example:
  document.body.classList.add('page-transition')
}
function onTransitionEnd() {
  console.log('Page transition end')
  // For example:
  document.body.classList.remove('page-transition')
}
```

You can keep your `<a href="/some-url">` links as they are: link clicks are intercepted.
You can also use
[`import { navigate } from 'vite-plugin-ssr/client/router'`](#import--navigate--from-vite-plugin-ssrclientrouter)
to programmatically navigate your user to a new page.

By default, the Client-side Router scrolls the page to the top upon page transitions;
use `<a keep-scroll-position />` / `navigate(url, { keepScrollPosition: true })`
if you want to preserve the scroll position instead. (Useful for [Nested Routes](#nested-routes).)

`useClientRouter()` is fairly high-level, if you need lower-level control, then open a GitHub issue.

Vue example:
 - [/examples/vue-full/pages/_default/_default.page.client.ts](examples/vue-full/pages/_default/_default.page.client.ts)
 - [/examples/vue-full/pages/_default/app.ts](examples/vue-full/pages/_default/app.ts)
 - [/examples/vue-full/pages/index.page.vue](examples/vue-full/pages/index.page.vue) (example of using `import { navigate } from "vite-plugin-ssr/client/router"`)

React example:
 - [/examples/react-full/pages/_default/_default.page.client.tsx](examples/react-full/pages/_default/_default.page.client.tsx)
 - [/examples/react-full/pages/index.page.tsx](examples/react-full/pages/index.page.tsx) (example of using `import { navigate } from "vite-plugin-ssr/client/router"`)

<br/><br/>


### `import { navigate } from 'vite-plugin-ssr/client/router'`

Environment: `Browser`, `Node.js`. (In Node.js `navigate()` is importable but not callable.)

You can use `navigate('/some-url')` to programmatically navigate your user to another page (i.e. when navigation isn't triggered by the user clicking on an anchor tag `<a>`).
For example, you can use `navigate()` to redirect your user after a successful form submission.

```jsx
import { navigate } from "vite-plugin-ssr/client/router";

// Some deeply nested view component
function Form() {
   return (
     <form onSubmit={onSubmit}>
       {/*...*/}
     </form>
   );
}

async function onSubmit() {
  /* ...  */

  const navigationPromise = navigate('/form/success');

  console.log("The URL changed but the new page hasn't rendered yet.");
  await navigationPromise
  console.log("The new page has finished rendering.");
}
```

While you can import `navigate()` in Node.js, you cannot call it: calling `navigate()` in Node.js throws a `[Wrong Usage]` error.
(`vite-plugin-ssr` allows you to import `navigate()` in Node.js because with SSR your view components are loaded in the browser as well as Node.js.)

If you want to redirect your user at page-load time, see the [Page Redirection](#page-redirection) guide.

Options:
 - `navigate('/some-url', { keepScrollPosition: true })`: Do not scroll to the top of the page; keep scroll position where it is instead. (Useful for [Nested Routes](#nested-routes).) (You can also use `<a href="/some-url" keep-scroll-position />`.)

Vue example:
 - [/examples/vue-full/pages/index.page.vue](examples/vue-full/pages/index.page.vue)

React example:
 - [/examples/react-full/pages/index.page.tsx](examples/react-full/pages/index.page.tsx)

<br/><br/>


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


