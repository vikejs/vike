export { Link }

import { usePageContext } from '@brillout/stem-react'
import React from 'react'

function Link({ href, children }: { href: string; children: string }) {
  const pageContext = usePageContext() as { urlPathname: string } // TODO
  return (
    <a href={href} className={pageContext.urlPathname.startsWith(href) ? 'is-active' : undefined}>
      {children}
    </a>
  )
}
