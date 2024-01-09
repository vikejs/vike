export { UiFrameworkVikeExtension }
export { UiFrameworkVikeExtensionNames }
export { UiFrameworkVikeExtensionProvidedBy }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkVikeExtension() {
  return (
    <>
      <Link href="/extensions#ui-framework">
        UI framework Vike extension (<UiFrameworkVikeExtensionNames />)
      </Link>
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
function UiFrameworkVikeExtensionProvidedBy({ what, manual }: { what: JSX.Element; manual: JSX.Element }) {
  return (
    <blockquote>
      <p>
        The {what} is provided by{' '}
        <Link href="/extensions#ui-frameworks">
          <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
        </Link>
        . If you don't use one of these Vike extension, you can implement the {what} yourself as shown at {manual}
        .
      </p>
    </blockquote>
  )
}
