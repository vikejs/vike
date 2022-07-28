import type { PageContextUrls } from './addComputedUrlProps'

export type PageContextBuiltIn = {
  /** The `export { Page }` of your `.page.js` file, see https://vite-plugin-ssr.com/Page */
  Page: any
  /** Route Parameters, e.g. `pageContext.routeParams.productId` for a Route String `/product/@productId`, see https://vite-plugin-ssr.com/route-string */
  routeParams: Record<string, string>
  /** Custom Exports/Hooks, see https://vite-plugin-ssr.com/exports */
  exports: Record<string, unknown>
  /** Same as `pageContext.exports` but cumulative */
  exportsAll: Record<string, { exportValue: unknown }[]>
  /** The URL of the current page */
  url: string
  /** Outdated, do not use */
  pageExports: Record<string, unknown>
} & PageContextUrls
