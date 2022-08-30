export { render }

import { render as solidRender } from 'solid-js/web'
import type { PageContextClient } from './types'

async function render(pageContext: PageContextClient) {
  const { Page } = pageContext
  return solidRender(() => <Page />, document.getElementById('root') as HTMLElement)
}
