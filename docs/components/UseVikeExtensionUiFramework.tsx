export { UseVikeExtensionUiFramework }

import React from 'react'
import { UiFrameworkExtension, UseScaffolder } from '../components'

UseScaffolder

function UseVikeExtensionUiFramework({ featureName }: { featureName: string }) {
  return (
    <blockquote>
      <p>
        Instead of manually integrating {featureName} yourself, you can use a <UiFrameworkExtension /> which already
        integrates {featureName}.
      </p>
      <UseScaffolder>
        <UiFrameworkExtension name noLink />
      </UseScaffolder>
    </blockquote>
  )
}
