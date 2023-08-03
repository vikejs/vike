import React from 'react'

export { Link }

function Link({ href, children }) {
  if (!href.startsWith('/')) throw new Error('Link href should start with /')
  href = import.meta.env.BASE_URL + href
  href = normalize(href)
  return <a href={href}>{children}</a>
}
function normalize(url) {
  return '/' + url.split('/').filter(Boolean).join('/')
}
