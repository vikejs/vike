import React from 'react'
import { LocaleText } from '../../renderer/LocaleText'

export { Page }

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
