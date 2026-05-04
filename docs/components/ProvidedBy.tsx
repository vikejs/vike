export { ProvidedBy }
export type { ProvidedByKind }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components/UiFrameworkExtension'
import React from 'react'

type ProvidedByKind = 'hook' | 'setting' | 'component' | 'helper'

function ProvidedBy({
  kind,
  name,
  extension,
  list,
  noCustomGuide,
  core,
}: {
  kind: ProvidedByKind
  name?: string
  extension?: `vike-${string}`
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
  const subject =
    name === undefined ? (
      `this ${kind}`
    ) : kind !== 'setting' ? (
      <code>{name}</code>
    ) : (
      <>
        the <code>{name}</code> {kind}
      </>
    )
  const iconSize = 20
  return (
    <div style={{ marginBottom: 10 }}>
      <>
        <img
          src="https://i.imgur.com/XsdeDvz.png"
          width={iconSize}
          style={{ display: 'inline-block', position: 'relative', top: 5 }}
        />{' '}
        {core ? (
          <>
            <a href="https://npmjs.com/package/vike">
              <code>vike</code>
            </a>
          </>
        ) : (
          extensionList
        )}
        {kind === 'hook' || kind === 'setting' ? (
          <>
            {' '}
            <Link href={`/${kind}s`}>{kind}</Link>
          </>
        ) : null}
      </>
      {core ? null : (
        <blockquote style={{ marginLeft: iconSize + 6, marginTop: 7, marginBottom: 13 }}>
          <p style={{ marginTop: 7, marginBottom: 10 }}>
            You need {extensionList} to be able to use {subject}.
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
