import { createApp } from './app'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { Component, ContextProps } from './types'

let app: ReturnType<typeof createApp>
const { hydrationPromise } = useClientRouter({
  render({ Page, contextProps }: { Page: Component; contextProps: ContextProps }) {
    if (!app) {
      app = createApp(Page, contextProps)
      app.mount('#app')
    } else {
      app.changePage(Page, contextProps)
    }
    document.title = contextProps.docTitle || 'Demo'
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
