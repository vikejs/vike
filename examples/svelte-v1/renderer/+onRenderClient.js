import Layout from './Layout.svelte'

export default function onRenderClient(pageContext) {
  const target = document.getElementById('app')

  const { Page, pageProps } = pageContext

  new Layout({
    target,
    hydrate: true,
    props: {
      pageProps: pageProps,
      Page
    }
  })
}
