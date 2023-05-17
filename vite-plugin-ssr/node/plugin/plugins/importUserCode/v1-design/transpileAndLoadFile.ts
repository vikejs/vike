export { transpileAndLoadConfigFile }
export { transpileAndLoadValueFile }

import esbuild, { type BuildResult, type BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'
import pc from '@brillout/picocolors'
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
import { isImportData, replaceImportStatements, type FileImport } from './replaceImportStatements'

assertIsVitePluginCode()

type Result = { fileExports: Record<string, unknown> }

async function transpileAndLoadConfigFile(
  filePathAbsolute: string,
  filePathRelativeToUserRootDir: string | null
): Promise<Result> {
  return transpileAndLoadFile(filePathAbsolute, true, filePathRelativeToUserRootDir)
}

async function transpileAndLoadValueFile(filePathAbsolute: string): Promise<Result> {
  return transpileAndLoadFile(filePathAbsolute, false)
}

async function transpileAndLoadFile(filePathAbsolute: string, isPageConfig: false): Promise<Result>
async function transpileAndLoadFile(
  filePathAbsolute: string,
  isPageConfig: true,
  filePathRelativeToUserRootDir: string | null
): Promise<Result>
async function transpileAndLoadFile(
  filePathAbsolute: string,
  isPageConfig: boolean,
  filePathRelativeToUserRootDir?: string | null
): Promise<Result> {
  assertPosixPath(filePathAbsolute)
  /* Solide removes the + symbol when building its + files
   *  - https://github.com/magne4000/solide
  assert(filePathAbsolute.includes('+'))
  assert(isPageConfig === path.posix.basename(filePathAbsolute).includes('+config'))
  */
  const buildResult = await buildFile(filePathAbsolute, { bundle: !isPageConfig })
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
    markAsUserLandError(err)
    throw err
  } finally {
    clean()
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - We don't need this special object
  fileExports = { ...fileExports }
  if (isPageConfig) {
    assert(fileImports)
    assert(filePathRelativeToUserRootDir !== undefined)
    const filePath = filePathRelativeToUserRootDir ?? filePathAbsolute
    assertFileImports(fileImports, fileExports, filePath)
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
    markAsUserLandError(err)
    throw err
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
  // Syntax with semicolon `[build:${/*...*/}]` doesn't work on Windows: https://github.com/brillout/vite-plugin-ssr/issues/800#issuecomment-1517329455
  const tag = `[build-${getRandomId(12)}]`
  const filePathTmp = path.posix.join(dirname, `${tag}${filename}.mjs`)
  return filePathTmp
}

function assertFileImports(
  fileImports: (FileImport & { isReExported?: true })[],
  fileExports: Record<string, unknown>,
  filePath: string
) {
  assertDefaultExportObject(fileExports, filePath)
  const exportedStrings = getExportedStrings(fileExports.default)
  Object.values(exportedStrings).forEach((exportVal) => {
    if (typeof exportVal !== 'string') return
    if (!isImportData(exportVal)) return
    const importData = exportVal
    fileImports.forEach((fileImport) => {
      if (fileImport.data === importData) {
        fileImport.isReExported = true
      }
    })
  })

  const fileImportsUnused = fileImports.filter((fi) => !fi.isReExported)
  if (fileImportsUnused.length === 0) return

  const importStatements = unique(fileImportsUnused.map((fi) => fi.code))
  const importNamesUnused: string = fileImportsUnused.map((fi) => pc.cyan(fi.importVarName)).join(', ')
  const singular = fileImportsUnused.length === 1
  assertWarning(
    fileImportsUnused.length === 0,
    [
      `${filePath} imports the following:`,
      ...importStatements.map((s) => `  ${s}`),
      `The import${singular ? '' : 's'} ${importNamesUnused} ${singular ? "isn't" : "aren't"} re-exported at ${pc.cyan(
        'export default { ... }'
      )} but imports should always be re-exported, see https://vite-plugin-ssr.com/config-code-splitting`
    ].join('\n'),
    { onlyOnce: true, showStackTrace: false }
  )
}

function getExportedStrings(obj: Record<string, unknown>): string[] {
  const exportedStrings: string[] = []
  Object.values(obj).forEach((val) => {
    if (typeof val === 'string') {
      exportedStrings.push(val)
    } else if (Array.isArray(val)) {
      val.forEach((v) => {
        if (typeof v === 'string') {
          exportedStrings.push(v)
        }
      })
    }
  })
  return exportedStrings
}

// TODO: implement. Or remove? Is it really needed?
function isUserLandError() {}
function markAsUserLandError(err: unknown) {}
