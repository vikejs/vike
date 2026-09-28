import { expect, describe, it, beforeAll, afterAll, vi } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { inspect } from 'node:util'
import {
  transpileAndExecuteFile,
  getConfigBuildErrorFormatted,
  type VikeTranspileCache,
} from './transpileAndExecuteFile.js'
import { getFilePathResolved } from '../getFilePath.js'
import { stripAnsi } from '../../../../utils/colorsServer.js'
import { toPosixPath } from '../../../../utils/path.js'
import * as isScriptFile from '../../../../utils/isScriptFile.js'

const zeroWidthSpace = '​'

let userRootDir: string
beforeAll(() => {
  userRootDir = toPosixPath(fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'vike-transpileAndExecuteFile-'))))
  writeFiles({
    'package.json': JSON.stringify({ type: 'module', imports: { '#utils/*': './utils/*.js' } }),
    'tsconfig.json': JSON.stringify({ compilerOptions: { paths: { '#root/*': ['./*'] } } }),
    'node_modules/some-npm-pkg/package.json': JSON.stringify({
      name: 'some-npm-pkg',
      type: 'module',
      exports: './index.js',
    }),
    'node_modules/some-npm-pkg/index.js': "export const someNpmPkg = 'someNpmPkg'",
    'node_modules/vike-some-extension/package.json': JSON.stringify({
      name: 'vike-some-extension',
      type: 'module',
      exports: { './config': './dist/+config.js' },
    }),
    'node_modules/vike-some-extension/dist/+config.js': "export default { name: 'vike-some-extension' }",
    'utils/helper.ts': 'export const helper = (s: string): string => `helper(${s})`',
    'utils/fromPackageJsonImports.js': "export const fromPackageJsonImports = 'fromPackageJsonImports'",
    'components/Layout.jsx': 'export const Layout = ({ children }) => <div>{children}</div>',
    'components/style.css': 'body { color: red }',
    'components/Page.ts': "export const Page = 'Page'",
    'components/legacy.cjs': "const path = require('node:path')\nmodule.exports = { sep: path.posix.sep }",
  })
})
afterAll(() => {
  fs.rmSync(userRootDir, { recursive: true, force: true })
})

