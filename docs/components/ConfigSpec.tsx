export { ConfigSpec }
export { PageHeader }
export { Box }
export { IconGlobal }
export { IconPerPage }

import React from 'react'
import { Link } from '@brillout/docpress'
import iconGlobal from '../assets/icons/global.svg'
import iconPage from '../assets/icons/page.svg'
import iconSparkles from '../assets/icons/sparkles.svg'
import iconLink from '../assets/icons/link.svg'
import iconTypescript from '../assets/icons/typescript.svg'
import { UiFrameworkExtension, type UiFrameworkExtensionList } from './UiFrameworkExtension'
import './ConfigSpec.css'

type ProvidedByKind = 'hook' | 'component-hook' | 'setting' | 'component' | 'helper'

/*
Emoji package
https://emojipedia.org/package
https://i.imgur.com/XsdeDvz.png
https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Noto_Emoji_v2.034_1f4e6.svg/40px-Noto_Emoji_v2.034_1f4e6.svg.png
https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Noto_Emoji_v2.034_1f4e6.svg/512px-Noto_Emoji_v2.034_1f4e6.svg.png

Emoji replace
https://www.flaticon.com/free-icon/exchange_17591350
https://i.imgur.com/wnJF8GR.png

Emoji CPU
https://www.freepik.com/icon/processor_2286848
https://i.imgur.com/Ri4a5Ok.png

Emoji stacking rings
https://www.flaticon.com/free-icon/stacking-rings_4593762
https://i.imgur.com/vms3p4B.png

Emoji server
https://i.imgur.com/LOS0NVE.png

Emoji client-server
https://i.imgur.com/9H3OAkk.png
https://i.imgur.com/rsJYPaa.png
https://i.imgur.com/nkHZhEo.png
https://i.imgur.com/yYDvhGa.png
*/

type ProvidedByExtension = {
  kind: ProvidedByKind
  name?: string
  extension?: `vike-${string}` | UiFrameworkExtensionList
  noCustomGuide?: true
}

function ConfigSpec({
  env,
  cumulative,
  global,
  requires,
  children,
  isTypeOneLiner,
  providedByExtension,
  ...prop
}: {
  env: React.ReactNode
  cumulative?: true
  global?: true | false
  default?: React.ReactNode
  requires?: React.ReactNode
  children?: React.ReactNode
  isTypeOneLiner?: true
  providedByExtension?: ProvidedByExtension
}) {
  let providedBy: React.ReactNode
  if (providedByExtension === undefined) {
    providedBy = <div style={{ marginBottom: 10 }} />
  } else {
    providedBy = <ProvidedBy providedByExtension={providedByExtension} />
  }
  return (
    <PageHeader
      style={{
        paddingTop: 10,
        paddingBottom: 2,
        marginBottom: 20,
      }}
    >
      {!env ? null : (
        <>
          <img
            src="https://i.imgur.com/Ri4a5Ok.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          Environment: {env}
          <br />
        </>
      )}
      {!children ? null : (
        <>
          <img
            src={iconTypescript}
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4, verticalAlign: 'top' }}
          />{' '}
          <div
            className={`code-padding-buster ${isTypeOneLiner ? 'one-liner' : ''}`}
            style={{ display: 'inline-block' }}
          >
            {children}
          </div>
          <br />
        </>
      )}
      {!prop.default ? null : (
        <>
          <img src={iconSparkles} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} />{' '}
          Default: {prop.default}
          <br />
        </>
      )}
      {!requires ? null : (
        <>
          <img src={iconLink} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} /> Requires:{' '}
          {requires}
          <br />
        </>
      )}
      {global === null ? null : global ? (
        <>
          <IconGlobal /> <Link href="/config#global">Global</Link>
          <br />
        </>
      ) : (
        <>
          <IconPerPage /> <Link href="/config#global">Per-page</Link>
          <br />
        </>
      )}
      {cumulative === undefined ? null : cumulative ? (
        <>
          <img
            src="https://i.imgur.com/vms3p4B.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          <Link href="/config#cumulative">Cumulative</Link>
          <br />
        </>
      ) : (
        <>
          <img
            src="https://i.imgur.com/wnJF8GR.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          <Link href="/config#cumulative">Non-cumulative</Link>
          <br />
        </>
      )}
      {providedBy}
    </PageHeader>
  )
}

function ProvidedBy({
  providedByExtension,
}: {
  providedByExtension: ProvidedByExtension
}) {
  const { kind, name, extension } = providedByExtension
  const single = typeof extension === 'string' ? extension : undefined
  const list = Array.isArray(extension) ? extension : undefined
  const noCustomGuide = providedByExtension.noCustomGuide ?? !!single
  const extensionList = single ? (
    <Link href={`/${single}`}>
      <code>{single}</code>
    </Link>
  ) : (
    <UiFrameworkExtension name list={list} />
  )
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

function IconGlobal() {
  return <img src={iconGlobal} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} />
}
function IconPerPage() {
  return (
    <img src={iconPage} width="19" style={{ display: 'inline-block', position: 'relative', top: 5, marginRight: 1 }} />
  )
}

function PageHeader({
  style,
  children,
}: {
  style: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <Box
      style={{
        paddingLeft: 14,
        paddingRight: 15,
        ...style,
      }}
    >
      {children}
    </Box>
  )
}

function Box({
  style,
  children,
}: {
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        backgroundColor: '#efefef',
        border: '1px solid #dee2e6',
        borderRadius: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
