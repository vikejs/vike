export { Page }

import './index.css'

function Page() {
  return (
    <>
      <h1>HTML-only</h1>
      <p>
        The React component <code>Page</code> of this page is rendererd to HTML only.
      </p>
      <p>This page has zero browser-side JavaScript. (In development, Vite's HMR client is loaded.)</p>
      <p>
        As shown by this <span className="colored">orange text</span>, CSS can be loaded in <code>.page.server.js</code>{' '}
        files.
      </p>
      <p>
        If needed, we can add a little bit of browser-side JavaScipt to implement bits of interactivity, see{' '}
        <a href="/html-js">HTML + JS</a>.
      </p>
    </>
  )
}
