import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'

export { createApp }

function createApp(Page, contextProps) {
  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, contextProps.pageProps || {})
          }
        }
      )
    }
  }

  const app = createSSRApp(PageWithLayout)

  // We make `contextProps.routeParams` available in all components as
  // `this.$routeParams` (e.g. `this.$routeParams.movieId` for a Route
  // String `/movie/:movieId`).
  app.config.globalProperties.$routeParams = contextProps.routeParams

  return app
}
