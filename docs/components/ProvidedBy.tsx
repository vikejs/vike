export { ProvidedBy }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components/UiFrameworkExtension'
import React from 'react'

function ProvidedBy({
  children,
  extension,
  list,
  noCustomGuide,
  core,
}: {
  extension?: `vike-${string}`
  children?: React.ReactNode
  list?: UiFrameworkExtensionList
  noCustomGuide?: true
  core?: true
}) {
  const extensionList = extension ? (
    <Link href={`/${extension}`}>
      <code>{extension}</code>
    </Link>
  ) : (
    <UiFrameworkExtension name list={list} />
  )
  if (noCustomGuide === undefined && extension) noCustomGuide = true
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
          extensionList
        )}
      </>
      {core ? null : (
        <blockquote style={{ marginLeft: iconSize + 6, marginTop: 7, marginBottom: 13 }}>
          <p style={{ marginTop: 7, marginBottom: 10 }}>
            You need {extensionList} to be able to use {children ?? 'this setting'}.
            {!noCustomGuide && (
              <>
                {' '}
                If you don't use {<UiFrameworkExtension succinct list={list} />} then see{' '}
                <Link href="#without-vike-react-vue-solid" />.
              </>
            )}
          </p>
        </blockquote>
      )}
    </div>
  )
}
