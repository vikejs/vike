export { UseBatiHint }
export { UseBatiHint_insteadOfManuelIntegration }
export { UseUiFrameworkVikeExtensionHint }
export { UseUiFrameworkVikeExtensionAnyHint }

import React from 'react'
import { UiFrameworkVikeExtension, UiFrameworkVikeExtensionNames } from '../components'

function UseUiFrameworkVikeExtensionAnyHint({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <UiFrameworkVikeExtension /> which
        already integrates {featureName}. You can use <Bati /> to scaffold an app that uses{' '}
        <UiFrameworkVikeExtensionNames />.
      </p>
    </blockquote>
  )
}

function UseUiFrameworkVikeExtensionHint({
  uiFrameworkName,
  noQuote
}: {
  uiFrameworkName: 'React' | 'Vue' | 'Solid'
  noQuote?: true
}) {
  const pkg = <code>vike-{uiFrameworkName.toLowerCase()}</code>
  const pkgWithLink = <a href="/extensions#ui-framework">{pkg}</a>
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

function UseBatiHint({ feature }: { feature: string | React.ReactElement }) {
  return (
    <>
      Use <a href="https://batijs.github.io/">Bati</a> to scaffold a Vike app using {feature}.
    </>
  )
}
function UseBatiHint_insteadOfManuelIntegration({ toolName }: { toolName: string }) {
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
