export { resolvePageConfigsFromHooks }
export { rerunPageConfigsFromHooks }
export type { ResolveImport }

import fs from 'node:fs/promises'
import pc from '@brillout/picocolors'
import type { Config, OnCreatePageConfig } from '../../../../types/Config.js'
import type { ConfigValueSource, PageConfigBuildTime } from '../../../../types/PageConfig.js'
import { assert, assertUsage } from '../../../../utils/assert.js'
import { deepEqual } from '../../../../utils/deepEqual.js'
import { getGlobalObject } from '../../../../utils/getGlobalObject.js'
import { isCallable } from '../../../../utils/isCallable.js'
import { isObject } from '../../../../utils/isObject.js'
import { getConfigDefinedAt } from '../../../../shared-server-client/page-configs/getConfigDefinedAt.js'
import { getConfigValueBuildTime } from '../../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import {
  getConfigValueSourcesRelevant,
  isConfigSourceValueNull,
} from '../../plugins/pluginVirtualFiles/getConfigValueSourcesRelevant.js'
import { resolvePageConfigWithHookConfigs, type VikeConfigInternal } from '../resolveVikeConfigInternal.js'
import '../../assertEnvVite.js'

type ResolveImport = (source: string, importer?: string) => Promise<string | undefined>
type ReadFile = (filePath: string) => Promise<string>
type PageConfigsFromHooks = {
  pageConfigs: Promise<PageConfigBuildTime[]> | null
  filesReadByPageId: Map<string, Set<string>>
  configsByPageId: Map<string, (Config | undefined)[]>
}

const globalObject = getGlobalObject('vite/shared/resolveVikeConfigInternal/resolvePageConfigsFromHooks.ts', {
  pageConfigsFromHooks: new WeakMap<VikeConfigInternal, PageConfigsFromHooks>(),
})

// The page configs with the configs returned by +onCreatePageConfig_experimental
// - Called once per Vike config, by the first Vike virtual file loaded
async function resolvePageConfigsFromHooks(
  vikeConfig: VikeConfigInternal,
  resolve: ResolveImport,
): Promise<PageConfigBuildTime[]> {
  let state = globalObject.pageConfigsFromHooks.get(vikeConfig)
  if (!state) {
    state = { pageConfigs: null, filesReadByPageId: new Map(), configsByPageId: new Map() }
    globalObject.pageConfigsFromHooks.set(vikeConfig, state)
  }
  const stateRef = state
  stateRef.pageConfigs ??= Promise.all(
    vikeConfig._pageConfigs.map((pageConfig) => runHooks(pageConfig, vikeConfig, stateRef, resolve, readFile)),
  ).catch((err) => {
    // Next Vike virtual file loaded calls the hooks again
    stateRef.pageConfigs = null
    throw err
  })
  return stateRef.pageConfigs
}

// Development: call the hooks of the pages that read `filePath` again
// - Returns whether a page config changed
async function rerunPageConfigsFromHooks(
  vikeConfig: VikeConfigInternal,
  filePath: string,
  read: () => Promise<string>,
  resolve: ResolveImport,
): Promise<boolean> {
  const state = globalObject.pageConfigsFromHooks.get(vikeConfig)
  if (!state?.pageConfigs) return false
  const pageIds = Array.from(state.filesReadByPageId)
    .filter(([, filesRead]) => filesRead.has(filePath))
    .map(([pageId]) => pageId)
  if (pageIds.length === 0) return false

  const pageConfigs = await state.pageConfigs
  const readFileModified: ReadFile = (filePath_) => (filePath_ === filePath ? read() : readFile(filePath_))
  let isChanged = false
  const pageConfigsNew = await Promise.all(
    vikeConfig._pageConfigs.map(async (pageConfig, i) => {
      if (!pageIds.includes(pageConfig.pageId)) return pageConfigs[i]!
      const configsOld = state.configsByPageId.get(pageConfig.pageId)
      const pageConfigNew = await runHooks(pageConfig, vikeConfig, state, resolve, readFileModified)
      if (!deepEqual(configsOld, state.configsByPageId.get(pageConfig.pageId))) isChanged = true
      return pageConfigNew
    }),
  )
  if (isChanged) state.pageConfigs = Promise.resolve(pageConfigsNew)
  return isChanged
}

