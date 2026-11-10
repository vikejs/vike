import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  getVikeConfig,
  getVikeConfigInternal,
  reloadVikeConfig,
  setVikeConfigContext,
  setVikeConfigSerialized,
} from './resolveVikeConfigInternal.js'
import type { PageConfigBuildTime } from '../../../types/PageConfig.js'
import { toPosixPath } from '../../../utils/path.js'

let userRootDir: string
beforeAll(async () => {
  userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-page-config-writable-'))))
  writeFiles({
    'package.json': JSON.stringify({ type: 'module' }),
    'pages/+config.js': [
      "import extension from '../extension/config.js' with { type: 'vike:pointer' }",
      'export default { extends: [extension], meta: { someSetting: { env: { config: true } } } }',
    ].join('\n'),
    'pages/+onCreatePageContext.ssr.js': 'export default () => {}',
    'pages/index/+Page.js': "export default 'index'",
    'pages/about/+Page.js': "export default 'about'",
    'pages/about/+data.js': 'export default () => {}',
    'extension/package.json': JSON.stringify({ name: 'extension', type: 'module' }),
    'extension/config.js': [
      'export default {',
      "  name: 'extension',",
      "  onCreatePageContext: 'import:./static.ssr.js:onCreatePageContext',",
      '}',
    ].join('\n'),
    'extension/static.ssr.js': 'export const onCreatePageContext = () => {}',
    'hooks/onCreatePageContext.ssr.js': 'export const onCreatePageContext = () => {}',
    'hooks/onCreatePageContext.server.js': 'export const onCreatePageContext = () => {}',
    'hooks/data.js': 'export const data = () => {}',
  })
  setVikeConfigContext({ userRootDir, isDev: false, vikeVitePluginOptions: {} })
  await getVikeConfigInternal()
})
afterAll(() => {
  fs.rmSync(userRootDir, { recursive: true, force: true })
})

describe('getVikeConfig().pages[pageId].config', () => {
  it('sets a runtime config with lower precedence than + files', async () => {
    const config: Record<string, unknown> = getVikeConfig().pages['/pages/about']!.config
    config.onCreatePageContext = 'import:./hooks/onCreatePageContext.ssr.js:onCreatePageContext'
    config.data = 'import:./hooks/data.js:data'
    const pageConfig = await getPageConfig('/pages/about')
    expect(getDefinedAt(pageConfig, 'onCreatePageContext')).toEqual([
      '/pages/+onCreatePageContext.ssr.js',
      '/extension/static.ssr.js',
      '/hooks/onCreatePageContext.ssr.js',
    ])
    expect(getDefinedAt(pageConfig, 'data')).toEqual(['/pages/about/+data.js', '/hooks/data.js'])
  })

  it('recomputes hasServerOnlyHook', async () => {
    const config: Record<string, unknown> = getVikeConfig().pages['/pages/index']!.config
    const hasServerOnlyHook = async () =>
      (await getPageConfig('/pages/index')).configValuesComputed.hasServerOnlyHook!.value
    expect(await hasServerOnlyHook()).toBe(false)
    config.onCreatePageContext = 'import:./hooks/onCreatePageContext.server.js:onCreatePageContext'
    expect(await hasServerOnlyHook()).toBe(true)
    config.onCreatePageContext = 'import:./hooks/onCreatePageContext.ssr.js:onCreatePageContext'
    expect(await hasServerOnlyHook()).toBe(false)
  })

  it('keeps the set values when Vike reloads its config', async () => {
    reloadVikeConfig()
    expect(getDefinedAt(await getPageConfig('/pages/index'), 'onCreatePageContext')).toEqual([
      '/pages/+onCreatePageContext.ssr.js',
      '/extension/static.ssr.js',
      '/hooks/onCreatePageContext.ssr.js',
    ])
  })

  it('refuses configs loaded at config time', async () => {
    const config: Record<string, unknown> = getVikeConfig().pages['/pages/index']!.config
    expect(() => {
      config.prerender = true
    }).toThrowError(/prerender/)
    expect(() => {
      config.someSetting = true
    }).toThrowError(/someSetting/)
    expect(() => {
      config.unknownConfig = true
    }).toThrowError(/unknownConfig/)
    expect((await getPageConfig('/pages/index')).configValueSources.prerender).toBeUndefined()
  })

  it('refuses a new value after Vike generated its virtual files', async () => {
    setVikeConfigSerialized(await getVikeConfigInternal())
    const config: Record<string, unknown> = getVikeConfig().pages['/pages/index']!.config
    config.onCreatePageContext = 'import:./hooks/onCreatePageContext.ssr.js:onCreatePageContext'
    expect(() => {
      config.onCreatePageContext = 'import:./hooks/onCreatePageContext.server.js:onCreatePageContext'
    }).toThrowError(/virtual files/)
  })
})

async function getPageConfig(pageId: string): Promise<PageConfigBuildTime> {
  const pageConfig = (await getVikeConfigInternal())._pageConfigs.find((pageConfig) => pageConfig.pageId === pageId)
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
