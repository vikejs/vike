export { CommunityNote }

import React from 'react'
import { assert, Contribution, usePageContext } from '@brillout/docpress'
import { getEditLink } from '../utils'

function CommunityNote({ tool, url }: { tool: string; url: string }) {
  // assert((tool && url), 'The `tool` and `url` props are required and cannot be undefined',)
  const pageContext = usePageContext()
  return (
    <>
      Community-led documentation about using <a href={url || '#'}>{tool || pageContext.pageTitle}</a> with Vike.
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
