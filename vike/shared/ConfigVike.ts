export type { ConfigVikeUserProvided }
export type { ConfigVikeResolved }
export type { ServerResolved }

type ServerUserProvided = string | { entry: string | { index: string; [name: string]: string } }
type ServerResolved = null | { entry: { index: string; [name: string]: string } }

type ConfigVikeResolved = {
  prerender:
    | false
    | {
        noExtraDir: boolean
        parallel: boolean | number
        partial: boolean
        disableAutoRun: boolean
      }
  disableAutoFullBuild: boolean | null
  includeAssetsImportedByServer: boolean
  baseAssets: string
  baseServer: string
  redirects: Record<string, string>
  trailingSlash: boolean
  disableUrlNormalization: boolean
  native: string[]
  server: ServerResolved
  standalone: boolean
}

type ConfigVikeUserProvided = {
  /**
   * Enable pre-rendering.
   *
   * https://vike.dev/pre-rendering
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
         * https://vike.dev/prerender-programmatic
         *
         * @default false
         */
        disableAutoRun?: boolean
      }

  /**
   * Set to `true` to disable the automatic chaining of all the build steps.
   *
   * https://vike.dev/disableAutoFullBuild
   *
   * @default false
   */
  disableAutoFullBuild?: boolean

  /** The Base URL of your server.
   *
   * https://vike.dev/base-url
   */
  baseServer?: string
  /** The Base URL of your static assets.
   *
   * https://vike.dev/base-url
   */
  baseAssets?: string

  // We don't remove this option in case there is a bug with includeAssetsImportedByServer and the user needs to disable it.
  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  /** Permanent redirections (HTTP status code 301)
   *
   * https://vike.dev/redirects
   */
  redirects?: Record<string, string>

  /** Whether URLs should end with a trailing slash.
   *
   * https://vike.dev/url-normalization
   *
   * @default false
   */
  trailingSlash?: boolean

  /** Disable automatic URL normalization.
   *
   * https://vike.dev/url-normalization
   *
   * @default false
   */
  disableUrlNormalization?: boolean

  /** Server entry path.
   *
   */
  server?: ServerUserProvided

  /** Enable standalone build.
   *  Setting `server` is required.
   *
   * @default false
   */
  standalone?: boolean

  /** List of native dependencies.
   *
   */
  native?: string[]
}
