import React from 'react'
import { usePageContext } from '../hooks/usePageContext'

export { Link }

function Link(props: any) {
  const pageContext = usePageContext() as any
  const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ')
  return <a {...props} className={className} />
}
