export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExecutionErrorIntroMsg }
export { isTemporaryBuildFile }

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
  assertWarning,
  isObject,
  toPosixPath,
  assertUsage,
  isJavaScriptFile,
  createDebugger,
  assertPathIsFilesystemAbsolute
} from '../../../../utils.js'
import { transformFileImports } from './transformFileImports.js'
import { vikeConfigDependencies } from '../getVikeConfig.js'
import 'source-map-support/register.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'

assertIsNotProductionRuntime()
const debug = createDebugger('vike:pointer-imports')

async function transpileAndExecuteFile(
  filePath: FilePathResolved,
  userRootDir: string,
  isConfigFile: boolean | 'is-extension-config'
): Promise<{ fileExports: Record<string, unknown> }> {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath
  const fileExtension = getFileExtension(filePathAbsoluteFilesystem)

  assertUsage(
    isJavaScriptFile(filePathAbsoluteFilesystem),
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

  if (isConfigFile === 'is-extension-config' && !isHeader && fileExtension.endsWith('js')) {
    // This doesn't track dependencies => we should never use this for user land configs
    const fileExports = await executeFile(filePathAbsoluteFilesystem, filePath)
    return { fileExports }
  } else {
    const transformImports = isConfigFile && (isHeader ? 'all' : true)
    const code = await transpileFile(filePath, transformImports, userRootDir)
    const fileExports = await executeTranspiledFile(filePath, code)
    return { fileExports }
  }
}

async function transpileFile(filePath: FilePathResolved, transformImports: boolean | 'all', userRootDir: string) {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath

  assertPosixPath(filePathAbsoluteFilesystem)
  vikeConfigDependencies.add(filePathAbsoluteFilesystem)

  if (debug.isActivated) debug('transpile', filePathToShowToUserResolved)
  let { code, pointerImports } = await transpileWithEsbuild(filePath, userRootDir, transformImports)
  if (debug.isActivated) debug(`code, post esbuild (${filePathToShowToUserResolved})`, code)

  let isImportTransformed = false
  if (transformImports) {
    const codeMod = transformFileImports(code, filePathToShowToUserResolved, pointerImports)
    if (codeMod) {
      code = codeMod
      isImportTransformed = true
      if (debug.isActivated) debug(`code, post transformImports() (${filePathToShowToUserResolved})`, code)
    }
  }
  if (!isImportTransformed) {
    if (debug.isActivated) debug(`code, no transformImports() (${filePathToShowToUserResolved})`)
  }
  return code
}

async function transpileWithEsbuild(
  filePath: FilePathResolved,
  userRootDir: string,
  transformImports: boolean | 'all'
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

  let pointerImports: Record<string, boolean> = {}
  options.plugins = [
    // Determine whether an import should be:
    //  - A pointer import
    //  - Externalized
    {
      name: 'vike-esbuild-plugin',
      setup(build) {
        // https://github.com/evanw/esbuild/issues/3095#issuecomment-1546916366
        const useEsbuildResolver = 'useEsbuildResolver'
        // https://github.com/brillout/esbuild-playground
        build.onResolve({ filter: /.*/ }, async (args) => {
          if (args.kind !== 'import-statement') return
          if (args.pluginData?.[useEsbuildResolver]) return

          const { path, ...opts } = args
          opts.pluginData = { [useEsbuildResolver]: true }
          const resolved = await build.resolve(path, opts)

          if (resolved.errors.length > 0) {
            /* We could do the following to let Node.js throw the error, but we don't because the error shown by esbuild is prettier: the Node.js error refers to the transpiled [build-f7i251e0iwnw]+config.ts.mjs file which isn't that nice, whereas esbuild refers to the source +config.ts file.
            pointerImports[args.path] = false
            return { external: true }
            */

            // Let esbuild throw the error. (It throws a nice & pretty error.)
            return resolved
          }

          assert(resolved.path)
          resolved.path = toPosixPath(resolved.path)

          // vike-{react,vue,solid} follow the convention that their config export resolves to a file named +config.js
          //  - This is temporary, see comment below.
          const isVikeExtensionConfigImport = resolved.path.endsWith('+config.js')

          const isPointerImport =
            transformImports === 'all' ||
            // .jsx, .vue, .svg, ... => obviously not config code
            !isJavaScriptFile(resolved.path) ||
            // Import of a Vike extension config => make it a pointer import because we want to show nice error messages (that can display whether a configas been set by the user or by a Vike extension).
            //  - We should have Node.js directly load vike-{react,vue,solid} while enforcing Vike extensions to set 'name' in their +config.js file.
            //    - vike@0.4.162 already started soft-requiring Vike extensions to set the name config
            isVikeExtensionConfigImport ||
            // Cannot be resolved by esbuild => take a leap of faith and make it a pointer import.
            //  - For example if esbuild cannot resolve a path alias while Vite can.
            //    - When tsconfig.js#compilerOptions.paths is set, then esbuild is able to resolve the path alias.
            resolved.errors.length > 0
          pointerImports[resolved.path] = isPointerImport

          assertPosixPath(resolved.path)
          const isExternal =
            isPointerImport ||
            // Performance: npm package imports that aren't pointer imports can be externalized. For example, if Vike eventually adds support for setting Vite configs in the vike.config.js file, then the user may import a Vite plugin in his vike.config.js file. (We could as well let esbuild always transpile /node_modules/ code but it would be useless and would unnecessarily slow down transpilation.)
            resolved.path.includes('/node_modules/')

          if (debug.isActivated) debug('onResolved()', { args, resolved, isPointerImport, isExternal })

          // We need esbuild to resolve path aliases so that we can use:
          //   isNpmPackageImport(str, { cannotBePathAlias: true })
          //   assertIsNpmPackageImport()
          assertPathIsFilesystemAbsolute(resolved.path)

          if (isExternal) {
            return { external: true, path: resolved.path }
          } else {
            return resolved
          }
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
    vikeConfigDependencies.add(filePathAbsoluteFilesystem)
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
  const filePathTmp = path.posix.join(dirname, `${filename}.build-${getRandomId(12)}.mjs`)
  assert(isTemporaryBuildFile(filePathTmp))
  return filePathTmp
}
function isTemporaryBuildFile(filePath: string): boolean {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  return /\.build-[a-z0-9]{12}\.mjs$/.test(fileName)
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
