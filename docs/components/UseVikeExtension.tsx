export { UseVikeExtensionUiFramework }
export { UseVikeExtension }

import React from 'react'
import { UiFrameworkVikeExtension, UiFrameworkVikeExtension } from '../components'

function UseVikeExtensionUiFramework({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <UiFrameworkVikeExtension /> which already
        integrates {featureName}. And you can use <Bati /> to scaffold an app that uses{' '}
        <UiFrameworkVikeExtension name />.
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

function Bati() {
  return <a href="https://batijs.dev/">Bati</a>
}
