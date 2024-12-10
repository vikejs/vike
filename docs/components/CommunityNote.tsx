export { CommunityNote }

import React from 'react'
import { assert, Contribution, usePageContext, Link } from '@brillout/docpress'

type UIFramework = 'react' | 'solid' | 'vue' | false

function CommunityNote({ tool, url, hasExtension }: { tool: string; url: string; hasExtension?: UIFramework }) {
  assert(tool && url, 'Both the `tool` & `url` props are required')
  const pageContext = usePageContext()
  return (
    <>
      <p>
        Community-led documentation about using <a href={url}>{pageContext.pageTitle}</a> with Vike.
      </p>
      <Contribution>
        This page may contain outdated information,{' '}
        <a href={getEditLink(pageContext.urlPathname)} target="_blank">
          PR welcome
        </a>{' '}
        to update or improve this page.
      </Contribution>
      {hasExtension !== undefined && <HasExtension toolName={tool} toolTitle={pageContext.pageTitle!} hasExtension={hasExtension} />}
    </>
  )
}

function HasExtension({
  toolName,
  toolTitle,
  hasExtension
}: { toolName: string; toolTitle: string; hasExtension: UIFramework }) {
  if (hasExtension === false) {
    return (
      <Contribution>
        There isn't a <Link href="/extensions">Vike extension</Link> for {toolTitle} yet, but{' '}
        <a href="https://github.com/vikejs/vike/issues/1715">contributions welcome to create one</a>. In the meantime,
        you can manually integrate {toolTitle}.
      </Contribution>
    )
  }
  return (
    <>
      <p>
        If you are using <Link href={`/vike-${hasExtension}`}>vike-{hasExtension}</Link>, you can install{' '}
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
          The <code>vike-{hasExtension}-{toolName}</code> extension requires{' '}
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
