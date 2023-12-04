export { ProvidedByIntegration }

import React from 'react'
import { Link } from '@brillout/docpress'

function ProvidedByIntegration({ what, manual }: { what: JSX.Element; manual: JSX.Element }) {
  return (
    <blockquote>
      <p>
        The {what} is provided by{' '}
        <Link href="/vike-packages#ui-frameworks">
          <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
        </Link>
        . If you don't use one of these integration packages, you can implement the {what} yourself as shown at {manual}
        .
      </p>
    </blockquote>
  )
}
