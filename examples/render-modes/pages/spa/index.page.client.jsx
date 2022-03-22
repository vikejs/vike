export { Page }

import { Counter } from '../ssr/Counter'

function Page() {
  return (
    <>
      <h1>SPA</h1>
      <p>This page is:</p>
      <ul>
        <li>Rendered only to the browser's DOM. (Not rendered to HTML.)</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
