export { ProvidedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components/UiFrameworkExtension'
import React from 'react'
import './ProvidedBy.css'

function ProvidedBy({
  children,
  list,
  noCustomGuide
}: { children: React.ReactNode; list?: UiFrameworkExtensionList; noCustomGuide?: true }) {
  return (
    <>
      <p className="no-top-margin">Provided by: {<UiFrameworkExtension name list={list} />}.</p>
      <blockquote>
        <p>
          You need {<UiFrameworkExtension name list={list} />} to be able to use {children ?? 'this setting'}.
          {!noCustomGuide && (
            <>
              {' '}
              If you don't use {<UiFrameworkExtension name noLink list={list} />} then see{' '}
              <Link href="#without-vike-react-vue-solid" />.
            </>
          )}
        </p>
      </blockquote>
    </>
  )
}
