import { createSignal } from 'solid-js'
import { hydrate } from 'solid-js/web'
import { useClientRouter } from 'vite-plugin-ssr/client/router'
import { PageLayout, type Route } from './PageLayout'

let layoutReady = false

// Central signal to track the current active route.
const [route, setRoute] = createSignal<Route | null>(null)

const { hydrationPromise } = useClientRouter({
  render(pageContext) {
    const content = document.getElementById('page-view')
    const { Page, pageProps } = pageContext

    // Set the new route.
    setRoute({ Page, pageProps })

    // If haven't rendered the layout yet, do so now.
    if (!layoutReady) {
      // Render the page.
      // This is the first page rendering; the page has been rendered to HTML
      // and we now make it interactive.
      hydrate(() => <PageLayout route={() => route()} />, content!)
      layoutReady = true
    }
  },
  onTransitionStart,
  onTransitionEnd,
})

hydrationPromise.then((s) => {
  console.log('Hydration finished; page is now interactive.')
})

function onTransitionStart() {
  console.log('Page transition start')
}
function onTransitionEnd() {
  console.log('Page transition end')
}
