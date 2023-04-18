import { usePageContext } from './usePageContext'

export function Link(props: { href: string; children: string }) {
  const pageContext = usePageContext()
  const isActive = () =>
    props.href === '/' ? pageContext.urlPathname === props.href : pageContext.urlPathname.startsWith(props.href)
  const classNames = () => ['navitem', isActive() ? 'is-active' : null].filter(Boolean).join(' ')
  return (
    <a href={props.href} class={classNames()}>
      {props.children}
    </a>
  )
}
