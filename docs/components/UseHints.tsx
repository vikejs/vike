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
        integrates {featureName}. And you can use <Bati /> to scaffold an app that uses <IntegrationPackageNames />.
      </p>
    </blockquote>
  )
}

function UseIntegrationPackageHint({ uiFrameworkName }: { uiFrameworkName: 'React' | 'Vue' | 'Solid' }) {
  const pkg = <code>vike-{uiFrameworkName.toLowerCase()}</code>
  const pkgWithLink = <a href="/vike-packages#ui-framework">{pkg}</a>
  return (
    <blockquote>
      <p>
        Instead of manually integrating {uiFrameworkName} yourself, you can use {pkgWithLink} which already integrates{' '}
        {uiFrameworkName}. And you can use <Bati /> to scaffold an app that uses {pkg}.
      </p>
    </blockquote>
  )
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
