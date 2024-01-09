export { VikeExtensionsUiFrameworks }
export { VikeExtensionsUiFrameworksNames }
export { VikeExtensionsUiFrameworksNamesEnglish }

import React from 'react'
import { Link } from '@brillout/docpress'

function VikeExtensionsUiFrameworks() {
  return (
    <>
      <Link href="/extensions#ui-framework">
        Vike extension <VikeExtensionsUiFrameworksNames />
      </Link>
    </>
  )
}
function VikeExtensionsUiFrameworksNames() {
  return (
    <>
      <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
    </>
  )
}
function VikeExtensionsUiFrameworksNamesEnglish() {
  return (
    <>
      <code>vike-react</code>, <code>vike-vue</code>, and <code>vike-solid</code>
    </>
  )
}
