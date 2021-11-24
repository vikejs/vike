import React from 'react'
import { usePageContext } from './usePageContext'

export { Link }

function Link({ href, children }: { href: string; children: string }) {
  const pageContext = usePageContext()
  const className = ['navigation-link', pageContext.urlPathname === href && 'is-active'].filter(Boolean).join(' ')
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
