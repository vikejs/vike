export { ImplementedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkVikeExtension } from '../components/UiFrameworkVikeExtension'
import React from 'react'

function ImplementedBy({
  children,
  by,
  noCustomGuide
}: { children: React.ReactNode; by?: React.ReactNode; noCustomGuide?: true }) {
  return (
    <>
      <br />
      Implemented by: {by ?? <UiFrameworkVikeExtension name />}.
      <blockquote>
        <p>
          You need {by ?? <UiFrameworkVikeExtension name />} to be able to use {children}.
          {!noCustomGuide && (
            <>
              {' '}
              If you don't use {by ?? <UiFrameworkVikeExtension name />} then see{' '}
              <Link href="#without-vike-react-vue-solid" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
