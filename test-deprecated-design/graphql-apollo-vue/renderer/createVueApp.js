import { createSSRApp, h, provide } from 'vue'
import Layout from './Layout.vue'
import { setPageContext } from './usePageContext'
export { createVueApp }
import { DefaultApolloClient } from '@vue/apollo-composable'

function createVueApp(pageContext, apolloClient) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = {
    setup() {
      provide(DefaultApolloClient, apolloClient)
    },
    render() {
      return h(
        Layout,
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

  // We make `pageContext` available from any Vue component
  setPageContext(app, pageContext)

  return app
}
