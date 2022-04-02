import React from 'react'
import { usePageContext } from '../hooks/usePageContext'

export { Link }

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function Link(props: AnchorProps) {
  const pageContext = usePageContext()
  const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ')
  return <a {...props} className={className} />
}
