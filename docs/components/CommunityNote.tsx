export { CommunityNote }

import React from 'react'
import { assert, Contribution, usePageContext } from '@brillout/docpress'

function CommunityNote({ url }: { url: string }) {
  assert(url, 'The `url` prop is required')
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
    </>
  )
}

function getEditLink(path?: string) {
  return `https://github.com/vikejs/vike/blob/main/docs/pages${path}/%2BPage.mdx?plain=1`
}