async function runHooks(
  pageConfig: PageConfigBuildTime,
  vikeConfig: VikeConfigInternal,
  state: PageConfigsFromHooks,
  resolve: ResolveImport,
  read: ReadFile,
): Promise<PageConfigBuildTime> {
  const sourcesHook = getHookSources(pageConfig)
  if (sourcesHook.length === 0) return pageConfig

  const { pageId } = pageConfig
  const filesRead = new Set<string>()
  state.filesReadByPageId.set(pageId, filesRead)
  const hasServerOnlyHook = getConfigValueBuildTime(pageConfig, 'hasServerOnlyHook', 'boolean')?.value
  assert(typeof hasServerOnlyHook === 'boolean')
  const page: Parameters<OnCreatePageConfig>[0] = {
    pageId,
    isErrorPage: !!pageConfig.isErrorPage,
    config: vikeConfig.pages[pageId]!.config,
    hasServerOnlyHook,
    imports: (configName) => getImports(pageConfig, configName),
  }
  const ctx: Parameters<OnCreatePageConfig>[1] = {
    resolve,
    read: (filePath) => {
      filesRead.add(filePath)
      return read(filePath)
    },
  }

  const configsFromHooks = await Promise.all(
    sourcesHook.map(async (sourceHook) => {
      assert(sourceHook.valueIsLoaded)
      const hook = sourceHook.value
      const hookDefinedAt = getConfigDefinedAt('Config', 'onCreatePageConfig_experimental', sourceHook.definedAt)
      assertUsage(isCallable(hook), `${hookDefinedAt} should be a function`)
      const config: unknown = await hook(page, ctx)
      assertUsage(
        config === undefined || isObject(config),
        `${hookDefinedAt} should return an object or ${pc.cyan('undefined')}`,
      )
      return { config: config as Config | undefined, sourceHook }
    }),
  )
  state.configsByPageId.set(
    pageId,
    configsFromHooks.map(({ config }) => config),
  )

  return resolvePageConfigWithHookConfigs(
    pageConfig,
    configsFromHooks.flatMap(({ config, sourceHook }) => (config ? [{ config, sourceHook }] : [])),
  )
}

function getHookSources(pageConfig: PageConfigBuildTime): ConfigValueSource[] {
  return getConfigValueSourcesRelevant(
    'onCreatePageConfig_experimental',
    { isConfigEnvironment: true },
    pageConfig,
  ).filter((source) => !isConfigSourceValueNull(source))
}

// The files the page imports for `configName`, as Vike's virtual files import them
function getImports(
  pageConfig: PageConfigBuildTime,
  configName: string,
): ReturnType<Parameters<OnCreatePageConfig>[0]['imports']> {
  const configDef = pageConfig.configDefinitions[configName]
  if (!configDef) return []
  const sources = pageConfig.configValueSources[configName] ?? []
  return (configDef.cumulative ? sources : sources.slice(0, 1))
    .filter((source) => source.valueLoadedViaImport)
    .map((source) => {
      const { definedAt } = source
      assert(!definedAt.definedBy)
      return {
        importPath: definedAt.filePathAbsoluteVite,
        // The +config file defining the import
        importer: source.valueIsDefinedByPlusValueFile
          ? null
          : (source.plusFile?.filePath.filePathAbsoluteFilesystem ?? null),
        filePathAbsolute: definedAt.filePathAbsoluteFilesystem,
        exportName: definedAt.fileExportName ?? '*',
      }
    })
}

// Utils
function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8')
}
