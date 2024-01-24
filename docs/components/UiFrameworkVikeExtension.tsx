export { UiFrameworkVikeExtensionUsageIntro }
export { UiFrameworkVikeExtensionUsageConf }
export { UiFrameworkVikeExtensionUsageHooks }
export { UiFrameworkVikeExtensionUsageCoreSettings }
export { UiFrameworkVikeExtensionUsageNewSettings }
export { UiFrameworkVikeExtensionUsageComponentHooks }
export { UiFrameworkVikeExtensionUsageComponents }
export { UiFrameworkVikeExtensionUsageSeeAlso }
export { UiFrameworkVikeExtension }
export { UiFrameworkVikeExtensionNames }

import React from 'react'
import { Link } from '@brillout/docpress'
import { UseBatiHint } from '.'
import { TextType } from '.'

function UiFrameworkVikeExtensionUsageIntro({ packageName }: { packageName: string }) {
  return (
    <>
      <UiFrameworkVikeExtension plural />:
      <ul>
        <li>
          implement Vike Core <Link href="/hooks">hooks</Link> (e.g.{' '}
          <Link href="/onRenderHtml">
            <code>onRenderHtml()</code>
          </Link>
          ) on your behalf,
        </li>
        <li>
          set Vike Core <Link href="/settings">settings</Link> on your behalf,
        </li>
        <li>introduce new hooks for you to implement if needed,</li>
        <li>introduce new settings for you to set if needed,</li>
        <li>introduce new components and component hooks.</li>
      </ul>
      <h2>Scaffold new app</h2>
      <UseBatiHint feature={<code>{packageName}</code>} />
      <h2>Add to existing app</h2>
      <p>
        To add <code>{packageName}</code> to an existing Vike app:
      </p>
      <ol>
        <li>
          Install the <code>{packageName}</code> npm package in your project:
        </li>
      </ol>
    </>
  )
}
function UiFrameworkVikeExtensionUsageConf({ packageName }: { packageName: string }) {
  return (
    <>
      <ol>
        <li value="2">
          Extend your existing Vike <Link href="/config">config files</Link> with <code>{packageName}</code>:
        </li>
      </ol>
    </>
  )
}
function UiFrameworkVikeExtensionUsageHooks({
  packageName,
  uiFrameworkName
}: {
  packageName: string
  uiFrameworkName: string
}) {
  return (
    <>
      <h2>Hooks</h2>
      <code>{packageName}</code> implements the{' '}
      <Link href="/onRenderHtml">
        <code>onRenderHtml()</code>
      </Link>{' '}
      and
      <Link href="/onRenderClient">
        <code>onRenderClient()</code>
      </Link>{' '}
      hooks on your behalf, which are essentially the glue code between Vike and {uiFrameworkName}.
    </>
  )
}
function UiFrameworkVikeExtensionUsageCoreSettings({
  packageName,
  uiFrameworkName
}: {
  packageName: string
  uiFrameworkName: string
}) {
  return (
    <>
      <h2>Settings</h2>
      <code>{packageName}</code> sets the following Vike Core settings on your behalf:
      <ul>
        <li>
          <Link href="/clientRouting">
            <b>
              <code>clientRouting=true</code>
            </b>
          </Link>
          : Enable <Link href="/client-routing">Client Routing</Link>.
        </li>
        <li>
          <Link href="/hydrationCanBeAborted">
            <b>
              <code>hydrationCanBeAborted=true</code>
            </b>
          </Link>
          : {uiFrameworkName} allows the <Link href="/hydration">hydration</Link> to be aborted.
        </li>
      </ul>
    </>
  )
}
function UiFrameworkVikeExtensionUsageNewSettings({
  packageName,
  children
}: {
  packageName: string
  children?: React.ReactNode | React.ReactNode[]
}) {
  return (
    <>
      <code>{packageName}</code> introduces the following new settings:
      <ul>
        <li>
          <Link href="/Head">
            <b>
              <code>Head</code>
            </b>
          </Link>
          : <TextType>Component</TextType> Component to be rendered inside the <code>{'<head>'}</code> tag.
        </li>
        <li>
          <Link href="/Head">
            <b>
              <code>title</code>
            </b>
          </Link>
          : <TextType>string</TextType> <code>{'<title>...</title>'}</code> tag.
        </li>
        <li>
          <Link href="/Head">
            <b>
              <code>favicon</code>
            </b>
          </Link>
          : <TextType>string</TextType> <code>{'<link rel="icon" href="..." />'}</code> tag.
        </li>
        <li>
          <Link href="/lang">
            <b>
              <code>lang</code>
            </b>
          </Link>
          : <TextType>string</TextType> <code>{'<html lang="...">'}</code> tag.
        </li>
        <li>
          <Link href="/ssr">
            <b>
              <code>ssr</code>
            </b>
          </Link>
          : <TextType>boolean</TextType> Enable/disable Server-Side Rendering (<Link href="/render-modes">SSR</Link>).
        </li>
        <li>
          <Link href="/stream">
            <b>
              <code>stream</code>
            </b>
          </Link>
          : <TextType>boolean</TextType> Enable/disable <Link href="/streaming">HTML streaming</Link>.
        </li>
        <li>
          <Link href="/Layout">
            <b>
              <code>Layout</code>
            </b>
          </Link>
          : <TextType>Component</TextType> Wrapper for your <Link href="/Page">Page component</Link>.
        </li>
        {children}
      </ul>
    </>
  )
}
function UiFrameworkVikeExtensionUsageComponentHooks({ packageName }: { packageName: string }) {
  return (
    <>
      <h2>Component hooks</h2>
      <code>{packageName}</code> introduces the following new component hooks:
      <ul>
        <li>
          <Link href="/useData">
            <b>
              <code>useData()</code>
            </b>
          </Link>
          : Access the data that is returned by a{' '}
          <Link href="/data">
            <code>data()</code> hook
          </Link>{' '}
          from any component.
        </li>
        <li>
          <Link href="/usePageContext">
            <b>
              <code>usePageContext()</code>
            </b>
          </Link>
          : Access the
          <Link href="/pageContext">
            <code>pageContext</code> object
          </Link>{' '}
          from any component.
        </li>
      </ul>
    </>
  )
}
function UiFrameworkVikeExtensionUsageComponents({ packageName }: { packageName: string }) {
  return (
    <>
      <h2>Components</h2>
      <code>{packageName}</code> introduces the following new components:
      <ul>
        <li>
          <Link href="/ClientOnly">
            <b>
              <code>ClientOnly</code>
            </b>
          </Link>
          : Wrapper to render and load a component only on the client-side.
        </li>
      </ul>
    </>
  )
}
function UiFrameworkVikeExtensionUsageSeeAlso({ packageName }: { packageName: string }) {
  return (
    <>
      <h2>See also</h2>
      <ul>
        <li>
          <a href={`https://github.com/vikejs/${packageName}`}>
            Source code of <code>{packageName}</code>
          </a>
        </li>
      </ul>
    </>
  )
}

function UiFrameworkVikeExtension({ plural }: { plural?: boolean }) {
  return (
    <>
      UI framework <Link href="/extensions">Vike extension{plural ? 's' : ''}</Link> (<UiFrameworkVikeExtensionNames />)
    </>
  )
}
function UiFrameworkVikeExtensionNames() {
  return (
    <>
      <code>vike-react</code>/<code>vike-vue</code>/<code>vike-solid</code>
    </>
  )
}
