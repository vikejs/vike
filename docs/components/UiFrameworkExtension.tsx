export { UiFrameworkExtension }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkExtension({
  name,
  noLink,
  plural,
  comma,
  list = ['vike-react', 'vike-vue', 'vike-solid']
}: {
  name?: true
  noLink?: true
  plural?: true
  comma?: true
  list?: `vike-${'react' | 'vue' | 'solid'}`[]
}) {
  let content = (
    <>
      {list.map((name, i) => {
        let content = <code>{name}</code>
        if (!noLink) content = <Link href={`/${name}`}>{content}</Link>
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
