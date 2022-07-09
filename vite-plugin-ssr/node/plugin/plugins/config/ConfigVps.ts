export type { ConfigVpsUser }
export type { ConfigVpsResolved }
//export type ConfigVps = { vitePluginSsr: VpsConfig }

type ConfigVpsResolved = {
  prerender:
    | false
    | {
        noExtraDir: boolean
        parallel: boolean | number
        partial: boolean
        disableAutoRun: boolean
      }
  pageFiles: { include: string[] }
  disableAutoBuild: boolean
  includeCSS: string[]
  includeAssetsImportedByServer: boolean
}

type ConfigVpsUser = {
  /**
   * Whether your pages are pre-rendered to HTML.
   *
   * @default false
   */
  prerender?:
    | boolean
    | {
        /**
         * Do not create a new directory for each HTML file.
         *
         * For example, generate `dist/client/about.html` instead of `dist/client/about/index.html`.
         *
         * @default false
         */
        noExtraDir?: boolean
        /**
         * Number of concurrent pre-render jobs.
         *
         * Set to `false` to disable concurrency.
         *
         * @default os.cpus().length
         */
        parallel?: boolean | number
        /**
         * Allow only some of your pages to be pre-rendered.
         *
         * This setting doesn't affect the pre-rendering process: it merely suppresses the warnings when some of your pages cannot be pre-rendered.

         * @default false
         */
        partial?: boolean
        /**
         * Disable the automatic initiation of the pre-rendering process when running `$ vite build`.
         *
         * Use this if you want to programmatically initiate the pre-rendering process instead.
         *
         * See https://vite-plugin-ssr.com/prerender-call
         *
         * @default false
         */
        disableAutoRun?: boolean
      }
  /**
   * @internal
   * Do not use without having talked to a vite-plugin-ssr maintainer.
   */
  pageFiles?: { include?: string[] }
  /**
   * @internal
   * Do not use without having talked to a vite-plugin-ssr maintainer.
   */
  disableAutoBuild?: boolean
  /**
   * @internal
   * Do not use without having talked to a vite-plugin-ssr maintainer.
   */
  includeCSS?: string[]
  /**
   * Add assets (CSS, images, etc.) imported by server-side code to the client-side build.
   *
   * Useful for HTML-only pages, see https://vite-plugin-ssr/render-modes#html-only
   *
   * @experimental
   */
  includeAssetsImportedByServer?: boolean
}
