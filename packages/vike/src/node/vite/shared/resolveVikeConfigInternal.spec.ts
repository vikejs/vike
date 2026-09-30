import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  getConfigEnvValue,
  getRuntimeEnvironmentNames,
  getVikeConfigInternal,
  resolveConfigEnv,
  setVikeConfigContext,
  setViteEnvironmentNames,
} from './resolveVikeConfigInternal.js'
import type { FilePath } from '../../../types/FilePath.js'
import { toPosixPath } from '../../../utils/path.js'

const errMsgIntro = 'Config meta defined at test sets meta.Page.env to' as const

// Each test resolves its own app
beforeEach(() => {
  Object.assign(globalThis._vike.globals['vite/shared/resolveVikeConfigInternal.ts']!, {
    vikeConfigPromise: null,
    vikeConfigHasBuildError: null,
    restartViteBecauseOfError: false,
    viteEnvironmentNames: null,
  })
})

describe('getConfigEnvValue()', () => {
  it('accepts an open environment map', () => {
    const env = { server: false, client: false, rsc: true, config: false, production: true }
    expect(getConfigEnvValue(env, errMsgIntro)).toEqual(env)
  })

  it.each(['ssr', 'shared', 'clear', 'default', 'eager'])('rejects reserved name %s', (name) => {
    expect(() => getConfigEnvValue({ [name]: true }, errMsgIntro)).toThrow('is reserved by Vike')
  })

  it('accepts names that were reserved only by an earlier design', () => {
    expect(getConfigEnvValue({ runtimes: true }, errMsgIntro)).toEqual({ runtimes: true })
  })

  it('rejects invalid names and values', () => {
    expect(() => getConfigEnvValue({ 'a:b': true }, errMsgIntro)).toThrow("isn't a valid environment name")
    expect(() => getConfigEnvValue({ rsc: 'yes' }, errMsgIntro)).toThrow('an invalid value')
    expect(() => getConfigEnvValue({ client: 'if-client-routing' }, errMsgIntro)).toThrow('an invalid value')
  })

  it('converts the deprecated string values', () => {
    expect(getConfigEnvValue('_routing-eager', errMsgIntro)).toEqual({
      server: true,
      client: 'if-client-routing',
      eager: true,
    })
  })
})

describe('getRuntimeEnvironmentNames()', () => {
  it('always includes server and client', () => {
    expect(getRuntimeEnvironmentNames([])).toEqual(['server', 'client'])
  })

  it('collects named environments', () => {
    expect(getRuntimeEnvironmentNames([{ server: true }, { rsc: true, config: true }, { worker: true }])).toEqual([
      'server',
      'client',
      'rsc',
      'worker',
    ])
  })

  it('ignores environments set to false or undefined', () => {
    expect(getRuntimeEnvironmentNames([{ server: true, rsc: false }, { worker: undefined }])).toEqual([
      'server',
      'client',
    ])
  })

  it("doesn't mistake config, production and the deprecated eager for environments", () => {
    const configEnvs = [{ config: true, production: false }, getConfigEnvValue('_routing-eager', errMsgIntro)]
    expect(getRuntimeEnvironmentNames(configEnvs)).toEqual(['server', 'client'])
  })
})

describe('resolveConfigEnv()', () => {
  const names = ['server', 'client', 'rsc', 'worker']
  const env = { server: true, client: true }
  const resolve = (fileName: string, runtimeEnvironmentNames = names) =>
    resolveConfigEnv(env, getFilePath(fileName), runtimeEnvironmentNames)

  it('keeps meta.env without an environment suffix', () => {
    expect(resolve('+Layout.tsx')).toEqual(env)
  })

  it.each([
    ['+Layout.rsc.tsx', { server: false, client: false, rsc: true, worker: false }],
    ['+Layout.server.tsx', { server: true, client: false, rsc: false, worker: false }],
    ['+Layout.ssr.tsx', { server: true, client: false, rsc: false, worker: false }],
    ['+Layout.client.tsx', { server: false, client: true, rsc: false, worker: false }],
    ['+Layout.shared.tsx', { server: true, client: true, rsc: false, worker: false }],
  ])('%s', (fileName, expected) => {
    expect(resolve(fileName)).toEqual(expected)
  })

  it("doesn't change server/client suffixes if there aren't named environments", () => {
    expect(resolve('+Layout.server.tsx', ['server', 'client'])).toEqual({ server: true, client: false })
    expect(resolve('+Layout.client.tsx', ['server', 'client'])).toEqual({ server: false, client: true })
    expect(resolve('+Layout.shared.tsx', ['server', 'client'])).toEqual({ server: true, client: true })
  })

  it('ignores the suffix of an unknown environment', () => {
    expect(resolve('+Layout.edge.tsx')).toEqual(env)
  })

  it('rejects more than one environment suffix', () => {
    expect(() => resolve('+Layout.rsc.worker.tsx')).toThrow('more than one environment suffix')
    expect(() => resolve('+Layout.rsc.server.tsx')).toThrow('more than one environment suffix')
    expect(resolve('+Layout.rsc.clear.tsx')).toEqual({ server: false, client: false, rsc: true, worker: false })
  })
})

