import React from 'react'

export { Link }

function Link({ href, children }) {
  const base = import.meta.env.BASE_URL
  if (!href.startsWith('/')) throw new Error('Link href should start with /')
  href = href.slice(1) // We remove the leading '/'
  return <a href={base + href}>{children}</a>
}
