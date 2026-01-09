export { CommunityNote }

import React from 'react'
import { Contribution, Link, assert, parseMarkdownMini, usePageContext } from '@brillout/docpress'

const uiFrameworks = ['react', 'solid', 'vue'] as const
type UIFramework = (typeof uiFrameworks)[number]
type Extension = false | ExtensionName
type ExtensionName = `vike-${UIFramework}-${string}`

function CommunityNote({ url, extension }: { url: string; extension?: Extension }) {
  assert(url, 'url missing')
  const pageContext = usePageContext()
  const toolName = parseMarkdownMini(pageContext.resolved.pageTitle!)
  return (
    <>
      <p>
        Documentation about using Vike with <a href={url}>{toolName}</a>.
      </p>
      <Contribution>
        This page is maintained by the community and may contain outdated information —{' '}
        <a href={getEditLink(pageContext.urlPathname)} target="_blank">
          PR welcome
        </a>{' '}
        to improve it.
      </Contribution>
      {extension !== undefined && <ExtensionNote toolTitle={toolName} extension={extension} />}
    </>
  )
}

function ExtensionNote({ toolTitle, extension }: { toolTitle: React.ReactNode; extension: Extension }) {
  if (extension === false) {
    return (
      <Contribution>
        There isn't a <Link href="/extensions">Vike extension</Link> for {toolTitle} yet, but{' '}
        <a href="https://github.com/vikejs/vike/issues/1715">contributions welcome to create one</a>. In the meantime,
        you can manually integrate {toolTitle}.
      </Contribution>
    )
  }
  const uiFramework = getUiFramework(extension)
  return (
    <>
      <p>
        If you are using{' '}
        <Link href={`/vike-${extension}`}>
          <code>vike-{extension}</code>
        </Link>{' '}
        you can use{' '}
        <code>
          <a href={`https://github.com/vikejs/vike-${uiFramework}/tree/main/packages/${extension}#readme`}>
            {extension}
          </a>
        </code>{' '}
        for automatic integration.
      </p>
      <blockquote>
        <p>
          The <code>${extension}</code> extension requires{' '}
          <code>
            <Link href={`/vike-${extension}`}>vike-{extension}</Link>
          </code>
          .
        </p>
      </blockquote>
    </>
  )
}

function getEditLink(path?: string) {
  return `https://github.com/vikejs/vike/blob/main/docs/pages${path}/+Page.mdx?plain=1`
}

function getUiFramework(extension: ExtensionName) {
  let uiFramework: UIFramework | undefined
  uiFrameworks.forEach((ui) => {
    if (extension.startsWith(`vike-${ui}-`)) {
      uiFramework = ui
    }
  })
  assert(uiFramework)
  return uiFramework
}