describe('transpileAndExecuteFile()', () => {
  it('pointer imports, path aliases, npm packages, and built-in modules', async () => {
    writeFiles({
      'pages/basics/+config.ts': [
        "import type { Config } from 'vike/types'",
        "import vikeSomeExtension from 'vike-some-extension/config'",
        "import { Layout } from '../../components/Layout.jsx'",
        "import { Page } from '#root/components/Page' with { type: 'vike:pointer' }",
        "import { helper } from '#root/utils/helper'",
        "import { fromPackageJsonImports } from '#utils/fromPackageJsonImports'",
        "import { someNpmPkg } from 'some-npm-pkg'",
        "import { readFileSync } from 'node:fs'",
        'export default {',
        '  extends: [vikeSomeExtension],',
        '  Layout,',
        '  Page,',
        "  title: helper('title'),",
        '  fromPackageJsonImports,',
        '  someNpmPkg,',
        '  readFileSync: typeof readFileSync,',
        '} satisfies Config',
      ].join('\n'),
    })
    const { fileExports, dependencies } = await load('/pages/basics/+config.ts')
    expect(fileExports.default).toEqual({
      // Pointer imports
      extends: [`${zeroWidthSpace}import:vike-some-extension/config:default`],
      Layout: `${zeroWidthSpace}import:${userRootDir}/components/Layout.jsx:Layout`,
      Page: `${zeroWidthSpace}import:${userRootDir}/components/Page.ts:Page`,
      // Transpiled and executed
      title: 'helper(title)',
      fromPackageJsonImports: 'fromPackageJsonImports',
      someNpmPkg: 'someNpmPkg',
      readFileSync: 'function',
    })
    expect(dependencies).toEqual(['/pages/basics/+config.ts', '/utils/fromPackageJsonImports.js', '/utils/helper.ts'])
  })

  it('pointer imports of header files', async () => {
    writeFiles({
      'pages/header/+config.h.js': [
        "import { helper } from '../../utils/helper.ts'",
        "import { someNpmPkg } from 'some-npm-pkg'",
        'export default { helper, someNpmPkg }',
      ].join('\n'),
    })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const { fileExports } = await load('/pages/header/+config.h.js')
      expect(fileExports.default).toEqual({
        helper: `${zeroWidthSpace}import:${userRootDir}/utils/helper.ts:helper`,
        someNpmPkg: `${zeroWidthSpace}import:some-npm-pkg:someNpmPkg`,
      })
      expect(warn).toHaveBeenCalledOnce()
      expect(stripAnsi(String(warn.mock.calls[0]![0]))).toContain('.h.js files are deprecated')
    } finally {
      warn.mockRestore()
    }
  })

  it('re-exported pointer imports', async () => {
    writeFiles({
      'pages/reexport/+config.ts': "export { Layout } from '../../components/Layout.jsx'",
    })
    const { fileExports } = await load('/pages/reexport/+config.ts')
    expect(fileExports.Layout).toBe(`${zeroWidthSpace}import:${userRootDir}/components/Layout.jsx:Layout`)
  })

  it('absolute import paths', async () => {
    writeFiles({
      'pages/absolute/+config.ts': [
        `import { Layout } from '${userRootDir}/components/Layout.jsx'`,
        `import { helper } from '${userRootDir}/utils/helper.ts'`,
        "export default { Layout, title: helper('title') }",
      ].join('\n'),
    })
    const { fileExports, dependencies } = await load('/pages/absolute/+config.ts')
    expect(fileExports.default).toEqual({
      // Pointer import
      Layout: `${zeroWidthSpace}import:${userRootDir}/components/Layout.jsx:Layout`,
      // Transpiled and executed
      title: 'helper(title)',
    })
    expect(dependencies).toEqual(['/pages/absolute/+config.ts', '/utils/helper.ts'])
  })

  it('pointer imports without effect', async () => {
    // Pointer imports that don't import any value don't have any effect: they're removed
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      writeFiles({
        'pages/unused/+config.js': [
          "import { Layout } from '../../components/Layout.jsx'",
          "import style from '../../components/style.css'",
          'export default {}',
        ].join('\n'),
        'pages/sideEffect/+config.ts': [
          "import '../../components/Layout.jsx'",
          "import '../../components/style.css'",
          "import {} from '../../components/style.css'",
          'export default {}',
        ].join('\n'),
      })
      for (const filePath of ['/pages/unused/+config.js', '/pages/sideEffect/+config.ts']) {
        expect((await load(filePath)).fileExports.default).toEqual({})
      }
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('pointer import and normal import of the same file', async () => {
    writeFiles({
      'components/pageAndTitle.ts': ["export const Page = 'Page'", "export const title = 'Some title'"].join('\n'),
      'components/getTitle.ts': [
        "import { title } from './pageAndTitle.ts'",
        'export const getTitle = () => title',
      ].join('\n'),
      'pages/samePath/+config.ts': [
        // Non-ASCII characters before the imports (the import paths are modified based on their position)
        '// Café 🚀',
        "import { Page } from '../../components/pageAndTitle.ts' with { type: 'vike:pointer' }",
        "import { title } from '../../components/pageAndTitle.ts'",
        'export default { Page, title }',
      ].join('\n'),
      'pages/samePathReversed/+config.ts': [
        "import { title } from '../../components/pageAndTitle.ts'",
        "import { Page } from '../../components/pageAndTitle.ts' with { type: 'vike:pointer' }",
        'export default { Page, title }',
      ].join('\n'),
      'pages/samePathOtherImporter/+config.ts': [
        "import { Page } from '../../components/pageAndTitle.ts' with { type: 'vike:pointer' }",
        "import { getTitle } from '../../components/getTitle.ts'",
        'export default { Page, title: getTitle() }',
      ].join('\n'),
    })
    for (const page of ['samePath', 'samePathReversed', 'samePathOtherImporter']) {
      const { fileExports } = await load(`/pages/${page}/+config.ts`)
      expect(fileExports.default).toEqual({
        // Pointer import
        Page: `${zeroWidthSpace}import:${userRootDir}/components/pageAndTitle.ts:Page`,
        // Loaded and executed at config-time
        title: 'Some title',
      })
    }
  })

  it('transpilation', async () => {
    writeFiles({
      'pages/transpilation/+config.ts': [
        "import legacy from '../../components/legacy.cjs'",
        'type Value = { value: string }',
        'function getValue(): Value {',
        '  using resource = { [Symbol.dispose]() {} }',
        "  return { value: 'value' }",
        '}',
        "const { helper } = await import('#root/utils/helper')",
        'export default { ...getValue(), legacy, dynamicImport: helper("dynamic") }',
      ].join('\n'),
    })
    const { fileExports, dependencies } = await load('/pages/transpilation/+config.ts')
    expect(fileExports.default).toEqual({ value: 'value', legacy: { sep: '/' }, dynamicImport: 'helper(dynamic)' })
    expect(dependencies).toEqual(['/components/legacy.cjs', '/pages/transpilation/+config.ts', '/utils/helper.ts'])
  })

  it('warnings', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      writeFiles({
        'pages/warnings/+config.ts': ["const two = eval('1 + 1')", 'export default { two }'].join('\n'),
      })
      const { fileExports } = await load('/pages/warnings/+config.ts')
      expect(fileExports.default).toEqual({ two: 2 })
      // Rolldown's warnings are printed
      expect(warn).toHaveBeenCalledOnce()
      const msg = stripAnsi(String(warn.mock.calls[0]![0]))
      expect(msg).toContain('pages/warnings/+config.ts')
      expect(msg).toContain('[EVAL]')
      expect(msg).toContain('Use of direct `eval` function is strongly discouraged')
    } finally {
      warn.mockRestore()
    }
  })

  it('build errors', async () => {
    writeFiles({
      'pages/unresolvedAlias/+config.ts': [
        "import { onRenderHtml } from '#root/renderer/onRenderHtml_typo'",
        'export default { onRenderHtml }',
      ].join('\n'),
      'pages/unresolvedNpmPackage/+config.ts': [
        "import { notInstalled } from 'not-installed-npm-package'",
        'export default { notInstalled }',
      ].join('\n'),
      'pages/unresolvedRelative/+config.ts': [
        "import { onRenderHtml } from './onRenderHtml_typo'",
        'export default { onRenderHtml }',
      ].join('\n'),
      'pages/unresolvedPointerImport/+config.ts': [
        "import { Page } from './Page_typo.ts' with { type: 'vike:pointer' }",
        'export default { Page }',
      ].join('\n'),
      'pages/unresolvedPointerImportNpmPackage/+config.ts': [
        "import { Page } from 'not-installed-npm-package' with { type: 'vike:pointer' }",
        'export default { Page }',
      ].join('\n'),
      'pages/syntaxError/+config.ts': ['export default {', '  a: 1 +', '}'].join('\n'),
      'pages/syntaxErrorDependency/+config.ts': ["import { a } from './a.ts'", 'export default { a }'].join('\n'),
      'pages/syntaxErrorDependency/a.ts': 'export const a = (',
    })

    {
      const { errMsgFormatted } = await getBuildErr('/pages/unresolvedAlias/+config.ts')
      expect(errMsgFormatted).toContain('Failed to transpile /pages/unresolvedAlias/+config.ts because:')
      expect(errMsgFormatted).toContain("Could not resolve '#root/renderer/onRenderHtml_typo'")
      expect(errMsgFormatted).toContain("import { onRenderHtml } from '#root/renderer/onRenderHtml_typo'")
    }
    {
      const { errMsgFormatted, err } = await getBuildErr('/pages/unresolvedNpmPackage/+config.ts')
      expect(errMsgFormatted).toContain('Failed to transpile /pages/unresolvedNpmPackage/+config.ts because:')
      expect(errMsgFormatted).toContain("Could not resolve 'not-installed-npm-package'")
      expect(errMsgFormatted).not.toContain('treating it as an external dependency')
      // The error message is printed only once upon `$ vike build`
      expect(inspect(err).split('UNRESOLVED_IMPORT').length - 1).toBe(1)
    }
    for (const [page, importPath] of [
      ['unresolvedPointerImport', './Page_typo.ts'],
      ['unresolvedPointerImportNpmPackage', 'not-installed-npm-package'],
    ] as const) {
      const { errMsgFormatted, err } = await getBuildErr(`/pages/${page}/+config.ts`)
      expect(errMsgFormatted).toContain(`Failed to transpile /pages/${page}/+config.ts because:`)
      expect(errMsgFormatted).toContain(`Could not resolve '${importPath}'`)
      // The code snippet shows the original code
      expect(errMsgFormatted).toContain(`import { Page } from '${importPath}' with { type: 'vike:pointer' }`)
      expect([errMsgFormatted, err.message, err.stack].join('\n')).not.toContain('?vike:pointer')
    }
    {
      const { errMsgFormatted } = await getBuildErr('/pages/unresolvedRelative/+config.ts')
      expect(errMsgFormatted).toContain('Failed to transpile /pages/unresolvedRelative/+config.ts because:')
      expect(errMsgFormatted).toContain("Could not resolve './onRenderHtml_typo'")
    }
    {
      const { errMsgFormatted } = await getBuildErr('/pages/syntaxError/+config.ts')
      expect(errMsgFormatted).toContain('Failed to transpile /pages/syntaxError/+config.ts because:')
      expect(errMsgFormatted).toContain('pages/syntaxError/+config.ts:3:1')
    }
    {
      const { errMsgFormatted, dependencies } = await getBuildErr('/pages/syntaxErrorDependency/+config.ts')
      expect(errMsgFormatted).toContain('Failed to transpile /pages/syntaxErrorDependency/+config.ts because:')
      expect(errMsgFormatted).toContain('pages/syntaxErrorDependency/a.ts:1:')
      // Dependencies are also tracked upon build failure (so that the config is reloaded once the user fixes the error)
      expect(dependencies).toEqual(['/pages/syntaxErrorDependency/+config.ts', '/pages/syntaxErrorDependency/a.ts'])
    }
  })

  it("errors thrown by Vike's Rolldown plugins", async () => {
    writeFiles({
      'pages/pluginError/+config.ts': [
        "import { Layout } from '../../components/Layout.jsx'",
        'export default { Layout }',
      ].join('\n'),
    })
    // For example a failing assert()
    const errPlugin = new Error('Some Vike bug')
    const spy = vi.spyOn(isScriptFile, 'isPlainScriptFile').mockImplementation(() => {
      throw errPlugin
    })
    try {
      // Thrown as-is (instead of being formatted as a transpile error)
      expect(await getErr(load('/pages/pluginError/+config.ts'))).toBe(errPlugin)
    } finally {
      spy.mockRestore()
    }
  })
})

