export type { Config }

// TODO: write docs of links below

import type { ConfigValueEnv } from './PageConfig'

/** Page configuration, see https://vite-plugin-ssr.com/config */
type Config<Page = unknown> = Partial<{
  /** The root UI component of the page */
  Page: Page
  /** The page's route */
  route: string | Function

  /** Hook called before the page is rendered, usually used for fetching data, see https://vite-plugin-ssr.com/onbeforeRender */
  onBeforeRender: Function

  /** Determine what properties of pageContext are sent to the client-side */
  passToClient: string[]

  /** Whether to pre-render the page, see https://vite-plugin-ssr.com/pre-rendering */
  prerender: boolean

  /** Hook called when page is rendered on the client-side, see https://vite-plugin-ssr.com/onRenderClient */
  onRenderClient: Function
  /** Hook called when page is rendered to HTML, see https://vite-plugin-ssr.com/onRenderClient */
  onRenderHtml: Function

  /** Enable async Route Functions, see https://vite-plugin-ssr.com/route-function#async */
  iKnowThePerformanceRisksOfAsyncRouteFunctions: boolean

  onPrerenderStart: Function
  onBeforePrerenderStart: Function

  onBeforeRoute: Function

  onHydrationEnd: Function
  onPageTransitionStart: Function
  onPageTransitionEnd: Function

  isErrorPage: boolean
  hydrationCanBeAborted: boolean
  clientEntry: string
  clientRouting: boolean

  /** Add or modify config definitions, see https://vite-plugin-ssr/meta */
  meta: Record<
    string,
    {
      /** Where code is loaded and executed, see https://vite-plugin-ssr/meta */
      env: ConfigValueEnv
      /**
       * Define a so-called "Shortcut Config", see https://vite-plugin-ssr/meta#shortcuts
       */
      effect?: (args: {
        /** Place where the resolved config value comes from, see https://vite-plugin-ssr/meta */
        configDefinedAt: string
        /** The resolved config value, see https://vite-plugin-ssr/meta */
        configValue: unknown
      }) => Config | undefined
    }
  >
}>
