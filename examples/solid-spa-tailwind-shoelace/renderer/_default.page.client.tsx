import { render as solidRender } from 'solid-js/web'
import { PageContext } from './types'

// importing tailwind, shoelace components and shoelace's default css
import './style.css'
import '@shoelace-style/shoelace'
import '@shoelace-style/shoelace/dist/themes/light.css'

export async function render(pageContext: PageContext) {
  const { Page } = pageContext

  return solidRender(() => <Page />, document.getElementById('root') as HTMLElement)
}
