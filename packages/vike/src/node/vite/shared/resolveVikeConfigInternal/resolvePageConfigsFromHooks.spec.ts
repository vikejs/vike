import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolvePageConfigsFromHooks, rerunPageConfigsFromHooks } from './resolvePageConfigsFromHooks.js'
import {
  getVikeConfigInternal,
  resolvePageConfigWithHookConfigs,
  setVikeConfigContext,
  type VikeConfigInternal,
} from '../resolveVikeConfigInternal.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import { toPosixPath } from '../../../../utils/path.js'

let userRootDir: string
let vikeConfig: VikeConfigInternal
let pageConfigs: PageConfigBuildTime[]
beforeAll(async () => {
  userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-onCreatePageConfig-'))))
  writeFiles({
    'package.json': JSON.stringify({ type: 'module' }),
    'pages/+config.js': [
      "import extension from '../extension/config.js' with { type: 'vike:pointer' }",
      'export default { extends: [extension] }',
    ].join('\n'),
    'pages/+onCreatePageContext.ssr.js': 'export default () => {}',
    'shared.txt': '',
    'pages/index/+Page.js': "export default 'index'",
    'pages/about/+Page.js': "export default 'needs-server'",
    'pages/effect/+Page.js': "export default 'effect'",
    'pages/effect/+config.js': [
      'export default {',
      '  meta: {',
      '    serverOnly: {',
      '      env: { config: true },',
      '      effect: () => ({ meta: { onCreatePageContext: { env: { server: true, client: false } } } }),',
      '    },',
      '  },',
      '  serverOnly: true,',
      '}',
    ].join('\n'),
    'extension/package.json': JSON.stringify({ name: 'extension', type: 'module' }),
    'extension/config.js': [
      'export default {',
      "  name: 'extension',",
      "  onCreatePageContext: 'import:./static.ssr.js:onCreatePageContext',",
      '  onCreatePageConfig_experimental: async (page, { read }) => {',
      "    const { filePathAbsolute } = page.imports('Page')[0]",
      '    const code = await read(filePathAbsolute)',
      "    const shared = await read(filePathAbsolute.slice(0, filePathAbsolute.indexOf('/pages/')) + '/shared.txt')",
      "    if (shared.includes('invalid') && page.pageId === '/pages/about') throw new Error('Invalid shared.txt')",
      "    const isServer = code.includes('needs-server') || (shared.includes('server') && page.pageId === '/pages/index')",
      "    const fileName = isServer ? 'hook.server.js' : 'hook.ssr.js'",
      '    return { onCreatePageContext: `import:./${fileName}:onCreatePageContext` }',
      '  },',
      '}',
    ].join('\n'),
    'extension/static.ssr.js': 'export const onCreatePageContext = () => {}',
    'extension/hook.ssr.js': 'export const onCreatePageContext = () => {}',
    'extension/hook.server.js': 'export const onCreatePageContext = () => {}',
    'extension/hook.js': 'export const onCreatePageContext = () => {}',
  })
  setVikeConfigContext({ userRootDir, isDev: false, vikeVitePluginOptions: {} })
  vikeConfig = await getVikeConfigInternal()
  pageConfigs = await resolvePageConfigsFromHooks(vikeConfig, async () => undefined)
})
afterAll(() => {
  fs.rmSync(userRootDir, { recursive: true, force: true })
})

describe('resolvePageConfigsFromHooks()', () => {
  it('adds the returned config with the precedence of the +config file defining the hook', () => {
    expect(getDefinedAt(getPageConfig(pageConfigs, '/pages/index'), 'onCreatePageContext')).toEqual([
      '/pages/+onCreatePageContext.ssr.js',
      '/extension/hook.ssr.js',
      '/extension/static.ssr.js',
    ])
    expect(getDefinedAt(getPageConfig(vikeConfig._pageConfigs, '/pages/index'), 'onCreatePageContext')).toEqual([
      '/pages/+onCreatePageContext.ssr.js',
      '/extension/static.ssr.js',
    ])
  })

  it('recomputes hasServerOnlyHook per page', () => {
    expect(getPageConfig(pageConfigs, '/pages/index').configValuesComputed.hasServerOnlyHook!.value).toBe(false)
    expect(getPageConfig(pageConfigs, '/pages/about').configValuesComputed.hasServerOnlyHook!.value).toBe(true)
  })

  it('calls the hooks again after a failed call', async () => {
    const filePath = path.join(userRootDir, 'shared.txt')
    const resolve = async () => undefined
    const isServerIndex = async () =>
      getPageConfig(await resolvePageConfigsFromHooks(vikeConfig, resolve), '/pages/index').configValuesComputed
        .hasServerOnlyHook!.value
    await expect(
      rerunPageConfigsFromHooks(vikeConfig, filePath, async () => 'server, invalid', resolve),
    ).rejects.toThrowError('Invalid shared.txt')
    expect(await isServerIndex()).toBe(false)
    expect(await rerunPageConfigsFromHooks(vikeConfig, filePath, async () => 'server', resolve)).toBe(true)
    expect(await isServerIndex()).toBe(true)
    expect(await rerunPageConfigsFromHooks(vikeConfig, filePath, async () => '', resolve)).toBe(true)
    expect(await isServerIndex()).toBe(false)
  })

  it('applies the meta.env set by effects', () => {
    const pageConfig = getPageConfig(vikeConfig._pageConfigs, '/pages/effect')
    const sourceHook = pageConfig.configValueSources.onCreatePageConfig_experimental![0]!
    const pageConfigWithHookConfigs = resolvePageConfigWithHookConfigs(pageConfig, [
      { config: { onCreatePageContext: 'import:./hook.js:onCreatePageContext' }, sourceHook },
    ])
    const sourceAdded = pageConfigWithHookConfigs.configValueSources.onCreatePageContext!.find(
      ({ definedAt }) => 'filePathToShowToUser' in definedAt && definedAt.filePathToShowToUser === '/extension/hook.js',
    )
    expect(sourceAdded!.configEnv).toEqual({ server: true, client: false })
  })

  it('refuses configs loaded at config time', () => {
    const pageConfig = getPageConfig(vikeConfig._pageConfigs, '/pages/index')
    const sourceHook = pageConfig.configValueSources.onCreatePageConfig_experimental![0]!
    expect(() =>
      resolvePageConfigWithHookConfigs(pageConfig, [{ config: { prerender: true }, sourceHook }]),
    ).toThrowError(/prerender/)
  })
})

function getPageConfig(pageConfigs: PageConfigBuildTime[], pageId: string) {
  const pageConfig = pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
  expect(pageConfig).toBeDefined()
  return pageConfig!
}
function getDefinedAt(pageConfig: PageConfigBuildTime, configName: string) {
  return pageConfig.configValueSources[configName]!.map(({ definedAt }) => {
    expect(definedAt.definedBy).toBeUndefined()
    return 'filePathToShowToUser' in definedAt && definedAt.filePathToShowToUser
  })
}
function writeFiles(files: Record<string, string>) {
  Object.entries(files).forEach(([filePathRelative, fileContent]) => {
    const filePath = path.join(userRootDir, filePathRelative)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, fileContent)
  })
}
