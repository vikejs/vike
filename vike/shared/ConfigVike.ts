export type { ConfigVikeUserProvided }
export type { ConfigVikeResolved }

// TODO/v1-release: remove all this

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
}

type ConfigVikeUserProvided = {
  /**
   * @deprecated Define `prerender` options in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/prerender-config
   */
  prerender?:
    | boolean
    | {
        noExtraDir?: boolean
        parallel?: boolean | number
        partial?: boolean
        disableAutoRun?: boolean
      }

  /**
   * @deprecated Define the `disableAutoFullBuild` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/disableAutoFullBuild
   */
  disableAutoFullBuild?: boolean

  /**
   * @deprecated Define the `baseServer` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/base-url
   */
  baseServer?: string
  /**
   * @deprecated Define the `baseAssets` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/base-url
   */
  baseAssets?: string

  // We don't remove this option in case there is a bug with includeAssetsImportedByServer and the user needs to disable it.
  /** @deprecated It's now `true` by default. You can remove this option. */
  includeAssetsImportedByServer?: boolean

  /**
   * @deprecated Define the `redireects` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/redirects
   */
  redirects?: Record<string, string>

  /**
   * @deprecated Define the `trailingSlash` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/url-normalization
   */
  trailingSlash?: boolean

  /**
   * @deprecated Define the `disableUrlNormalization` option in `vike.config.js` (instead of `+config.h.js`).
   *
   * https://vike.dev/url-normalization
   */
  disableUrlNormalization?: boolean
}
