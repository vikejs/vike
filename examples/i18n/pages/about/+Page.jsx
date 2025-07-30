export default Page

import React from 'react'
import { LocaleText } from '../../renderer/LocaleText'
import { usePageContext } from '../../renderer/usePageContext'
import { Counter } from '../../components/Counter'

function Page() {
  const pageContext = usePageContext()
  return (
    <>
      <h1>
        <LocaleText>Hello</LocaleText>
      </h1>
      <p>
        <LocaleText>Another page</LocaleText>.
      </p>
      <p>
        <code>pageContext.urlPathname === '{pageContext.urlPathname}'</code>
      </p>
      <p>
        <Counter />
      </p>
    </>
  )
}
