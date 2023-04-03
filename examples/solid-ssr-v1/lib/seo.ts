import { IPageContext } from '#/types'

export function getPageSEO(pageContext: IPageContext): [string, string] {
  const { title: staticTitle, description: staticDesc } = pageContext?.exports?.props?.document || {}
  const { title: dynamicTitle, description: dynamicDesc } = pageContext?.documentProps || {}
  const title = staticTitle || dynamicTitle || 'Title'
  const description = staticDesc || dynamicDesc || 'Description'

  return [title, description]
}
