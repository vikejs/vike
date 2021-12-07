import 'vite-plugin-ssr';

declare module "vite-plugin-ssr" {
  namespace VitePluginSsr {
    interface PageContextInit {}

    // Is it possible to also support `pageContext` on the browser-side by doing something like the following?
    interface PassToClient {
      value: 'pageProps' | 'documentProps'
    }

    interface OnBeforeRender {
      pageContext?: {
        something: number,
      }
    }
  }
}
