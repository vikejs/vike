export { CommunityNote }

import React from 'react'
import { assert, Contribution, usePageContext } from '@brillout/docpress'
import { getEditLink } from '../utils'

function CommunityNote({ url }: { url: string }) {
  assert(url, 'The `url` prop are required and cannot be undefined')
  const pageContext = usePageContext()
  return (
    <>
      Community-led documentation about using <a href={url || '#'}>{pageContext.pageTitle}</a> with Vike.
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
