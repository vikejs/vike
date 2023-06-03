export { transpileAndLoadFile }

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
import { getConfigData_dependenciesInvisibleToVite, type FilePath } from './getConfigData'

assertIsVitePluginCode()

type Result = { fileExports: Record<string, unknown> }

async function transpileAndLoadFile(filePath: FilePath, isPageConfig: boolean): Promise<Result> {
  const { filePathAbsolute, filePathRelativeToUserRootDir } = filePath
  const filePathToShowToUser = filePathRelativeToUserRootDir ?? filePathAbsolute
  assertPosixPath(filePathAbsolute)
  getConfigData_dependenciesInvisibleToVite.add(filePathAbsolute)
  const buildResult = await buildFile(filePathAbsolute, { bundle: !isPageConfig })
  let { code } = buildResult
  let fileImports: FileImport[] | null = null
  const isHeader = isHeaderFile(filePathAbsolute)
  if (isPageConfig || isHeader) {
    assertWarning(
      isPageConfig,
      `${filePathToShowToUser} is a JavaScript header file (.h.js), but JavaScript header files should only be used for +config.h.js, see https://vite-plugin-ssr.com/header-file`,
      { onlyOnce: true, showStackTrace: false }
    )
    const res = replaceImportStatements(code, filePathToShowToUser)
    if (!res.noImportStatement) {
      if (!isHeader) {
        const filePathCorrect = appendHeaderFileExtension(filePathToShowToUser)
        assertWarning(
          false,
          `Rename ${filePathToShowToUser} to ${filePathCorrect}, see https://vite-plugin-ssr.com/header-file`,
          { onlyOnce: true, showStackTrace: false }
        )
      }
      code = res.code
      fileImports = res.fileImports
    }
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
  if (fileImports) {
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
    const importDataString = exportVal
    fileImports.forEach((fileImport) => {
      if (fileImport.importDataString === importDataString) {
        fileImport.isReExported = true
      }
    })
  })

  const fileImportsUnused = fileImports.filter((fi) => !fi.isReExported)
  if (fileImportsUnused.length === 0) return

  const importStatements = unique(fileImportsUnused.map((fi) => fi.importStatementCode))
  const importNamesUnused: string = fileImportsUnused.map((fi) => pc.cyan(fi.importLocalName)).join(', ')
  const singular = fileImportsUnused.length === 1
  assertWarning(
    fileImportsUnused.length === 0,
    [
      `${filePath} imports the following:`,
      ...importStatements.map((s) => pc.cyan(`  ${s}`)),
      `But the import${singular ? '' : 's'} ${importNamesUnused} ${
        singular ? "isn't" : "aren't"
      } re-exported at ${pc.cyan('export default { ... }')} and therefore ${
        singular ? 'has' : 'have'
      } no effect, see explanation at https://vite-plugin-ssr.com/header-file`
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

function isHeaderFile(filePath: string) {
  const basenameParts = path.posix.basename(filePath).split('.')
  return basenameParts.includes('h')
}
function appendHeaderFileExtension(filePath: string) {
  const basenameParts = path.posix.basename(filePath).split('.')
  basenameParts.splice(-1, 0, 'h')
  const basenameCorrect = basenameParts.join('.')
  return path.posix.join(path.posix.dirname(filePath), basenameCorrect)
}

// TODO: implement. Or remove? Is it really needed?
function isUserLandError() {}
function markAsUserLandError(err: unknown) {}
