export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExececutionErrorIntroMsg }
export { isTmpFile }

import { build, type BuildResult, type BuildOptions, formatMessages } from 'esbuild'
import fs from 'fs'
import path from 'path'
import pc from '@brillout/picocolors'
import { import_ } from '@brillout/import'
import {
  assertPosixPath,
  getRandomId,
  assertIsNotProductionRuntime,
  assert,
  assertDefaultExportObject,
  unique,
  assertWarning,
  isObject,
  toPosixPath
} from '../../../utils.js'
import { isImportData, replaceImportStatements, type FileImport } from './replaceImportStatements.js'
import { vikeConfigDependencies } from './getVikeConfig.js'
import 'source-map-support/register.js'
import { type FilePath, getFilePathToShowToUser } from './getFilePathToShowToUser.js'

assertIsNotProductionRuntime()

async function transpileAndExecuteFile(
  filePath: FilePath,
  isValueFile: boolean,
  userRootDir: string
): Promise<{ fileExports: Record<string, unknown> }> {
  const { code, fileImports } = await transpileFile(filePath, isValueFile, userRootDir)
  const { fileExports } = await executeFile(filePath, code, fileImports)
  return { fileExports }
}

async function transpileFile(filePath: FilePath, isValueFile: boolean, userRootDir: string) {
  const { filePathAbsolute } = filePath
  assertPosixPath(filePathAbsolute)
  vikeConfigDependencies.add(filePathAbsolute)
  let code = await transpileWithEsbuild(filePath, isValueFile, userRootDir)

  let fileImports: FileImport[] | null = null
  {
    const res = transpileImports(code, filePath, isValueFile)
    if (res) {
      code = res.code
      fileImports = res.fileImports
    }
  }
  return { code, fileImports }
}

function transpileImports(codeOriginal: string, filePath: FilePath, isValueFile: boolean) {
  // Do we need to remove the imports?
  const { filePathAbsolute } = filePath
  assertPosixPath(filePathAbsolute)
  const isHeader = isHeaderFile(filePathAbsolute)
  const isPageConfigFile = !isValueFile
  if (!isHeader && !isPageConfigFile) {
    return null
  }
  const filePathToShowToUser = getFilePathToShowToUser(filePath)
  assertWarning(
    isPageConfigFile,
    `${filePathToShowToUser} is a JavaScript header file (.h.js), but JavaScript header files should only be used for +config.h.js, see https://vite-plugin-ssr.com/header-file`,
    { onlyOnce: true }
  )

  // Remove the imports
  const res = replaceImportStatements(codeOriginal, filePathToShowToUser)
  if (res.noImportStatement) {
    return null
  }
  const { code, fileImports } = res
  if (!isHeader) {
    const filePathCorrect = appendHeaderFileExtension(filePathToShowToUser)
    assertWarning(
      false,
      `Rename ${filePathToShowToUser} to ${filePathCorrect}, see https://vite-plugin-ssr.com/header-file`,
      { onlyOnce: true }
    )
  }
  return { code, fileImports }
}

async function transpileWithEsbuild(filePath: FilePath, bundle: boolean, userRootDir: string) {
  const entryFilePath = filePath.filePathAbsolute
  const entryFileDir = path.posix.dirname(entryFilePath)
  const options: BuildOptions = {
    platform: 'node',
    entryPoints: [entryFilePath],
    sourcemap: 'inline',
    write: false,
    target: ['node14.18', 'node16'],
    outfile: path.posix.join(
      // Needed for correct inline source map
      entryFileDir,
      // `write: false` => no file is actually be emitted
      'NEVER_EMITTED.js'
    ),
    logLevel: 'silent',
    format: 'esm',
    bundle,
    minify: false,
    metafile: bundle,
    absWorkingDir: userRootDir
  }
  if (bundle) {
    options.bundle = true
    options.packages = 'external'
    options.plugins = [
      {
        name: 'vite-plugin-ssr:import-hook',
        setup(b) {
          b.onLoad({ filter: /./ }, (args) => {
            let { path } = args
            path = toPosixPath(path)
            // We collect the dependency args.path in case it fails to build (upon build error => error is thrown => no metafile)
            vikeConfigDependencies.add(path)
            return undefined
          })
          /* To exhaustively collect all dependencies upon build failure, we would also need to use onResolve().
           *  - Because onLoad() isn't call if the config dependency can't be resolved.
           *  - For example, the following breaks auto-reload (the config is stuck in its error state and the user needs to touch the importer for the config to reload):
           *    ```bash
           *    mv ./some-config-dependency.js /tmp/ && mv /tmp/some-config-dependency.js .
           *    ```
           *  - But implementing a fix is complex and isn't worth it.
          b.onResolve(...)
          */
        }
      }
    ]
  } else {
    // Avoid dead-code elimination to ensure unused imports aren't removed.
    // Esbuild still sometimes removes unused imports because of TypeScript: https://github.com/evanw/esbuild/issues/3034
    options.treeShaking = false
  }

  let result: BuildResult
  try {
    result = await build(options)
  } catch (err) {
    await formatBuildErr(err, filePath)
    throw err
  }
  if (bundle) {
    assert(result.metafile)
    Object.keys(result.metafile.inputs).forEach((filePathRelative) => {
      filePathRelative = toPosixPath(filePathRelative)
      assertPosixPath(userRootDir)
      const filePathAbsolute = path.posix.join(userRootDir, filePathRelative)
      vikeConfigDependencies.add(filePathAbsolute)
    })
  }
  const code = result.outputFiles![0]!.text
  assert(typeof code === 'string')
  return code
}

