export { Page }

import './index.css'

function Page() {
  return (
    <>
      <h1>HTML-only</h1>
      <p>This page has zero browser-side JavaScript. (In development, Vite's HMR client is loaded.)</p>
      <p>
        We can add some browser-side JavaScipt, see <a href="/html-js">HTML + JS</a>.
      </p>
    </>
  )
}
