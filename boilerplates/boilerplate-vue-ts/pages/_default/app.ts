import { createSSRApp, defineComponent, h } from 'vue'
import PageLayout from './PageLayout.vue'
import { ContextProps } from './types'

export { createApp }

function createApp(Page: any, contextProps: ContextProps) {
  const PageWithLayout = defineComponent({
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
  })

  const app = createSSRApp(PageWithLayout)

  // We make `contextProps.routeParams` available in all components as `$routeParams`
  // (e.g. `$routeParams.movieId` for a Route String `/movie/:movieId`).
  app.config.globalProperties.$routeParams = contextProps.routeParams

  return app
}
