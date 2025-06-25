export { CommunityNote }

import React from 'react'
import { Contribution, Link, assert, parseMarkdownMini, usePageContext } from '@brillout/docpress'

type UIFramework = 'react' | 'solid' | 'vue' | false

function CommunityNote({ tool, url, hasExtension }: { tool?: string; url: string; hasExtension?: UIFramework }) {
  assert(url, 'The `url` prop is required')
  if (hasExtension !== undefined) {
    assert(tool, 'The `tool` prop is required when the `hasExtension` prop is provided')
  }
  const pageContext = usePageContext()
  return (
    <>
      <p>
        Documentation about using Vike with <a href={url}>{parseMarkdownMini(pageContext.resolved.pageTitle!)}</a>.
      </p>
      <Contribution>
        This page is maintained by the community and may contain outdated information;{' '}
        <a href={getEditLink(pageContext.urlPathname)} target="_blank">
          PR welcome
        </a>{' '}
        to update or improve it.
      </Contribution>
      {hasExtension !== undefined && (
        <HasExtension toolName={tool} toolTitle={pageContext.resolved.pageTitle!} hasExtension={hasExtension} />
      )}
    </>
  )
}

function HasExtension({
  toolName,
  toolTitle,
  hasExtension,
}: { toolName?: string; toolTitle: string; hasExtension: UIFramework }) {
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
  return `https://github.com/vikejs/vike/blob/main/packages/vike.dev/pages${path}/+Page.mdx?plain=1`
}
