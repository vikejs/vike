export { UiFrameworkExtension }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkExtension({
  plural,
  noLink,
  name,
  links,
  list = ['vike-react', 'vike-vue', 'vike-solid'],
  comma
}: {
  plural?: true
  noLink?: true
  name?: boolean
  links?: boolean
  list?: `vike-${'react' | 'vue' | 'solid'}`[]
  comma?: true
}) {
  links = name ? links : !noLink
  let content = (
    <>
      {list.map((name, i) => {
        let content = <code>{name}</code>
        if (links) content = <Link href={`/${name}`}>{content}</Link>
        const isLast1 = i === list.length - 1
        const isLast2 = i === list.length - 2
        if (!isLast1) {
          let sep = '/'
          if (comma) {
            if (isLast2) {
              sep = ', or '
            } else {
              sep = ', '
            }
          }
          content = (
            <>
              {content}
              {sep}
            </>
          )
        }
        return <React.Fragment key={name}>{content}</React.Fragment>
      })}
    </>
  )

  if (!name) {
    const linkText = `Vike extension${plural ? 's' : ''}`
    const linkOrText = noLink ? linkText : <Link href="/extensions">{linkText}</Link>
    content = (
      <>
        UI framework {linkOrText} {content}
      </>
    )
  }
  return content
}
