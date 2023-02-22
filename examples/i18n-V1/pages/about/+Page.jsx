export default Page

import React from 'react'
import { LocaleText } from '../../renderer/LocaleText'

function Page() {
  return (
    <>
      <h1>
        <LocaleText>Hello</LocaleText>
      </h1>
      <p>
        <LocaleText>Another page</LocaleText>.
      </p>
    </>
  )
}
