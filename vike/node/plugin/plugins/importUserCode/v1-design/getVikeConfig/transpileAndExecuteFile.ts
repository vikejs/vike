export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExecutionErrorIntroMsg }
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
  unique,
  assertWarning,
  isObject,
  toPosixPath
} from '../../../../utils.js'
import { isImportData, transformFileImports, type FileImport } from './transformFileImports.js'
import { vikeConfigDependencies } from '../getVikeConfig.js'
import 'source-map-support/register.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/PageConfig.js'
import { getConfigFileExport } from '../getConfigFileExport.js'

assertIsNotProductionRuntime()

async function transpileAndExecuteFile(
  filePath: FilePathResolved,
  transformImports: boolean,
  userRootDir: string,
  doNotTranspile = false
): Promise<{ fileExports: Record<string, unknown> }> {
  const { filePathAbsoluteFilesystem } = filePath
  if (doNotTranspile) {
    assert(!transformImports)
    const fileExports = await executeFile(filePathAbsoluteFilesystem, filePath)
    if (isHeaderFile(filePathAbsoluteFilesystem)) {
      const filePathToShowToUser2 = getFilePathToShowToUser2(filePath)
      assertWarning(
        false,
        `${filePathToShowToUser2} is a JavaScript header file (.h.js), but JavaScript header files don't apply to the config files of extensions`,
        { onlyOnce: true }
      )
    }
    return { fileExports }
  } else {
    const { code, fileImportsTransformed } = await transpileFile(filePath, transformImports, userRootDir)
    const fileExports = await executeTranspiledFile(filePath, code, fileImportsTransformed)
    return { fileExports }
  }
}

async function transpileFile(filePath: FilePathResolved, transformImports: boolean, userRootDir: string) {
  const { filePathAbsoluteFilesystem } = filePath
  const filePathToShowToUser2 = getFilePathToShowToUser2(filePath)
  assertPosixPath(filePathAbsoluteFilesystem)
  vikeConfigDependencies.add(filePathAbsoluteFilesystem)

  let code = await transpileWithEsbuild(filePath, userRootDir, transformImports)

  let fileImportsTransformed: FileImport[] | null = null
  if (transformImports) {
    const res = transformFileImports_(code, filePath)
    if (res) {
      code = res.code
      fileImportsTransformed = res.fileImportsTransformed
    }
  } else {
    if (isHeaderFile(filePathAbsoluteFilesystem)) {
      assertWarning(
        false,
        `${filePathToShowToUser2} is a JavaScript header file (.h.js), but JavaScript header files only apply to +config.h.js, see https://vike.dev/header-file`,
        { onlyOnce: true }
      )
    }
  }
  return { code, fileImportsTransformed }
}

function transformFileImports_(codeOriginal: string, filePath: FilePathResolved) {
  const { filePathAbsoluteFilesystem } = filePath
  const filePathToShowToUser2 = getFilePathToShowToUser2(filePath)

  // Replace import statements with import strings
  const res = transformFileImports(codeOriginal, filePathToShowToUser2)
  if (res.noTransformation) {
    return null
  }
  const { code, fileImportsTransformed } = res

  if (!isHeaderFile(filePathAbsoluteFilesystem)) {
    const filePathCorrect = appendHeaderFileExtension(filePathToShowToUser2)
    assertWarning(false, `Rename ${filePathToShowToUser2} to ${filePathCorrect}, see https://vike.dev/header-file`, {
      onlyOnce: true
    })
  }

  return { code, fileImportsTransformed }
}

