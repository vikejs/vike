export { UseBatiHint }
export { UseIntegrationPackageHint }
export { UseIntegrationPackageAnyHint }

import React from 'react'
import { IntegrationPackage, IntegrationPackageNames } from '../components'

function UseIntegrationPackageAnyHint({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <IntegrationPackage /> which already
        integrates {featureName}. You can use <Bati /> to scaffold an app that uses <IntegrationPackageNames />.
      </p>
    </blockquote>
  )
}

function UseIntegrationPackageHint({
  uiFrameworkName,
  noQuote
}: {
  uiFrameworkName: 'React' | 'Vue' | 'Solid'
  noQuote?: true
}) {
  const pkg = <code>vike-{uiFrameworkName.toLowerCase()}</code>
  const pkgWithLink = <a href="/vike-packages#ui-framework">{pkg}</a>
  const hint = (
    <p>
      Instead of manually integrating {uiFrameworkName} yourself, you can use {pkgWithLink} which integrates{' '}
      {uiFrameworkName} in a full-fledged manner. You can use <Bati /> to scaffold an app that uses {pkg}.
    </p>
  )
  if (noQuote) {
    return hint
  } else {
    return <blockquote>{hint}</blockquote>
  }
}

function UseBatiHint({ toolName }: { toolName: string }) {
  return (
    <>
      <blockquote>
        <p>
          Instead of manually integrating {toolName} yourself, you can use <Bati /> to scaffold an app that already
          integrates {toolName}.
        </p>
      </blockquote>
    </>
  )
}

function Bati() {
  return <a href="https://batijs.github.io/">Bati</a>
}
