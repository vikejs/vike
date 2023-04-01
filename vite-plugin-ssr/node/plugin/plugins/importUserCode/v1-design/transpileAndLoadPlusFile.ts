export { transpileAndLoadPageConfig }
export { transpileAndLoadConfigValueFile }

import esbuild, { type BuildResult, type BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'
import pc from 'picocolors'
import { import_ } from '@brillout/import'
import {
  assertPosixPath,
  getRandomId,
  assertIsVitePluginCode,
  assert,
  assertDefaultExportObject,
  unique,
  assertWarning
} from '../../../utils'
import { isImportMacro, replaceImportStatements, type FileImport } from './replaceImportStatements'

assertIsVitePluginCode()

type Result = { fileExports: Record<string, unknown> } | { err: unknown }

async function transpileAndLoadPageConfig(
  filePathAbsolute: string,
  filePathRelativeToUserRootDir: string
): Promise<Result> {
  return transpileAndLoadPlusFile(filePathAbsolute, true, filePathRelativeToUserRootDir)
}

async function transpileAndLoadConfigValueFile(filePathAbsolute: string): Promise<Result> {
  return transpileAndLoadPlusFile(filePathAbsolute, false)
}

async function transpileAndLoadPlusFile(filePathAbsolute: string, isPageConfig: false): Promise<Result>
async function transpileAndLoadPlusFile(
  filePathAbsolute: string,
  isPageConfig: true,
  filePathRelativeToUserRootDir: string
): Promise<Result>
async function transpileAndLoadPlusFile(
  filePathAbsolute: string,
  isPageConfig: boolean,
  filePathRelativeToUserRootDir?: string
): Promise<Result> {
  assertPosixPath(filePathAbsolute)
  /* Solide removes the + symbol when building its + files
   *  - https://github.com/magne4000/solide
  assert(filePathAbsolute.includes('+'))
  assert(isPageConfig === path.posix.basename(filePathAbsolute).includes('+config'))
  */
  const buildResult = await buildFile(filePathAbsolute, { bundle: !isPageConfig })
  if ('err' in buildResult) {
    return { err: buildResult.err }
  }
  let { code } = buildResult
  let fileImports: FileImport[] | null = null
  if (isPageConfig) {
    const res = replaceImportStatements(code)
    code = res.code
    fileImports = res.fileImports
  }
  const filePathTmp = getFilePathTmp(filePathAbsolute)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => fs.unlinkSync(filePathTmp)
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await import_(filePathTmp)
  } catch (err) {
    return { err }
  } finally {
    clean()
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - We don't need this special object
  fileExports = { ...fileExports }
  if (isPageConfig) {
    assert(fileImports)
    assert(filePathRelativeToUserRootDir)
    assertFileImports(fileImports, fileExports, filePathRelativeToUserRootDir)
  }
  return { fileExports }
}

async function buildFile(filePathAbsolute: string, { bundle }: { bundle: boolean }) {
  const options: BuildOptions = {
    platform: 'node',
    entryPoints: [filePathAbsolute],
    sourcemap: 'inline',
    write: false,
    target: ['node14.18', 'node16'],
    outfile: 'NEVER_EMITTED.js',
    logLevel: 'silent',
    format: 'esm',
    bundle,
    minify: false
  }
  if (bundle) {
    options.bundle = true
    options.packages = 'external'
  } else {
    // Avoid dead-code elimination to ensure unused imports aren't removed.
    // Esbuild still sometimes removes unused imports because of TypeScript: https://github.com/evanw/esbuild/issues/3034
    options.treeShaking = false
  }

  let result: BuildResult
  try {
    result = await esbuild.build(options)
  } catch (err) {
    // TODO: let the error throw?
    return { err }
  }
  const { text } = result.outputFiles![0]!
  return {
    code: text
  }
}

function getFilePathTmp(filePath: string): string {
  assertPosixPath(filePath)
  const dirname = path.posix.dirname(filePath)
  const filename = path.posix.basename(filePath)
  const tag = `[build:${getRandomId(12)}]`
  const filePathTmp = path.posix.join(dirname, `${tag}${filename}.mjs`)
  return filePathTmp
}

function assertFileImports(
  fileImports: (FileImport & { isReExported?: true })[],
  fileExports: Record<string, unknown>,
  filePathRelativeToUserRootDir: string
) {
  assertDefaultExportObject(fileExports, filePathRelativeToUserRootDir)
  Object.values(fileExports.default).forEach((exportVal) => {
    if (typeof exportVal !== 'string') return
    if (!isImportMacro(exportVal)) return
    const importMacro = exportVal
    const found = fileImports.filter((fi) => fi.data === importMacro)
    assert(found.length === 1)
    found[0]!.isReExported = true
  })

  const fileImportsUnused = fileImports.filter((fi) => !fi.isReExported)
  if (fileImportsUnused.length === 0) return

  const importStatements = unique(fileImportsUnused.map((fi) => fi.code))
  const importNamesUnused: string = fileImportsUnused.map((fi) => pc.bold(pc.red(fi.importVarName))).join(', ')
  const singular = fileImportsUnused.length === 1
  assertWarning(
    fileImportsUnused.length === 0,
    [
      `${pc.cyan(filePathRelativeToUserRootDir)} imports the following:`,
      ...importStatements.map((s) => `  ${pc.cyan(s)}`),
      `The import${singular ? '' : 's'} ${importNamesUnused} ${singular ? "isn't" : "aren't"} used for ${pc.cyan(
        'export default { ... }'
      )} but imports should always be re-exported, see https://vite-plugin-ssr.com/config#import-rules`
    ].join('\n'),
    { onlyOnce: true, showStackTrace: false }
  )
}
