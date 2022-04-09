export { assertViteConfig }
export { assertAndMergeUserInput }
export type { VpsConfig }

import { assert, assertUsage, hasProp, isObject } from '../../../utils'

type VpsConfig = {
  pageFiles?: { include?: string[] }
  prerender?:
    | boolean
    | {
        partial?: boolean
        noExtraDir?: boolean
        parallel?: number
      }
  disableBuildChaining?: boolean
}

function assertAndMergeUserInput(fromUserConfig: unknown, fromViteConfig: unknown): VpsConfig {
  assertVpsConfig(fromUserConfig, (prop: string) => `[vite.config.js][\`ssr({ ${prop} })\`] \`${prop}\``)
  assertVpsConfig(fromViteConfig, (prop: string) => `vite.config.js#vitePluginSsr.${prop}`)
  const vitePluginSsr: VpsConfig = {}

  vitePluginSsr.disableBuildChaining =
    fromUserConfig.disableBuildChaining ?? fromViteConfig.disableBuildChaining ?? false

  vitePluginSsr.prerender = false
  if (fromUserConfig.prerender || fromViteConfig.prerender) {
    const prerenderUserOptions = typeof fromUserConfig.prerender === 'boolean' ? {} : fromUserConfig.prerender ?? {}
    const prerenderViteConfig = typeof fromViteConfig.prerender === 'boolean' ? {} : fromViteConfig.prerender ?? {}
    vitePluginSsr.prerender = {
      partial: prerenderUserOptions.partial ?? prerenderViteConfig.partial ?? false,
      noExtraDir: prerenderUserOptions.noExtraDir ?? prerenderViteConfig.noExtraDir ?? false,
      parallel: prerenderUserOptions.parallel ?? prerenderViteConfig.parallel ?? undefined,
    }
  }

  vitePluginSsr.pageFiles = {
    include: [...(fromUserConfig.pageFiles?.include ?? []), ...(fromViteConfig.pageFiles?.include ?? [])],
  }

  assertVpsConfig(vitePluginSsr, null)
  return vitePluginSsr
}

function assertVpsConfig(
  vitePluginSsr: unknown,
  userInputFormat: null | ((prop: string) => string),
): asserts vitePluginSsr is VpsConfig {
  assert(isObject(vitePluginSsr))
  assertInput(
    'disableBuildChaining',
    'should be a boolean (or undefined)',
    hasProp(vitePluginSsr, 'disableBuildChaining', 'boolean') ||
      hasProp(vitePluginSsr, 'disableBuildChaining', 'undefined'),
  )
  assertPageFilesConfig(vitePluginSsr)
  assertPrerenderConfig(vitePluginSsr)

  type T1 = VpsConfig
  type T2 = typeof vitePluginSsr
  ;(t: T1) => ((_: T2) => {})(t)
  ;(t: T2) => ((_: T1) => {})(t)
  ;(t: DeepRequired<T2>) => ((_: DeepRequired<T1>) => {})(t)
  ;(t: DeepRequired<T1>) => ((_: DeepRequired<T2>) => {})(t)

  return

  type PrerenderConfig = Pick<VpsConfig, 'prerender'>
  function assertPrerenderConfig(vitePluginSsr: Record<string, unknown>): asserts vitePluginSsr is PrerenderConfig {
    assertInput(
      'prerender',
      'should be an object or a boolean',
      hasProp(vitePluginSsr, 'prerender', 'object') ||
        hasProp(vitePluginSsr, 'prerender', 'boolean') ||
        hasProp(vitePluginSsr, 'prerender', 'undefined'),
    )

    const prerender = vitePluginSsr.prerender ?? {}
    if (prerender && typeof prerender !== 'boolean') {
      assertInput(
        'prerender.partial',
        'should be a boolean (or undefined)',
        hasProp(prerender, 'partial', 'undefined') || hasProp(prerender, 'partial', 'boolean'),
      )
      assertInput(
        'prerender.noExtraDir',
        'should be a boolean (or undefined)',
        hasProp(prerender, 'noExtraDir', 'undefined') || hasProp(prerender, 'noExtraDir', 'boolean'),
      )
      assertInput(
        'prerender.parallel',
        'should be a number (or undefined)',
        hasProp(prerender, 'parallel', 'undefined') || hasProp(prerender, 'parallel', 'number'),
      )
    }
  }

  type PageFilesConfig = Pick<VpsConfig, 'pageFiles'>
  function assertPageFilesConfig(vitePluginSsr: Record<string, unknown>): asserts vitePluginSsr is PageFilesConfig {
    assertInput(
      'pageFiles',
      'should be an object (or undefined)',
      hasProp(vitePluginSsr, 'pageFiles', 'undefined') || hasProp(vitePluginSsr, 'pageFiles', 'object'),
    )
    if (!vitePluginSsr.pageFiles) {
      return
    }
    if (vitePluginSsr.pageFiles?.include !== undefined) {
      assertInput(
        'pageFiles.include',
        'should be a string array (or undefined)',
        hasProp(vitePluginSsr.pageFiles, 'include', 'string[]'),
      )
    }
  }

  function assertInput(prop: string, errMsg: string, condition: boolean): asserts condition {
    if (!userInputFormat) {
      assert(condition)
    } else {
      assertUsage(condition, `${userInputFormat(prop)} ${errMsg}`)
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

type DeepRequired<T> = Required<T> & { [K in keyof T]: NonNullable<DeepRequired<T[K]>> }
