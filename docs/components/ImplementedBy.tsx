export { ImplementedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkVikeExtension, UiFrameworkVikeExtensionNames } from '../components'
import React from 'react'

function ImplementedBy({
  children,
  by,
  noCustomGuide
}: { children: React.ReactNode; by?: React.ReactNode; noCustomGuide?: true }) {
  return (
    <>
      <br />
      Implemented by: {by ?? <UiFrameworkVikeExtensionNames />}.
      <blockquote>
        <p>
          You need to use{' '}
          {by ?? (
            <>
              a <UiFrameworkVikeExtension />
            </>
          )}{' '}
          in order to use the {children}.
          {!noCustomGuide && (
            <>
            {' '}If you don't use {by ?? <UiFrameworkVikeExtensionNames />} then see{' '}
              <Link href="#without-vike-extension" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
