export default Page

import React from 'react'
import { Counter } from './Counter'
import { usePageContext } from 'vike-react/usePageContext'

function Page() {
  const pageContext = usePageContext()
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <p>
        <code>pageContext.globalContext.someEnvVar=== '{pageContext.globalContext.someEnvVar}'</code>
      </p>
    </>
  )
}
