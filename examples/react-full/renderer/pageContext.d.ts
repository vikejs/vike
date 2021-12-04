import 'vite-plugin-ssr';

declare module "vite-plugin-ssr" {
  namespace VitePluginSsr {
    interface PageContextInit {
      pageExports: {
        documentProps?: {
          title: string
        }
      }
    }

    // Is it possible to also support `pageContext` on the browser-side by doing something like the following?
    interface PassToClient {
      value: 'pageProps' | 'documentProps'
    }

    interface PageContextOnBeforeRender {
      documentProps?: {
        title: string
      }
    }
  }
}
