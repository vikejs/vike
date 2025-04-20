export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExecutionErrorIntroMsg }
export { isTemporaryBuildFile }
export type { EsbuildCache }

import {
  build,
  type BuildResult,
  type BuildOptions,
  formatMessages,
  type Message,
  version,
  type ResolveResult,
  type OnResolveResult
} from 'esbuild'
import fs from 'fs'
import path from 'path'
import pc from '@brillout/picocolors'
import { import_ } from '@brillout/import'
import {
  assertPosixPath,
  getRandomId,
  assertIsNotProductionRuntime,
  assert,
  assertWarning,
  isObject,
  toPosixPath,
  assertUsage,
  isPlainJavaScriptFile,
  createDebugger,
  assertFilePathAbsoluteFilesystem,
  assertIsImportPathNpmPackage,
  genPromise,
  isVitest,
  requireResolveOptional,
  isImportPathNpmPackageOrPathAlias,
  isImportPathRelative
} from '../../../../utils.js'
import { transformPointerImports } from './pointerImports.js'
import sourceMapSupport from 'source-map-support'
import type { FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'
import { getFilePathAbsoluteUserRootDir } from '../../../../shared/getFilePath.js'

assertIsNotProductionRuntime()
installSourceMapSupport()
const debug = createDebugger('vike:pointer-imports')
const debugEsbuildResolve = createDebugger('vike:esbuild-resolve')
if (debugEsbuildResolve.isActivated) debugEsbuildResolve('esbuild version', version)

type FileExports = { fileExports: Record<string, unknown> }

type EsbuildCache = {
  transpileCache: Record<
    string, // filePathAbsoluteFilesystem
    Promise<FileExports>
  >
  vikeConfigDependencies: Set<string>
}
async function transpileAndExecuteFile(
  filePath: FilePathResolved,
  userRootDir: string,
  isExtensionConfig: boolean,
  esbuildCache: EsbuildCache
): Promise<FileExports> {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath
  assert(filePathAbsoluteFilesystem)
  const fileExtension = getFileExtension(filePathAbsoluteFilesystem)

  if (esbuildCache.transpileCache[filePathAbsoluteFilesystem]) {
    return await esbuildCache.transpileCache[filePathAbsoluteFilesystem]
  }
  const { promise, resolve } = genPromise<FileExports>()
  esbuildCache.transpileCache[filePathAbsoluteFilesystem] = promise

  assertUsage(
    isPlainJavaScriptFile(filePathAbsoluteFilesystem),
    `${filePathToShowToUserResolved} has file extension .${fileExtension} but a config file can only be a JavaScript/TypeScript file`
  )
  const isHeader = isHeaderFile(filePathAbsoluteFilesystem)
  if (isHeader) {
    assertWarning(
      false,
      `${pc.cyan(
        '.h.js'
      )} files are deprecated: simply renaming ${filePathToShowToUserResolved} to ${removeHeaderFileExtension(
        filePathToShowToUserResolved
      )} is usually enough, although you may occasionally need to use ${pc.cyan(
        "with { type: 'pointer' }"
      )} as explained at https://vike.dev/config#pointer-imports`,
      { onlyOnce: true }
    )
  }

  let fileExports: FileExports['fileExports']
  if (isExtensionConfig && !isHeader && fileExtension.endsWith('js')) {
    // This doesn't track dependencies => we should never use this for user land configs
    fileExports = await executeFile(filePathAbsoluteFilesystem, filePath)
  } else {
    const transformImports = isHeader ? 'all' : true
    const code = await transpileFile(filePath, transformImports, userRootDir, esbuildCache)
    fileExports = await executeTranspiledFile(filePath, code)
  }

  resolve({ fileExports })
  return { fileExports }
}

async function transpileFile(
  filePath: FilePathResolved,
  transformImports: boolean | 'all',
  userRootDir: string,
  esbuildCache: EsbuildCache
) {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath

  assert(filePathAbsoluteFilesystem)
  assertPosixPath(filePathAbsoluteFilesystem)
  esbuildCache.vikeConfigDependencies.add(filePathAbsoluteFilesystem)

  if (debug.isActivated) debug('transpile', filePathToShowToUserResolved)
  let { code, pointerImports } = await transpileWithEsbuild(filePath, userRootDir, transformImports, esbuildCache)
  if (debug.isActivated) debug(`code, post esbuild (${filePathToShowToUserResolved})`, code)

  let isImportTransformed = false
  if (transformImports) {
    const codeMod = transformPointerImports(code, filePathToShowToUserResolved, pointerImports)
    if (codeMod) {
      code = codeMod
      isImportTransformed = true
      if (debug.isActivated) debug(`code, post pointer imports transform (${filePathToShowToUserResolved})`, code)
    }
  }
  if (!isImportTransformed) {
    if (debug.isActivated) debug(`code, no pointer imports (${filePathToShowToUserResolved})`)
  }
  return code
}

async function transpileWithEsbuild(
  filePath: FilePathResolved,
  userRootDir: string,
  transformImports: boolean | 'all',
  esbuildCache: EsbuildCache
) {
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
      // `write: false` => no file is actually emitted
      'NEVER_EMITTED.js'
    ),
    logLevel: 'silent',
    format: 'esm',
    absWorkingDir: userRootDir,
    // Disable tree-shaking to avoid dead-code elimination, so that unused imports aren't removed.
    // Esbuild still sometimes removes unused imports because of TypeScript: https://github.com/evanw/esbuild/issues/3034
    treeShaking: false,
    minify: false,
    metafile: true,
    bundle: true
  }

  const pointerImports: Record<string, boolean> = {}
  options.plugins = [
    // Determine whether an import should be:
    //  - A pointer import
    //  - Externalized
    {
      name: 'vike-esbuild',
      setup(build) {
        // https://github.com/brillout/esbuild-playground
        build.onResolve({ filter: /.*/ }, async (args) => {
          if (args.kind !== 'import-statement') return

          // Avoid infinite loop: https://github.com/evanw/esbuild/issues/3095#issuecomment-1546916366
          const useEsbuildResolver = 'useEsbuildResolver'
          if (args.pluginData?.[useEsbuildResolver]) return
          const { path, ...opts } = args
          opts.pluginData = { [useEsbuildResolver]: true }

          let resolved: ResolveResult | (OnResolveResult & { errors?: undefined }) = await build.resolve(path, opts)
          if (debugEsbuildResolve.isActivated) debugEsbuildResolve('args', args)
          if (debugEsbuildResolve.isActivated) debugEsbuildResolve('resolved', resolved)

          // Temporary workaround for https://github.com/evanw/esbuild/issues/3973
          // - Sitll required for esbuild@0.24.0 (November 2024).
          // - Let's try to remove this workaround again later.
          if (resolved.errors.length > 0) {
            const resolvedWithNode = requireResolveOptional(path, toPosixPath(args.resolveDir))
            if (debugEsbuildResolve.isActivated) debugEsbuildResolve('resolvedWithNode', resolvedWithNode)
            if (resolvedWithNode) resolved = { path: resolvedWithNode }
          }

          if (resolved.errors && resolved.errors.length > 0) {
            /* We could do the following to let Node.js throw the error, but we don't because the error shown by esbuild is prettier: the Node.js error refers to the transpiled [build-f7i251e0iwnw]+config.ts.mjs whereas esbuild refers to the source +config.ts file.
            pointerImports[args.path] = false
            return { external: true }
            */
            // Let esbuild throw the error
            cleanEsbuildErrors(resolved.errors)
            return resolved
          }

          assert(resolved.path)
          const importPathResolved = toPosixPath(resolved.path)
          const importPathOriginal = args.path

          // Esbuild resolves path aliases.
          // - Enabling us to use:
          //   - assertIsImportPathNpmPackage()
          //   - isImportPathNpmPackage(str, { cannotBePathAlias: true })
          assertFilePathAbsoluteFilesystem(importPathResolved)

          //  Should be remove this? See comment below.
          const isVikeExtensionImport =
            (path.startsWith('vike-') && path.endsWith('/config')) || importPathResolved.endsWith('+config.js')

          const isPointerImport =
            transformImports === 'all' ||
            // .jsx, .vue, .svg, ... => obviously not config code => pointer import
            !isPlainJavaScriptFile(importPathResolved) ||
            // Import of a Vike extension config => make it a pointer import because we want to show nice error messages (that can display whether a config has been set by the user or by a Vike extension).
            //  - Should we stop doing this? (And instead let Node.js directly load Vike extensions.)
            //    - In principle, we can use the setting 'name' value of Vike extensions.
            //      - vike@0.4.162 started soft-requiring Vike extensions to set the name config.
            //    - In practice, it seems like it requires some (non-trivial?) refactoring.
            isVikeExtensionImport

          assertPosixPath(importPathResolved)
          // `isNpmPkgImport` => `importPathOriginal` is most likely an npm package import, but it can also be a path alias that a) looks like an npm package import and b) resolves outside of `userRootDir`.
          const isNpmPkgImport: boolean = (() => {
            if (importPathResolved.includes('/node_modules/')) {
              // So far I can't think of a use case where this assertion would fail, but let's eventually remove it to avoid artificially restricting the user.
              assert(isImportPathNpmPackageOrPathAlias(importPathOriginal))
              return true
            }
            // Linked npm packages
            if (
              // Assuming path aliases usually resolve inside `userRootDir`.
              // - This isn't always the case: https://github.com/vikejs/vike/issues/2326
              !importPathResolved.startsWith(userRootDir) &&
              // False positive if `importPathOriginal` is a path alias that a) looks like an npm package import and b) resolves outside of `userRootDir` => we then we wrongfully assume that `importPathOriginal` is an npm package import.
              isImportPathNpmPackageOrPathAlias(importPathOriginal)
            ) {
              return true
            }
            return false
          })()

          const isExternal =
            isPointerImport ||
            // Performance: npm package imports can be externalized. (We could as well let esbuild transpile /node_modules/ code but it's useless as /node_modules/ code is already built. It would unnecessarily slow down transpilation.)
            isNpmPkgImport

          if (!isExternal) {
            // User-land config code (i.e. not runtime code) => let esbuild transpile it
            assert(!isPointerImport && !isNpmPkgImport)
            if (debug.isActivated) debug('onResolved()', { args, resolved, isPointerImport, isExternal })
            return resolved
          }

          let importPathTranspiled: string
          assertPosixPath(importPathOriginal)
          if (isImportPathRelative(importPathOriginal)) {
            importPathTranspiled = importPathResolved
          } else {
            // `importPathOriginal` is either:
            //  - Npm package import
            //  - Path alias
            const filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({
              filePathAbsoluteFilesystem: importPathResolved,
              userRootDir
            })
            if (filePathAbsoluteUserRootDir && !isNpmPkgImport) {
              // `importPathOriginal` is most likely a path alias.
              // - We have to use esbuild's path alias resolution, because:
              //   - Vike doesn't resolve path aliases at all.
              //   - Node.js doesn't support `tsconfig.js#compilerOptions.paths`.
              // - Esbuild path alias resolution seems reliable, e.g. it supports `tsconfig.js#compilerOptions.paths`.
              assert(!isImportPathNpmPackageOrPathAlias(importPathOriginal))
              importPathTranspiled = importPathResolved
            } else {
              // `importPathOriginal` is most likely an npm package import.
              assertIsImportPathNpmPackage(importPathOriginal)
              // For improved error messages, let the resolution be handled by Vike or Node.js.
              importPathTranspiled = importPathOriginal
            }
          }

          if (debug.isActivated)
            debug('onResolved()', { args, resolved, importPathTranspiled, isPointerImport, isExternal })
          assert(isExternal)
          assert(
            // Import of runtime code => handled by Vike
            isPointerImport ||
              // Import of config code => loaded by Node.js at build-time
              isNpmPkgImport
          )
          pointerImports[importPathTranspiled] = isPointerImport
          return { external: true, path: importPathTranspiled }
        })
      }
    },
    // Track dependencies
    {
      name: 'vike:dependency-tracker',
      setup(b) {
        b.onLoad({ filter: /./ }, (args) => {
          // We collect the dependency `args.path` in case the bulid fails (upon build error => error is thrown => no metafile)
          let { path } = args
          path = toPosixPath(path)
          esbuildCache.vikeConfigDependencies.add(path)
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

  let result: BuildResult
  try {
    result = await build(options)
  } catch (err) {
    await formatBuildErr(err, filePath)
    throw err
  }

  // Track dependencies
  assert(result.metafile)
  Object.keys(result.metafile.inputs).forEach((filePathRelative) => {
    filePathRelative = toPosixPath(filePathRelative)
    assertPosixPath(userRootDir)
    const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathRelative)
    esbuildCache.vikeConfigDependencies.add(filePathAbsoluteFilesystem)
  })

  const code = result.outputFiles![0]!.text
  assert(typeof code === 'string')
  return { code, pointerImports }
}

async function executeTranspiledFile(filePath: FilePathResolved, code: string) {
  const { filePathAbsoluteFilesystem } = filePath
  // Alternative to using a temporary file: https://github.com/vitejs/vite/pull/13269
  //  - But seems to break source maps, so I don't think it's worth it
  const filePathTmp = getTemporaryBuildFilePath(filePathAbsoluteFilesystem)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => fs.unlinkSync(filePathTmp)
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await executeFile(filePathTmp, filePath)
  } finally {
    clean()
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

function getTemporaryBuildFilePath(filePathAbsoluteFilesystem: string): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  const dirname = path.posix.dirname(filePathAbsoluteFilesystem)
  const filename = path.posix.basename(filePathAbsoluteFilesystem)
  // Syntax with semicolon `build:${/*...*/}` doesn't work on Windows: https://github.com/vikejs/vike/issues/800#issuecomment-1517329455
  const filePathTmp = path.posix.join(dirname, `${filename}.build-${getRandomId()}.mjs`)
  assert(isTemporaryBuildFile(filePathTmp))
  return filePathTmp
}
function isTemporaryBuildFile(filePath: string): boolean {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  return /\.build-[a-z0-9]{12}\.mjs$/.test(fileName)
}

// TODO/next-major: remove
function isHeaderFile(filePath: string) {
  assertPosixPath(filePath)
  const fileExtensions = getFileExtensions(filePath)
  return fileExtensions.includes('h')
}
function getFileExtensions(filePath: string) {
  const fileExtensions = path.posix.basename(filePath).split('.').slice(1)
  return fileExtensions
}
function getFileExtension(filePath: string): string {
  const fileExtensions = path.posix.basename(filePath).split('.').slice(1)
  return fileExtensions.pop()!
}
function removeHeaderFileExtension(filePath: string) {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  const fileNameParts = fileName.split('.')
  const fileNamePartsMod = fileNameParts.filter((p) => p !== 'h')
  assert(fileNamePartsMod.length < fileNameParts.length)
  const fileNameMod = fileNamePartsMod.join('.')
  return path.posix.join(path.posix.dirname(filePath), fileNameMod)
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
  const { filePathToShowToUserResolved } = filePath
  const msg = [
    // prettier ignore
    pc.red(`Failed to ${operation}`),
    pc.bold(pc.red(filePathToShowToUserResolved)),
    pc.red(`because:`)
  ].join(' ')
  return msg
}

function cleanEsbuildErrors(errors: Message[]) {
  errors.forEach(
    (e) =>
      (e.notes = e.notes.filter(
        (note) =>
          // Remove note:
          // ```shell
          // You can mark the path "#root/renderer/onRenderHtml_typo" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle.
          // ```
          //
          // From error:
          // ```shell
          // ✘ [ERROR] Could not resolve "#root/renderer/onRenderHtml_typo" [plugin vike-esbuild]
          //
          //    renderer/+config.h.js:1:29:
          //      1 │ import { onRenderHtml } from "#root/renderer/onRenderHtml_typo"
          //        ╵                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          //
          //  You can mark the path "#root/renderer/onRenderHtml_typo" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle.
          //
          // ```
          !note.text.includes('as external to exclude it from the bundle')
      ))
  )
}

function installSourceMapSupport() {
  // Don't break Vitest's source mapping
  if (isVitest()) return
  // How about other test runners?
  // Should we call installSourceMapSupport() lazily in transpileAndExecuteFile() instead?
  sourceMapSupport.install()
}
