import { IPageContext } from '#/types'

export function getPageSEO(pageContext: IPageContext): [string, string] {
  console.log(pageContext?.config)
  const { title: staticTitle, description: staticDesc } = (pageContext?.config?.documentProps as any) || {}
  const { title: dynamicTitle, description: dynamicDesc } = pageContext?.documentProps || {}
  const title = staticTitle || dynamicTitle || 'Title'
  const description = staticDesc || dynamicDesc || 'Description'

  return [title, description]
}
