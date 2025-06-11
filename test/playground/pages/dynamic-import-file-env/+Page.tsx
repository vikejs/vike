export default Page

import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assert } from '../../utils/assert'
import { checkType } from '../../utils/checkType'
import { isBrowser } from '../../utils/isBrowser'

if (isBrowser) {
  import('./hello.client')
} else {
  import('./hello.server')
}

function Page() {
  const pageContext = usePageContext()
  if (pageContext.isClientSide) {
    checkType<true>(pageContext.isClientSide)
    checkType<false>(pageContext.isPrerendering)
    assert(pageContext.isClientSide === true)
    assert(pageContext.isPrerendering === false)
  } else {
    checkType<false>(pageContext.isClientSide)
    assert(pageContext.isClientSide === false)
    checkType<boolean>(pageContext.isPrerendering)
    if (import.meta.env.DEV) {
      assert(pageContext.isPrerendering === false)
    } else {
      assert(pageContext.isPrerendering === true)
    }
  }
  return (
    <>
      <p>Dynamic import() of .client.js and .server.js</p>
    </>
  )
}