async function executeFile(filePath: FilePath, code: string, fileImports: FileImport[] | null) {
  const { filePathAbsolute, filePathRelativeToUserRootDir } = filePath
  // Alternative to using a temporary file: https://github.com/vitejs/vite/pull/13269
  //  - But seems to break source maps, so I don't think it's worth it
  const filePathTmp = getFilePathTmp(filePathAbsolute)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => fs.unlinkSync(filePathTmp)
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await import_(filePathTmp)
  } catch (err) {
    triggerPrepareStackTrace(err)
    const errIntroMsg = getErrIntroMsg('execute', filePath)
    assert(isObject(err))
    execErrIntroMsg.set(err, errIntroMsg)
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

const formatted = '_formatted'
function getConfigBuildErrorFormatted(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!(formatted in err)) return null
  assert(typeof err[formatted] === 'string')
  return err[formatted]
}
async function formatBuildErr(err: unknown, filePath: FilePath): Promise<void> {
  assert(isObject(err) && err.errors)
  const msgEsbuild = (
    await formatMessages(err.errors as any, {
      kind: 'error',
      color: true
    })
  )
    .map((m) => m.trim())
    .join('\n')
  const msgIntro = getErrIntroMsg('transpile', filePath)
  err[formatted] = `${msgIntro}\n${msgEsbuild}`
}

const execErrIntroMsg = new WeakMap<object, string>()
function getConfigExececutionErrorIntroMsg(err: unknown): string | null {
  if (!isObject(err)) return null
  const errIntroMsg = execErrIntroMsg.get(err)
  return errIntroMsg ?? null
}

const tmpPrefix = `[build-`
function getFilePathTmp(filePath: string): string {
  assertPosixPath(filePath)
  const dirname = path.posix.dirname(filePath)
  const filename = path.posix.basename(filePath)
  // Syntax with semicolon `[build:${/*...*/}]` doesn't work on Windows: https://github.com/brillout/vite-plugin-ssr/issues/800#issuecomment-1517329455
  const tag = `${tmpPrefix}${getRandomId(12)}]`
  const filePathTmp = path.posix.join(dirname, `${tag}${filename}.mjs`)
  return filePathTmp
}
function isTmpFile(filePath: string): boolean {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  return fileName.startsWith(tmpPrefix)
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
    { onlyOnce: true }
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

// Needed for the npm package 'source-map-support'. The Error.prepareStackTrace() hook of 'source-map-support' needs to be called before the file containing the source map is removed. The clean() call above removes the transpiled file from disk but it contains the inline source map.
function triggerPrepareStackTrace(err: unknown) {
  if (isObject(err)) {
    // Accessing err.stack triggers prepareStackTrace()
    const { stack } = err
    // Ensure no compiler removes the line above
    if (1 + 1 === 3) console.log('I_AM_NEVER_SHOWN' + stack)
  }
}

function getErrIntroMsg(operation: 'transpile' | 'execute', filePath: FilePath) {
  const msg = [
    pc.red(`Failed to ${operation}`),
    pc.red(pc.bold(getFilePathToShowToUser(filePath))),
    pc.red(`because:`)
  ].join(' ')
  return msg
}
