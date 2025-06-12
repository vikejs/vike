import { createVueApp } from './createVueApp'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type {
  //*
  // When using Client Routing https://vike.dev/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from 'vike/types'

export const clientRouting = true
export const prefetchStaticAssets = 'viewport'
export { render }
export { onHydrationEnd }
export { onPageTransitionStart }
export { onPageTransitionEnd }

let app: ReturnType<typeof createVueApp>
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  if (!app) {
    app = createVueApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
  document.title = getPageTitle(pageContext)
}

function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
function onPageTransitionStart() {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
function onPageTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
