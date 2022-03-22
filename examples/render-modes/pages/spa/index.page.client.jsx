export { Page }

import { Counter } from '../ssr/Counter'

function Page() {
  return (
    <>
      <h1>SPA</h1>
      This page is:
      <ul>
        <li>Rendered only to the browser's DOM. (Not rendered to HTML.)</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
