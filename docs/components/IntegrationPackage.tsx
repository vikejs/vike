export { IntegrationPackage }
export { IntegrationPackageNames }

import React from 'react'
import { Link } from '@brillout/docpress'

function IntegrationPackage() {
  return (
    <>
      <Link href="/vike-packages#ui-framework">
        UI framework integration package <IntegrationPackageNames />
      </Link>
    </>
  )
}

function IntegrationPackageNames() {
  return (
    <>
      <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
    </>
  )
}
