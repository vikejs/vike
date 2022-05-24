export { assertViteConfig }
export { assertAndMergeUserInput }
export type { VpsConfig }

import { assert, assertUsage, hasProp, isObject } from '../../../utils'

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
  disableBuildChaining?: boolean
}

function assertAndMergeUserInput(fromPluginOptions: unknown, fromViteConfig: unknown): VpsConfig {
  assertVpsConfig(
    fromPluginOptions,
    ({ configPathInObject, configProp }) =>
      `[vite.config.js][ssr({ ${configPathInObject} })] Configuration \`${configProp}\``,
  )
  assertVpsConfig(fromViteConfig, ({ configPath }) => `vite.config.js#vitePluginSsr.${configPath}`)
  const vitePluginSsr: VpsConfig = {}

  vitePluginSsr.disableBuildChaining =
    fromPluginOptions.disableBuildChaining ?? fromViteConfig.disableBuildChaining ?? false

  vitePluginSsr.prerender = false
  if (fromPluginOptions.prerender || fromViteConfig.prerender) {
    const prerenderUserOptions =
      typeof fromPluginOptions.prerender === 'boolean' ? {} : fromPluginOptions.prerender ?? {}
    const prerenderViteConfig = typeof fromViteConfig.prerender === 'boolean' ? {} : fromViteConfig.prerender ?? {}
    vitePluginSsr.prerender = {
      partial: prerenderUserOptions.partial ?? prerenderViteConfig.partial ?? false,
      noExtraDir: prerenderUserOptions.noExtraDir ?? prerenderViteConfig.noExtraDir ?? false,
      parallel: prerenderUserOptions.parallel ?? prerenderViteConfig.parallel ?? undefined,
    }
  }

  vitePluginSsr.pageFiles = {
    include: [...(fromPluginOptions.pageFiles?.include ?? []), ...(fromViteConfig.pageFiles?.include ?? [])],
  }

  assertVpsConfig(vitePluginSsr, null)
  return vitePluginSsr
}

function assertVpsConfig(
  vitePluginSsr: unknown,
  userInputFormat: null | ((args: { configPath: string; configPathInObject: string; configProp: string }) => string),
): asserts vitePluginSsr is VpsConfig {
  assert(isObject(vitePluginSsr))
  assertConfig(
    'disableBuildChaining',
    'should be a boolean (or undefined)',
    hasProp(vitePluginSsr, 'disableBuildChaining', 'boolean') ||
      hasProp(vitePluginSsr, 'disableBuildChaining', 'undefined'),
  )
  assertPageFilesConfig(vitePluginSsr)
  assertPrerenderConfig(vitePluginSsr)

  return

  function assertPrerenderConfig(
    vitePluginSsr: Record<string, unknown>,
  ): asserts vitePluginSsr is Pick<VpsConfig, 'prerender'> {
    assertConfig(
      'prerender',
      'should be an object or a boolean (or undefined)',
      hasProp(vitePluginSsr, 'prerender', 'object') ||
        hasProp(vitePluginSsr, 'prerender', 'boolean') ||
        hasProp(vitePluginSsr, 'prerender', 'undefined'),
    )

    const prerender = vitePluginSsr.prerender ?? {}
    if (prerender && typeof prerender !== 'boolean') {
      assertConfig(
        'prerender.partial',
        'should be a boolean (or undefined)',
        hasProp(prerender, 'partial', 'undefined') || hasProp(prerender, 'partial', 'boolean'),
      )
      assertConfig(
        'prerender.noExtraDir',
        'should be a boolean (or undefined)',
        hasProp(prerender, 'noExtraDir', 'undefined') || hasProp(prerender, 'noExtraDir', 'boolean'),
      )
      assertConfig(
        'prerender.parallel',
        'should be a boolean or a number (or undefined)',
        hasProp(prerender, 'parallel', 'undefined') ||
          hasProp(prerender, 'parallel', 'boolean') ||
          hasProp(prerender, 'parallel', 'number'),
      )
    }
  }

  function assertPageFilesConfig(
    vitePluginSsr: Record<string, unknown>,
  ): asserts vitePluginSsr is Pick<VpsConfig, 'pageFiles'> {
    assertConfig(
      'pageFiles',
      'should be an object (or undefined)',
      hasProp(vitePluginSsr, 'pageFiles', 'undefined') || hasProp(vitePluginSsr, 'pageFiles', 'object'),
    )
    if (!vitePluginSsr.pageFiles) {
      return
    }
    if (vitePluginSsr.pageFiles?.include !== undefined) {
      assertConfig(
        'pageFiles.include',
        'should be a string array (or undefined)',
        hasProp(vitePluginSsr.pageFiles, 'include', 'string[]'),
      )
    }
  }

  function assertConfig(configPath: string, errMsg: string, condition: boolean): asserts condition {
    if (!userInputFormat) {
      assert(condition)
    } else {
      const p = configPath.split('.')
      assert(p.length <= 2)
      const configPathInObject = p.length === 2 ? `${p[0]}: { ${p[1]} }` : configPath
      const configProp = p[p.length - 1]
      assert(configProp)
      assertUsage(condition, `${userInputFormat({ configPath, configPathInObject, configProp })} ${errMsg}.`)
    }
  }
}

function assertViteConfig<T extends Record<string, unknown>>(
  viteConfig: T,
): asserts viteConfig is T & { vitePluginSsr: VpsConfig } {
  assert(hasProp(viteConfig, 'vitePluginSsr', 'object'))
  const { vitePluginSsr } = viteConfig
  assertVpsConfig(vitePluginSsr, null)
}
