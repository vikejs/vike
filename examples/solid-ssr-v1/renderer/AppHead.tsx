import type { ParentComponent } from 'solid-js'

import type { IPageContext } from '#/types'
import { getPageSEO } from '#/lib/seo'
import { PageContext } from '#/composables/usePageContext'

type Props = {
  pageContext: IPageContext
}

export const AppHead: ParentComponent<Props> = ({ pageContext, children }) => {
  const [title, description] = getPageSEO(pageContext)

  return (
    <PageContext.Provider value={pageContext}>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta httpEquiv="Accept-CH" content="Accept, DPR, Viewport-Width, ECT, Width, Save-Data" />
      <meta name="supported-color-schemes" content="light dark" />
      <meta name="color-scheme" content="light" />
      <meta name="theme-color" content="rgb(250, 250, 250)" />
      {children}
    </PageContext.Provider>
  )
}
