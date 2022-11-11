export type { ConfigVpsUserProvided }
export type { ConfigVpsResolved }

type ConfigVpsResolved = {
  prerender:
    | false
    | {
        noExtraDir: boolean
        parallel: boolean | number
        partial: boolean
        disableAutoRun: boolean
      }
  pageFiles: { include: string[]; includeDist: string[] }
  disableAutoFullBuild: boolean
  includeCSS: string[]
  includeAssetsImportedByServer: boolean
}

type ConfigVpsUserProvided = {
  /**
   * Whether your pages are pre-rendered to HTML.
   *
   * @default false
   */
  prerender?:
    | boolean
    | {
        /**
         * Don't create a new directory for each HTML file.
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
         * See https://vite-plugin-ssr.com/prerender-programmatic
         *
         * @default false
         */
        disableAutoRun?: boolean
      }
  /**
   * @internal
   * Don't use without having talked to a vite-plugin-ssr maintainer.
   */
  pageFiles?: { include?: string[]; includeDist?: string[] }
  /**
   * Set to `true` to disable the automatic chaining of all the build steps.
   *
   * See https://vite-plugin-ssr.com/disableAutoFullBuild
   *
   * @default false
   */
  disableAutoFullBuild?: boolean
  /**
   * @internal
   * Don't use without having talked to a vite-plugin-ssr maintainer.
   */
  includeCSS?: string[]
  /**
   * Support importing assets (CSS, images, etc.) from server code.
   *
   * See https://vite-plugin-ssr.com/includeAssetsImportedByServer
   *
   * @experimental
   */
  includeAssetsImportedByServer?: boolean
}
