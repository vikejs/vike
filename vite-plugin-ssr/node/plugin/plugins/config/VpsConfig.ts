export type { VpsConfig }

type VpsConfig = {
  /**
   * Whether your pages are pre-rendered to HTML.
   *
   * @default false
   */
  prerender?:
    | boolean
    | {
        /**
         * If `true` then pre-rendering generates `some-path.html` instead of `some-path/index.html`.
         *
         * @default false
         */
        noExtraDir?: boolean
        /**
         * Number of concurrent pre-rendering jobs.
         *
         * Set to `false` to disable concurrency.
         *
         * @default os.cpus().length
         */
        parallel?: boolean | number
        /**
         * Allow only some of your pages to be pre-rendered.
         *
         * If `false`, then vite-plugin-ssr displays a warning when some pages are not pre-rendered.
         *
         * This setting doesn't affect the pre-rendering process: setting it to `true` only suppresses the warning.
         *
         * @default false
         */
        partial?: boolean
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
  buildOnlyPageFiles?: boolean
  /**
   * @internal
   * Do not use without having talked to a vite-plugin-ssr maintainer.
   */
  disableBuildChaining?: boolean
}

