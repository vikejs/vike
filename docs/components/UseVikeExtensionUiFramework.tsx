export { UseVikeExtensionUiFramework }

import React from 'react'
import { UiFrameworkExtension } from '../components'

function UseVikeExtensionUiFramework({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <UiFrameworkExtension /> which already
        integrates {featureName}. And you can use <Bati /> to scaffold an app that uses{' '}
        <UiFrameworkExtension name noLink />.
      </p>
    </blockquote>
  )
}

function Bati() {
  return <a href="https://batijs.dev/">Bati</a>
}