async function load(filePathAbsoluteUserRootDir: string) {
  const vikeTranspileCache: VikeTranspileCache = { transpileCache: {}, vikeConfigDependencies: new Set() }
  const getDependencies = () =>
    Array.from(vikeTranspileCache.vikeConfigDependencies)
      .map((filePath) => {
        expect(filePath.startsWith(userRootDir)).toBe(true)
        return filePath.slice(userRootDir.length)
      })
      // Modules are loaded in parallel
      .sort()
  const filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  try {
    const { fileExports } = await transpileAndExecuteFile(filePath, userRootDir, false, vikeTranspileCache)
    return { fileExports, dependencies: getDependencies() }
  } catch (err) {
    ;(err as { dependencies?: string[] }).dependencies = getDependencies()
    throw err
  }
}
async function getBuildErr(filePathAbsoluteUserRootDir: string) {
  const err = await getErr(load(filePathAbsoluteUserRootDir))
  const errMsgFormatted = getConfigBuildErrorFormatted(err)
  expect(errMsgFormatted).toBeTruthy()
  // Otherwise `$ vike build` prints it in addition to the error message
  expect(inspect(err)).not.toContain('_formatted')
  return {
    err,
    errMsgFormatted: stripAnsi(errMsgFormatted!),
    dependencies: (err as { dependencies?: string[] }).dependencies,
  }
}
async function getErr(promise: Promise<unknown>): Promise<Error> {
  try {
    await promise
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    return err as Error
  }
  throw new Error('Expected promise to reject')
}

function writeFiles(files: Record<string, string>) {
  Object.entries(files).forEach(([filePathRelative, fileContent]) => {
    const filePath = path.join(userRootDir, filePathRelative)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, fileContent)
  })
}
