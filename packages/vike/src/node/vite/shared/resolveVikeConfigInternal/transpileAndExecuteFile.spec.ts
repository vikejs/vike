import { expect, describe, it, beforeAll, afterAll, vi } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { inspect } from 'node:util'
import { transpileAndExecuteFile, getConfigBuildErrorFormatted, type BuildCache } from './transpileAndExecuteFile.js'
import { getFilePathResolved } from '../getFilePath.js'
import { stripAnsi } from '../../../../utils/colorsServer.js'
import { toPosixPath } from '../../../../utils/path.js'

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

  it('pointer imports without effect', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      // Unused pointer imports (Rolldown transforms them into `import '...'`)
      writeFiles({
        'pages/unused/+config.js': [
          "import { Layout } from '../../components/Layout.jsx'",
          "import style from '../../components/style.css'",
          'export default {}',
        ].join('\n'),
      })
      expect((await load('/pages/unused/+config.js')).fileExports.default).toEqual({})
      expect(warn).not.toHaveBeenCalled()

      writeFiles({
        'pages/sideEffectJsx/+config.js': ["import '../../components/Layout.jsx'", 'export default {}'].join('\n'),
      })
      expect((await load('/pages/sideEffectJsx/+config.js')).fileExports.default).toEqual({})
      expect(warn).toHaveBeenCalledOnce()
      expect(normalize(String(warn.mock.calls[0]![0]))).toMatchInlineSnapshot(`
        "[vike][Warning] The following import in /pages/sideEffectJsx/+config.js has no effect:
          import '../../components/Layout.jsx'
        See https://vike.dev/config#pointer-imports"
      `)
    } finally {
      warn.mockRestore()
    }

    writeFiles({
      'pages/sideEffectCss/+config.ts': ["import '../../components/style.css'", 'export default {}'].join('\n'),
    })
    const err = await getErr(load('/pages/sideEffectCss/+config.ts'))
    expect(normalize(err.message)).toMatchInlineSnapshot(`
      "[vike][Wrong Usage] The following import in /pages/sideEffectCss/+config.ts has no effect:
        import '../../components/style.css'
      See https://vike.dev/config#pointer-imports"
    `)

    writeFiles({
      'pages/sideEffectCssBlockComment/+config.ts': [
        "import /* some comment */ '../../components/style.css'",
        'export default {}',
      ].join('\n'),
      'pages/sideEffectCssLineComment/+config.ts': [
        'import // some comment',
        "  '../../components/style.css'",
        'export default {}',
      ].join('\n'),
      'pages/sideEffectCssEmptyImportClause/+config.js': [
        "import {} from '../../components/style.css'",
        'export default {}',
      ].join('\n'),
    })
    for (const filePath of [
      '/pages/sideEffectCssBlockComment/+config.ts',
      '/pages/sideEffectCssLineComment/+config.ts',
      '/pages/sideEffectCssEmptyImportClause/+config.js',
    ]) {
      const err = await getErr(load(filePath))
      expect(stripAnsi(err.message)).toContain(`The following import in ${filePath} has no effect`)
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
})

async function load(filePathAbsoluteUserRootDir: string) {
  const buildCache: BuildCache = { transpileCache: {}, vikeConfigDependencies: new Set() }
  const getDependencies = () =>
    Array.from(buildCache.vikeConfigDependencies)
      .map((filePath) => {
        expect(filePath.startsWith(userRootDir)).toBe(true)
        return filePath.slice(userRootDir.length)
      })
      // Modules are loaded in parallel
      .sort()
  const filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  try {
    const { fileExports } = await transpileAndExecuteFile(filePath, userRootDir, false, buildCache)
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

function normalize(str: string) {
  return stripAnsi(str).replaceAll(userRootDir, '<userRootDir>')
}

function writeFiles(files: Record<string, string>) {
  Object.entries(files).forEach(([filePathRelative, fileContent]) => {
    const filePath = path.join(userRootDir, filePathRelative)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, fileContent)
  })
}
