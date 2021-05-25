import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { createApp }

function createApp(Page, pageContext) {
  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageContext.pageProps || {})
          }
        }
      )
    }
  }

  const app = createSSRApp(PageWithLayout)

  // We make `pageContext.routeParams` available in all components as `$routeParams`
  // (e.g. `$routeParams.movieId` for a Route String `/movie/:movieId`).
  app.config.globalProperties.$routeParams = pageContext.routeParams

  return app
}
