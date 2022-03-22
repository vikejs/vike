export { Page }

import { Counter } from './Counter'

function Page() {
  return (
    <>
      <h1>SSR</h1>
      <p>This page is:</p>
      <ul>
        <li>Rendered to HTML and hydrated in the browser.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
