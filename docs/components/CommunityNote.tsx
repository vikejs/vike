export { CommunityNote }

import React from 'react'
import { Contribution, usePageContext } from '@brillout/docpress'
import { getEditLink } from '../utils';

function CommunityNote({ tool, url }: { tool?: string; url?: string }) {
  const pageContext = usePageContext();

  return (
    <>
      Community-led documentation about using <a href={url}>{tool}</a> with Vike.
      <Contribution>
        This page may contain outdated information, <a href={getEditLink(pageContext.urlPathname)}>PR welcome</a> to update or improve this page.
      </Contribution>
    </>
  )
}
