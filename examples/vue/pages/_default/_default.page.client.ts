import { createApp } from './app'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { Component, PageContext } from './types'

let app: ReturnType<typeof createApp>
const { hydrationPromise } = useClientRouter({
  render({ Page, pageContext }: { Page: Component; pageContext: PageContext }) {
    if (!app) {
      app = createApp(Page, pageContext)
      app.mount('#app')
    } else {
      app.changePage(Page, pageContext)
    }
    document.title = pageContext.docTitle || 'Demo'
  },
  onTransitionStart,
  onTransitionEnd
})

hydrationPromise.then(() => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
function onTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
