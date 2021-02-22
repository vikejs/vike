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
