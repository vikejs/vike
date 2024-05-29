export { UiFrameworkVikeExtension }
export { UiFrameworkVikeExtensionNames }

import React from 'react'
import { Link } from '@brillout/docpress'

function UiFrameworkVikeExtension({ plural, noLink }: { plural?: true; noLink?: true }) {
  const linkText = `Vike extension${plural ? 's' : ''}`
  const linkOrText = noLink ? linkText : <Link href="/extensions">{linkText}</Link>
  return (
    <>
      UI framework {linkOrText} (<UiFrameworkVikeExtensionNames links={!noLink} />)
    </>
  )
}
function UiFrameworkVikeExtensionNames({
  links,
  list = ['vike-react', 'vike-vue', 'vike-solid']
}: { links?: boolean; list?: `vike-${'react' | 'vue' | 'solid'}`[] }) {
  return (
    <>
      {list.map((name, i) => {
        let content = <code>{name}</code>
        if (links) content = <Link href={`/${name}`}>{content}</Link>
        if (i !== list.length - 1) {
          content = <>{content}/</>
        }
        return <React.Fragment key={name}>{content}</React.Fragment>
      })}
    </>
  )
}
