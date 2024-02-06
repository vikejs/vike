export { UiFrameworkVikeExtension }
export { UiFrameworkVikeExtensionNames }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkVikeExtension({ plural, noLink }: { plural?: true; noLink?: true }) {
  const linkText = `Vike extension${plural ? 's' : ''}`
  const linkOrText = noLink ? linkText : <Link href="/extensions">{linkText}</Link>
  return (
    <>
      UI framework {linkOrText} (<UiFrameworkVikeExtensionNames />)
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
