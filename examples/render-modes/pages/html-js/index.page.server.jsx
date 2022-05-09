export { Page }

import './index.css'

function Page() {
  return (
    <>
      <h1>HTML + JS</h1>
      <p>This page is rendered to HTML and has only few lines of browser-side JavaScript.</p>
      <p>
        <button>Loading...</button>
      </p>
      <p>
        HMR works for CSS: modify <code>pages/html-js/index.css</code> to change the color of this{' '}
        <span className="colored">red text</span>.
      </p>
    </>
  )
}
