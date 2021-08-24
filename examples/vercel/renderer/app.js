import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { createApp }

function createApp(pageContext) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageProps || {})
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
