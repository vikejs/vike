export { CustomIntegrationWarning }

import { Link } from '@brillout/docpress'
import React from 'react'
import { UiFrameworkExtension, type UiFrameworkExtensionList, Advanced } from '../components'

function CustomIntegrationWarning({ list }: { list?: UiFrameworkExtensionList }) {
  return (
    <Advanced>
      Implementing your own custom integration can be complex and we generally recommend using{' '}
      <UiFrameworkExtension name noLink list={list} /> instead, see <Link href="/extension-vs-custom" />.
    </Advanced>
  )
}
