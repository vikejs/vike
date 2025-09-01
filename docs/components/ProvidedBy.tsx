export { ProvidedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components/UiFrameworkExtension'
import React from 'react'

function ProvidedBy({
  children,
  list,
  noCustomGuide,
  core,
}: { children?: React.ReactNode; list?: UiFrameworkExtensionList; noCustomGuide?: true; core?: true }) {
  const uiFrameworkList = <UiFrameworkExtension name list={list} />
  const iconSize = 20
  return (
    <div style={{ marginBottom: 10 }}>
      <>
        <img
          src="https://i.imgur.com/XsdeDvz.png"
          width={iconSize}
          style={{ display: 'inline-block', position: 'relative', top: 5 }}
        />{' '}
        Provided by:{' '}
        {core ? (
          <>
            <a href="https://npmjs.com/package/vike">
              <code>vike</code>
            </a>
          </>
        ) : (
          uiFrameworkList
        )}
      </>
      {core ? null : (
        <blockquote style={{ marginLeft: iconSize + 6, marginTop: 7, marginBottom: 13 }}>
          <p style={{ marginTop: 7, marginBottom: 10 }}>
            You need {uiFrameworkList} to be able to use {children ?? 'this setting'}.
            {!noCustomGuide && (
              <>
                {' '}
                If you don't use {<UiFrameworkExtension name noLink list={list} />} then see{' '}
                <Link href="#without-vike-react-vue-solid" />.
              </>
            )}
          </p>
        </blockquote>
      )}
    </div>
  )
}
