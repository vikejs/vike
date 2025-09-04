export { UiFrameworkExtension }
export type { UiFrameworkExtensionList }

import React from 'react'
import { assert, Link } from '@brillout/docpress'

type UiFrameworkExtensionList = `vike-${'react' | 'vue' | 'solid'}`[]
const extensionList: UiFrameworkExtensionList = ['vike-react', 'vike-vue', 'vike-solid']

// TO-DO/docs: refactor this component
function UiFrameworkExtension({
  name,
  noLink,
  succinct,
  plural,
  comma,
  list = extensionList,
}: {
  succinct?: true
  name?: true
  noLink?: true
  plural?: true
  comma?: true
  list?: UiFrameworkExtensionList
}) {
  if (succinct) return <code>{'vike-{react,vue,solid}'}</code>
  let content = (
    <>
      {list.map((name, i) => {
        assert(list.includes(name))
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
