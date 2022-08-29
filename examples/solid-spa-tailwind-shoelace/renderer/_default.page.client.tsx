import { render as solidRender } from 'solid-js/web'
import { PageContext } from './types'

export async function render(pageContext: PageContext) {
  const { Page } = pageContext

  return solidRender(() => <Page />, document.getElementById('root') as HTMLElement)
}
