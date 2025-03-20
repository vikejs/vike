export default Page

import React from 'react'
import { Counter } from '../../components/Counter'
import { usePageContext } from 'vike-react/usePageContext'
import { assert } from '../../utils/assert'

function Page() {
  const pageContext = usePageContext()
  assert(pageContext.isPrerendering === false)
  assert(typeof pageContext.isClientSide === 'boolean')
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
    </>
  )
}
