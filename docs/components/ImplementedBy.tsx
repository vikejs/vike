export { ImplementedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension } from '../components/UiFrameworkExtension'
import React from 'react'
import './ImplementedBy.css'

function ImplementedBy({
  children,
  by,
  noCustomGuide
}: { children: React.ReactNode; by?: React.ReactNode; noCustomGuide?: true }) {
  return (
    <>
      <p className="no-top-margin">Implemented by: {by ?? <UiFrameworkExtension name noLink />}.</p>
      <blockquote>
        <p>
          You need {by ?? <UiFrameworkExtension name noLink />} to be able to use {children ?? 'this setting'}.
          {!noCustomGuide && (
            <>
              {' '}
              If you don't use {by ?? <UiFrameworkExtension name noLink />} then see{' '}
              <Link href="#without-vike-react-vue-solid" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
