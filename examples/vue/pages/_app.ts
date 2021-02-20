import { createSSRApp, defineComponent, h } from 'vue'
import PageLayout from '../components/PageLayout/PageLayout.vue'

export { getApp }
export { InitialProps }

type InitialProps = {
  title?: string
}

function getApp(Page: any, initialProps: InitialProps) {
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, initialProps)
          }
        }
      )
    }
  })
  const app = createSSRApp(PageWithLayout)
  return app
}
