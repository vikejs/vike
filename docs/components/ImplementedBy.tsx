export { ImplementedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension } from '../components/UiFrameworkExtension'
import React from 'react'

function ImplementedBy({
  children,
  by,
  noCustomGuide
}: { children: React.ReactNode; by?: React.ReactNode; noCustomGuide?: true }) {
  return (
    <>
      <br />
      Implemented by: {by ?? <UiFrameworkExtension name />}.
      <blockquote>
        <p>
          You need {by ?? <UiFrameworkExtension name />} to be able to use {children}.
          {!noCustomGuide && (
            <>
              {' '}
              If you don't use {by ?? <UiFrameworkExtension name />} then see{' '}
              <Link href="#without-vike-react-vue-solid" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