describe('environment introduced only by meta.effect()', () => {
  const userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-named-environments-'))))
  afterAll(() => {
    fs.rmSync(userRootDir, { recursive: true, force: true })
  })

  it('applies its file suffix', async () => {
    writeFiles(userRootDir, {
      'package.json': JSON.stringify({ type: 'module' }),
      'pages/+config.js': [
        'export default {',
        '  meta: {',
        '    Layout: { env: { server: true, client: true }, cumulative: true },',
        '    rscPages: {',
        '      env: { config: true },',
        '      effect: () => ({ meta: { Page: { env: { server: false, client: false, rsc: true } } } }),',
        '    },',
        '  },',
        '  rscPages: true,',
        '}',
      ].join('\n'),
      'pages/+Layout.rsc.js': 'export default "Layout"',
      'pages/index/+Page.js': 'export default "Page"',
    })
    setVikeConfigContext({ userRootDir, isDev: true, vikeVitePluginOptions: {} })
    const vikeConfig = await getVikeConfigInternal()
    expect(vikeConfig._runtimeEnvironmentNames).toContain('rsc')
    const pageConfig = vikeConfig._pageConfigs.find((p) => p.pageId === '/pages/index')!
    expect(pageConfig.configValueSources.Page![0]!.configEnv).toEqual({ server: false, client: false, rsc: true })
    expect(pageConfig.configValueSources.Layout![0]!.configEnv).toEqual({ server: false, client: false, rsc: true })
  })
})

describe("meta.env of a Vite environment that doesn't exist", () => {
  const userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-named-environments-'))))
  afterAll(() => {
    fs.rmSync(userRootDir, { recursive: true, force: true })
  })

  it("doesn't require Vite environments for server and client", async () => {
    writeFiles(userRootDir, {
      'package.json': JSON.stringify({ type: 'module' }),
      'pages/+config.js': "export default { meta: { myCfg: { env: { server: true, client: true } } }, myCfg: 'x' }",
      'pages/index/+Page.js': 'export default "Page"',
    })
    await setViteEnvironmentNames([])
    setVikeConfigContext({ userRootDir, isDev: false, vikeVitePluginOptions: {} })
    await expect(getVikeConfigInternal()).resolves.toBeTruthy()
  })

  it('accepts an existing Vite environment', async () => {
    writeFiles(userRootDir, {
      'package.json': JSON.stringify({ type: 'module' }),
      'pages/+config.js': "export default { meta: { myCfg: { env: { rsc: true } } }, myCfg: 'x' }",
      'pages/index/+Page.js': 'export default "Page"',
    })
    await setViteEnvironmentNames(['client', 'ssr', 'rsc'])
    setVikeConfigContext({ userRootDir, isDev: false, vikeVitePluginOptions: {} })
    await expect(getVikeConfigInternal()).resolves.toBeTruthy()
  })

  it('is a config error', async () => {
    writeFiles(userRootDir, {
      'package.json': JSON.stringify({ type: 'module' }),
      'pages/+config.js': "export default { meta: { myCfg: { env: { sever: true } } }, myCfg: 'x' }",
      'pages/index/+Page.js': 'export default "Page"',
    })
    await setViteEnvironmentNames(['client', 'ssr'])
    setVikeConfigContext({ userRootDir, isDev: false, vikeVitePluginOptions: {} })
    await expect(getVikeConfigInternal()).rejects.toThrow('"sever"')
  })
})

describe('meta.env.production of a built-in hook', () => {
  const userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-named-environments-'))))
  afterAll(() => {
    fs.rmSync(userRootDir, { recursive: true, force: true })
  })

  it.each([
    [true, false],
    [false, true],
  ])('isDev: %s => hasServerOnlyHook: %s', async (isDev, hasServerOnlyHook) => {
    writeFiles(userRootDir, {
      'package.json': JSON.stringify({ type: 'module' }),
      'pages/+config.js': 'export default { meta: { data: { env: { server: true, production: true } } } }',
      'pages/index/+Page.js': 'export default "Page"',
      'pages/index/+data.js': 'export default () => {}',
    })
    setVikeConfigContext({ userRootDir, isDev, vikeVitePluginOptions: {} })
    const vikeConfig = await getVikeConfigInternal()
    const pageConfig = vikeConfig._pageConfigs.find((p) => p.pageId === '/pages/index')!
    expect(pageConfig.configValuesComputed?.hasServerOnlyHook?.value).toBe(hasServerOnlyHook)
  })
})

function writeFiles(userRootDir: string, files: Record<string, string>) {
  Object.entries(files).forEach(([filePathRelative, fileContent]) => {
    const filePath = path.join(userRootDir, filePathRelative)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, fileContent)
  })
}

function getFilePath(fileName: string) {
  return {
    fileName,
    filePathAbsoluteFilesystem: `/app/pages/${fileName}`,
    filePathToShowToUser: `/pages/${fileName}`,
  } as FilePath
}
