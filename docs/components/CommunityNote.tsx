export { CommunityNote }

import React from 'react'
import { Contribution, Link, assert, parseMarkdownMini, usePageContext } from '@brillout/docpress'

type UIFramework = 'react' | 'solid' | 'vue' | false

function CommunityNote({ url, hasExtension }: { url: string; hasExtension?: UIFramework }) {
  assert(url, 'The `url` prop is required')
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
      {hasExtension !== undefined && <HasExtension toolTitle={toolName} hasExtension={hasExtension} />}
    </>
  )
}

function HasExtension({ toolTitle, hasExtension }: { toolTitle: React.ReactNode; hasExtension: UIFramework }) {
  const pageContext = usePageContext()
  if (hasExtension === false) {
    return (
      <Contribution>
        There isn't a <Link href="/extensions">Vike extension</Link> for {toolTitle} yet, but{' '}
        <a href="https://github.com/vikejs/vike/issues/1715">contributions welcome to create one</a>. In the meantime,
        you can manually integrate {toolTitle}.
      </Contribution>
    )
  }
  let toolName = pageContext.urlPathname
  if (toolName.startsWith(hasExtension)) {
    const prefix = `${hasExtension}-`
    assert(toolName.startsWith(prefix))
    toolName.slice(prefix.length)
  }
  return (
    <>
      <p>
        If you are using{' '}
        <Link href={`/vike-${hasExtension}`}>
          <code>vike-{hasExtension}</code>
        </Link>{' '}
        you can use{' '}
        <code>
          <a
            href={`https://github.com/vikejs/vike-${hasExtension}/tree/main/packages/vike-${hasExtension}-${toolName}#readme`}
          >
            vike-{hasExtension}-{toolName}
          </a>
        </code>{' '}
        for automatic integration.
      </p>
      <blockquote>
        <p>
          The{' '}
          <code>
            vike-{hasExtension}-{toolName}
          </code>{' '}
          extension requires{' '}
          <code>
            <Link href={`/vike-${hasExtension}`}>vike-{hasExtension}</Link>
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
