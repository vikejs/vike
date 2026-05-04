export { ProvidedBy }
export type { ProvidedByKind }

import { Link } from '@brillout/docpress'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from '../components/UiFrameworkExtension'
import React from 'react'

type ProvidedByKind = 'hook' | 'component-hook' | 'setting' | 'component' | 'helper'

function ProvidedBy({
  kind,
  name,
  extension,
  list,
  noCustomGuide,
}: {
  kind: ProvidedByKind
  name?: string
  extension?: `vike-${string}`
  list?: UiFrameworkExtensionList
  noCustomGuide?: true
}) {
  const extensionList = extension ? (
    <Link href={`/${extension}`}>
      <code>{extension}</code>
    </Link>
  ) : (
    <UiFrameworkExtension name list={list} />
  )
  if (noCustomGuide === undefined && extension) noCustomGuide = true
  const kindText = kind === 'component-hook' ? 'component hook' : kind
  const subject =
    name === undefined ? (
      `this ${kindText}`
    ) : kind === 'hook' ? (
      <code>{name}</code>
    ) : (
      <>
        the <code>{name}</code> {kindText}
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
        {extensionList}
        {kind === 'hook' || kind === 'setting' ? (
          <>
            {' '}
            <Link href={`/${kind}s`}>{kind}</Link>
          </>
        ) : null}
      </>
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
    </div>
  )
}
