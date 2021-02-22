```js
// /pages/demo.page.js

export { Page }

function Page(pageProps) {
  return <>Message: {pageProps.message}</>
}
```
```
// /page/demo.page.server.js

import { renderJSX } from 'some-jsx-library'
import { html } from 'vite-plugin-ssr'

export { render }
export { setPageProps }

async funcion render({ Page, pageProps }) {
  // `Page` is the function we defined in `demo.page.js`.
  const pageHtml = await renderJSX(Page)
  // We assume our `some-jsx-library` to have sanitized `pageHtml` already.
  return html`<html>
    <div id='jsx-root'>
      ${html.dangerouslySetHtml(pageHtml)}
    </div>
  </html>;
}

function setPageProps() {
  const message = 'Hello there.'
  return { message }
}
```
```
// /page/demo.page.client.js

import { hydrateJSX } from 'some-jsx-library'
import { getPage } from 'vite-plugin-ssr/client'

hydrate()

async funcion hydrate() {
  // `vite-plugin-ssr` serializes and passes `pageProps` to the browser
  const { Page, pageProps } = await getPage()
  await hydrate(Page, document.getElementById('jsx-root')
}
```

To define `pageProps`

The page's view 

