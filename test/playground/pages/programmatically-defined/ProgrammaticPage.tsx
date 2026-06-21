export default Page

import React from 'react'
import { Counter } from '../../components/Counter'
import { usePageContext } from 'vike-react/usePageContext'

// TEST: a page defined programmatically via `config.pages` (no +Page/+config file on the filesystem).
function Page() {
  const pageContext = usePageContext()
  return (
    <>
      <h1>Programmatic Page</h1>
      <p>This page is defined programmatically.</p>
      <p>urlPathname: {pageContext.urlPathname}</p>
      <Counter />
    </>
  )
}
