export type { ConfigVpsUserProvided }
export type { ConfigVpsResolved }
export type { ExtensionResolved }

type ExtensionUserProvided = {
  npmPackageName: string
  pageConfigsDistFiles?: string[]
  pageConfigsSrcDir?: string
  assetsDir?: string
  /** @deprecated */
  pageFilesDist?: string[]
  /** @deprecated */
  pageFilesSrc?: string
}
type ExtensionResolved = {
  npmPackageName: string
  npmPackageRootDir: string
  pageConfigsDistFiles:
    | null
    | {
        importPath: string
        filePath: string
      }[]
  pageConfigsSrcDir: null | string
  assetsDir: null | string
}

type ConfigVpsResolved = {
  prerender:
    | false
    | {
        noExtraDir: boolean
        parallel: boolean | number
        partial: boolean
        disableAutoRun: boolean
      }
  extensions: ExtensionResolved[]
  disableAutoFullBuild: boolean | null
  includeAssetsImportedByServer: boolean
  baseAssets: string
  baseServer: string
  redirects: Record<string, string>
}

type ConfigVpsUserProvided = {
  /**
   * Enable pre-rendering.
   *
   * https://vite-plugin-ssr.com/pre-rendering
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
         * https://vite-plugin-ssr.com/prerender-programmatic
         *
         * @default false
         */
        disableAutoRun?: boolean
      }

  /**
   * @beta
   * Don't use without having talked to a vite-plugin-ssr maintainer.
   */
  extensions?: ExtensionUserProvided[]
  /**
   * Set to `true` to disable the automatic chaining of all the build steps.
   *
   * https://vite-plugin-ssr.com/disableAutoFullBuild
   *
   * @default false
   */
  disableAutoFullBuild?: boolean

  /** The Base URL of your server.
   *
   * https://vite-plugin-ssr.com/base-url
   */
  baseServer?: string
  /** The Base URL of your static assets.
   *
   * https://vite-plugin-ssr.com/base-url
   */
  baseAssets?: string

  // We don't remove this option in case there is a bug with includeAssetsImportedByServer and the user needs to disable it.
  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  /** Permanent redirections (HTTP status code 301)
   *
   * https://vite-plugin-ssr.com/redirects
   */
  redirects?: Record<string, string>
}
