export { render }

import { render as renderSolid } from 'solid-js/web'
import type { PageContextClient } from './types'

async function render(pageContext: PageContextClient) {
  const { Page } = pageContext
  return renderSolid(() => <Page />, document.getElementById('root') as HTMLElement)
}
