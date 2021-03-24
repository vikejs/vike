import { getApp } from './app'
import { useClientRouter } from 'vite-plugin-ssr/client/router'

let app: ReturnType<typeof getApp>
const { awaitInitialPageRender } = useClientRouter({
  render({ Page, pageProps }) {
    if (!app) {
      app = getApp(Page, pageProps)
      app.mount('#app')
    } else {
      app.changePage(Page, pageProps)
    }
    document.title = pageProps.docTitle || 'Demo'
  },
  onTransitionStart,
  onTransitionEnd
})

awaitInitialPageRender.then(() => {
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
