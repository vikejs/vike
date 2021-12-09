import 'vite-plugin-ssr'

declare module 'vite-plugin-ssr' {
  namespace VitePluginSsr {
    interface OnInit {
      pageContext: {
        pageExports: {
          documentProps?: {
            title: string
          }
        }
        user: {
          id: number
          name: string
        }
      }
    }

    // Is it possible to also support `pageContext` on the browser-side by doing something like the following?
    interface PassToClient {
      value: 'pageProps' | 'documentProps'
    }

    interface OnBeforeRender {
      pageContext?: {
        documentProps?: {
          title: string
        }
      }
    }
  }
}
