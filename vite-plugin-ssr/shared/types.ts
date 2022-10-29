import type { PageContextUrls } from './addComputedUrlProps'

export type PageContextBuiltIn<Page = any> = {
  /** The `export { Page }` of your `.page.js` file, see https://vite-plugin-ssr.com/Page */
  Page: Page
  /** Route Parameters, e.g. `pageContext.routeParams.productId` for a Route String `/product/@productId`, see https://vite-plugin-ssr.com/route-string */
  routeParams: Record<string, string>
  /** Custom Exports/Hooks, see https://vite-plugin-ssr.com/exports */
  exports: Record<string, unknown>
  /** Same as `pageContext.exports` but cumulative */
  exportsAll: Record<string, { exportValue: unknown }[]>
  /** @deprecated Don't use. */
  url: string
  /** The URL of the current page */
  urlOriginal: string
  /** If an error occurs, whether the error is a `404 Page Not Found` or a `500 Internal Server Error`, see https://vite-plugin-ssr.com/error-page */
  is404?: boolean
  /** @deprecated do not use */
  pageExports: Record<string, unknown>
} & PageContextUrls
