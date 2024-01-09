export { VikeExtensionsUiFrameworks }
export { VikeExtensionsUiFrameworksNames }
export { VikeExtensionsUiFrameworksNamesEnglish }
export { ProvidedByVikeExtensionUiFramework }

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

function ProvidedByVikeExtensionUiFramework({ what, manual }: { what: JSX.Element; manual: JSX.Element }) {
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
