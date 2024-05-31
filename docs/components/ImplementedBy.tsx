export { ImplementedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkVikeExtensionNames } from '../components/UiFrameworkVikeExtension'
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
          You need {by ?? <UiFrameworkVikeExtensionNames />} to be able to use {children}.
          {!noCustomGuide && (
            <>
              {' '}
              If you don't use {by ?? <UiFrameworkVikeExtensionNames />} then see{' '}
              <Link href="#without-vike-react-vue-solid" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