async function transpileWithEsbuild(filePath: FilePathResolved, userRootDir: string, transformImports: boolean) {
  const entryFilePath = filePath.filePathAbsoluteFilesystem
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
    absWorkingDir: userRootDir,
    // Disable tree-shaking to avoid dead-code elimination, so that unused imports aren't removed.
    // Esbuild still sometimes removes unused imports because of TypeScript: https://github.com/evanw/esbuild/issues/3034
    treeShaking: false,
    minify: false,
    metafile: !transformImports,
    // We cannot bundle imports that are meant to be transformed
    bundle: !transformImports
  }

  // Track dependencies
  if (!transformImports) {
    options.packages = 'external'
    options.plugins = [
      {
        name: 'vike:dependency-tracker',
        setup(b) {
          b.onLoad({ filter: /./ }, (args) => {
            // We collect the dependency `args.path` in case the bulid fails (upon build error => error is thrown => no metafile)
            let { path } = args
            path = toPosixPath(path)
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
  }

  let result: BuildResult
  try {
    result = await build(options)
  } catch (err) {
    await formatBuildErr(err, filePath)
    throw err
  }

  // Track dependencies
  if (!transformImports) {
    assert(result.metafile)
    Object.keys(result.metafile.inputs).forEach((filePathRelative) => {
      filePathRelative = toPosixPath(filePathRelative)
      assertPosixPath(userRootDir)
      const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathRelative)
      vikeConfigDependencies.add(filePathAbsoluteFilesystem)
    })
  }

  const code = result.outputFiles![0]!.text
  assert(typeof code === 'string')
  return code
}

async function executeTranspiledFile(
  filePath: FilePathResolved,
  code: string,
  fileImportsTransformed: FileImport[] | null
) {
  const { filePathAbsoluteFilesystem, filePathRelativeToUserRootDir } = filePath
  // Alternative to using a temporary file: https://github.com/vitejs/vite/pull/13269
  //  - But seems to break source maps, so I don't think it's worth it
  const filePathTmp = getFilePathTmp(filePathAbsoluteFilesystem)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => fs.unlinkSync(filePathTmp)
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await executeFile(filePathTmp, filePath)
  } finally {
    clean()
  }
  if (fileImportsTransformed) {
    assert(filePathRelativeToUserRootDir !== undefined)
    const filePathToShowToUser2 = getFilePathToShowToUser2(filePath)
    assertImportsAreReExported(fileImportsTransformed, fileExports, filePathToShowToUser2)
  }
  return fileExports
}

async function executeFile(filePathToExecuteAbsoluteFilesystem: string, filePathSourceFile: FilePathResolved) {
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await import_(filePathToExecuteAbsoluteFilesystem)
  } catch (err) {
    triggerPrepareStackTrace(err)
    const errIntroMsg = getErrIntroMsg('execute', filePathSourceFile)
    assert(isObject(err))
    execErrIntroMsg.set(err, errIntroMsg)
    throw err
  }
  // Return a plain JavaScript object:
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - We don't need this special object.
  fileExports = { ...fileExports }
  return fileExports
}

const formatted = '_formatted'
function getConfigBuildErrorFormatted(err: unknown): null | string {
  if (!isObject(err)) return null
  if (!(formatted in err)) return null
  assert(typeof err[formatted] === 'string')
  return err[formatted]
}
async function formatBuildErr(err: unknown, filePath: FilePathResolved): Promise<void> {
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
function getConfigExecutionErrorIntroMsg(err: unknown): string | null {
  if (!isObject(err)) return null
  const errIntroMsg = execErrIntroMsg.get(err)
  return errIntroMsg ?? null
}

const tmpPrefix = `[build-`
function getFilePathTmp(filePathAbsoluteFilesystem: string): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  const dirname = path.posix.dirname(filePathAbsoluteFilesystem)
  const filename = path.posix.basename(filePathAbsoluteFilesystem)
  // Syntax with semicolon `[build:${/*...*/}]` doesn't work on Windows: https://github.com/vikejs/vike/issues/800#issuecomment-1517329455
  const tag = `${tmpPrefix}${getRandomId(12)}]`
  const filePathTmp = path.posix.join(dirname, `${tag}${filename}.mjs`)
  return filePathTmp
}
function isTmpFile(filePath: string): boolean {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  return fileName.startsWith(tmpPrefix)
}

function assertImportsAreReExported(
  fileImportsTransformed: (FileImport & { isReExported?: true })[],
  fileExports: Record<string, unknown>,
  filePathToShowToUser2: string
) {
  const fileExport = getConfigFileExport(fileExports, filePathToShowToUser2)
  const exportedStrings = getExportedStrings(fileExport)
  Object.values(exportedStrings).forEach((exportVal) => {
    if (typeof exportVal !== 'string') return
    if (!isImportData(exportVal)) return
    const importString = exportVal
    fileImportsTransformed.forEach((fileImport) => {
      if (fileImport.importString === importString) {
        fileImport.isReExported = true
      }
    })
  })

  const fileImportsTransformedUnused = fileImportsTransformed.filter((fi) => !fi.isReExported)
  if (fileImportsTransformedUnused.length === 0) return

  const importStatements = unique(fileImportsTransformedUnused.map((fi) => fi.importStatementCode))
  const importNamesUnused: string = fileImportsTransformedUnused.map((fi) => pc.cyan(fi.importLocalName)).join(', ')
  const singular = fileImportsTransformedUnused.length === 1
  assertWarning(
    fileImportsTransformedUnused.length === 0,
    [
      `${filePathToShowToUser2} imports the following:`,
      ...importStatements.map((s) => pc.cyan(`  ${s}`)),
      `But the import${singular ? '' : 's'} ${importNamesUnused} ${
        singular ? "isn't" : "aren't"
      } re-exported at ${pc.cyan('export default { ... }')} and therefore ${
        singular ? 'has' : 'have'
      } no effect, see explanation at https://vike.dev/header-file`
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
  assertPosixPath(filePath)
  const fileExtensions = getFileExtensions(filePath)
  return fileExtensions.includes('h')
}
function getFileExtensions(filePath: string) {
  const fileExtensions = path.posix.basename(filePath).split('.').slice(1)
  return fileExtensions
}
function appendHeaderFileExtension(filePath: string) {
  assertPosixPath(filePath)
  const fileNameParts = path.posix.basename(filePath).split('.')
  fileNameParts.splice(-1, 0, 'h')
  const basenameCorrect = fileNameParts.join('.')
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

function getErrIntroMsg(operation: 'transpile' | 'execute', filePath: FilePathResolved) {
  const filePathToShowToUser2 = getFilePathToShowToUser2(filePath)
  const msg = [
    // prettier ignore
    pc.red(`Failed to ${operation}`),
    pc.bold(pc.red(filePathToShowToUser2)),
    pc.red(`because:`)
  ].join(' ')
  return msg
}

/** `filePath.filePathToShowToUser` may show the import path of a package, use `filePathToShowToUser2` instead always show a file path instead. */
function getFilePathToShowToUser2(filePath: FilePathResolved): string {
  const { filePathAbsoluteFilesystem, filePathRelativeToUserRootDir } = filePath
  const filePathToShowToUser2 = filePathRelativeToUserRootDir || filePathAbsoluteFilesystem
  assert(filePathToShowToUser2)
  return filePathToShowToUser2
}
