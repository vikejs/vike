export { UseBatiHint }
export { UseUiFrameworkVikeExtensionHint }
export { UseUiFrameworkVikeExtensionAnyHint }
export { UseVikeExtension }

import React from 'react'
import { UiFrameworkVikeExtension, UiFrameworkVikeExtensionNames } from '../components'

function UseUiFrameworkVikeExtensionAnyHint({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <UiFrameworkVikeExtension /> which already
        integrates {featureName}. You can use <Bati /> to scaffold an app that uses <UiFrameworkVikeExtensionNames />.
      </p>
    </blockquote>
  )
}

function UseVikeExtension({
  children,
  href
}: { children: 'Pinia' | 'React Query' | string; href: `https://github.com/${string}` }) {
  return (
    <blockquote>
      <p>
        You can use{' '}
        {
          <a href={href}>
            <code>{`vike-${children.toLowerCase().replaceAll(' ', '-')}`}</code>
          </a>
        }{' '}
        instead of manually integrating {children} yourself.
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
      {uiFrameworkName} in a full-featured manner. You can use <Bati /> to scaffold an app that uses {pkg}.
    </p>
  )
  if (noQuote) {
    return hint
  } else {
    return <blockquote>{hint}</blockquote>
  }
}

function UseBatiHint({ children }: { children: string | React.ReactElement }) {
  return (
    <p>
      You can use <Bati /> to scaffold a Vike app that uses {children}.
    </p>
  )
}

function Bati() {
  return <a href="https://batijs.dev/">Bati</a>
}
