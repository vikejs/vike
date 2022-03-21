export { Page }

import { Counter } from '../ssr/Counter'

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered only to browser's DOM.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
