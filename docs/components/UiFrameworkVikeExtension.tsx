export { UiFrameworkVikeExtension }
export { UiFrameworkVikeExtensionNames }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkVikeExtension() {
  return (
    <>
      UI framework <Link href="/extensions">Vike extension</Link> (<UiFrameworkVikeExtensionNames />)
    </>
  )
}
function UiFrameworkVikeExtensionNames() {
  return (
    <>
      <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
    </>
  )
}
