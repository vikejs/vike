export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExecutionErrorIntroMsg }
export { isTemporaryBuildFile }
export type { EsbuildCache }

import {
  build,
  type BuildResult,
  type BuildOptions,
  type Loader,
  formatMessages,
  type Message,
  version,
  type ResolveResult,
  type OnResolveResult,
} from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pc from '@brillout/picocolors'
import { import_ } from '@brillout/import'
import { assert, assertWarning } from '../../../../utils/assert.js'
import { assertIsNotProductionRuntime } from '../../../../utils/assertSetup.js'
import { createDebug } from '../../../../utils/debug.js'
import { genPromise } from '../../../../utils/genPromise.js'
import { assertFilePathAbsoluteFilesystem } from '../../../../utils/isFilePathAbsoluteFilesystem.js'
import { isImportPathRelative } from '../../../../utils/isImportPath.js'
import { isObject } from '../../../../utils/isObject.js'
import { isPlainJavaScriptFile, isPlainScriptFile } from '../../../../utils/isScriptFile.js'
import { isVitest } from '../../../../utils/isVitest.js'
import { assertImportIsNpmPackage, isImportNpmPackageOrPathAlias } from '../../../../utils/parseNpmPackage.js'
import { assertPosixPath, toPosixPath } from '../../../../utils/path.js'
import { requireResolveOptionalDir } from '../../../../utils/requireResolve.js'
import { transformPointerImports } from './pointerImports.js'
import sourceMapSupport from 'source-map-support'
import type { FilePathResolved } from '../../../../types/FilePath.js'
import { getFilePathAbsoluteUserRootDir } from '../getFilePath.js'
import '../../assertEnvVite.js'

assertIsNotProductionRuntime()
installSourceMapSupport()
const debug = createDebug('vike:pointer-imports')
const debugEsbuildResolve = createDebug('vike:esbuild-resolve')
const debugConfig = createDebug('vike:config')
if (debugEsbuildResolve.isActivated) debugEsbuildResolve('esbuild version', version)
const sourceMapCommentPrefix = '//# source' + 'MappingURL=data:application/json;base64,'
const inlineSourceMapRE = new RegExp(`${escapeRegExp(sourceMapCommentPrefix)}([A-Za-z0-9+/=]+)\\s*$`)

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
  esbuildCache: EsbuildCache,
): Promise<FileExports> {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath
  assert(filePathAbsoluteFilesystem)
  const fileExtension = getFileExtension(filePathAbsoluteFilesystem)

  if (esbuildCache.transpileCache[filePathAbsoluteFilesystem]) {
    return await esbuildCache.transpileCache[filePathAbsoluteFilesystem]
  }
  const { promise, resolve } = genPromise<FileExports>()
  esbuildCache.transpileCache[filePathAbsoluteFilesystem] = promise

  /* We tolerate .tsx so that a file can be both a runtime and config file (`meta.env.config === true && meta.env.server === true`), e.g. https://github.com/brillout/docpress/issues/86
  assertUsage(
    isPlainScriptFile(filePathAbsoluteFilesystem),
    `${filePathToShowToUserResolved} has file extension .${fileExtension} but a config file can only be a JavaScript/TypeScript file`,
  )
  */
  const isHeader = isHeaderFile(filePathAbsoluteFilesystem)
  if (isHeader) {
    assertWarning(
      false,
      `${pc.cyan(
        '.h.js',
      )} files are deprecated: simply renaming ${filePathToShowToUserResolved} to ${removeHeaderFileExtension(
        filePathToShowToUserResolved,
      )} is usually enough, although you may occasionally need to use ${pc.cyan(
        "with { type: 'pointer' }",
      )} as explained at https://vike.dev/config#pointer-imports`,
      { onlyOnce: true },
    )
  }

  let fileExports: FileExports['fileExports']
  if (isExtensionConfig && !isHeader && fileExtension.endsWith('js')) {
    // This doesn't track dependencies => we should never use this for user land configs
    if (debugConfig.isActivated) {
      debugConfig(filePathToShowToUserResolved, 'executed directly (no esbuild transpilation)')
    }
    fileExports = await executeFile(filePathAbsoluteFilesystem, filePath)
  } else {
    const transformImports = isHeader ? 'all' : true
    const code = await transpileFile(filePath, transformImports, userRootDir, esbuildCache)
    if (debugConfig.isActivated) {
      debugConfig(filePathToShowToUserResolved, code)
    }
    fileExports = await executeTranspiledFile(filePath, code)
  }

  resolve({ fileExports })
  return { fileExports }
}

async function transpileFile(
  filePath: FilePathResolved,
  transformImports: boolean | 'all',
  userRootDir: string,
  esbuildCache: EsbuildCache,
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
  esbuildCache: EsbuildCache,
) {
  const entryFilePath = filePath.filePathAbsoluteFilesystem
  const entryFileDir = path.posix.dirname(entryFilePath)
  const dirnameVarName = '__vike_injected_original_dirname'
  const filenameVarName = '__vike_injected_original_filename'
  const importMetaUrlVarName = '__vike_injected_original_import_meta_url'
  const importMetaResolveVarName = '__vike_injected_original_import_meta_resolve'
  const options: BuildOptions = {
    platform: 'node',
    entryPoints: [entryFilePath],
    sourcemap: 'inline',
    sourceRoot: `${entryFileDir}/`,
    write: false,
    target: ['node14.18', 'node16'],
    outfile: path.posix.join(
      // Needed for correct inline source map
      entryFileDir,
      // `write: false` => no file is actually emitted
      'NEVER_EMITTED.js',
    ),
    logLevel: 'silent',
    format: 'esm',
    absWorkingDir: userRootDir,
    define: {
      __dirname: dirnameVarName,
      __filename: filenameVarName,
      'import.meta.url': importMetaUrlVarName,
      'import.meta.dirname': dirnameVarName,
      'import.meta.filename': filenameVarName,
      'import.meta.main': 'false',
      'import.meta.resolve': importMetaResolveVarName,
    },
    banner: {
      js:
        'import { createRequire as __vike_createRequire } from "node:module";' +
        'import { pathToFileURL as __vike_pathToFileURL } from "node:url";' +
        'const __vike_import_meta_resolve = (specifier, importer) => {' +
        'if (/^(?:\\.{1,2}\\/|\\/|file:)/.test(specifier)) return new URL(specifier, importer).href;' +
        'const resolved = __vike_createRequire(importer).resolve(specifier);' +
        'return resolved.startsWith("node:") ? resolved : __vike_pathToFileURL(resolved).href;' +
        '};',
    },
    // Disable tree-shaking to avoid dead-code elimination, so that unused imports aren't removed.
    // Esbuild still sometimes removes unused imports because of TypeScript: https://github.com/evanw/esbuild/issues/3034
    treeShaking: false,
    minify: false,
    metafile: true,
    bundle: true,
  }

  const pointerImports: Record<string, boolean> = {}
  pointerImports['node:module'] = false
  pointerImports['node:url'] = false
  options.plugins = [
    {
      name: 'vike:inject-file-scope-variables',
      setup(build) {
        build.onLoad({ filter: /\.[cm]?[jt]sx?$/ }, async (args) => {
          const id = toPosixPath(args.path)
          const code = fs.readFileSync(id, 'utf-8')
          esbuildCache.vikeConfigDependencies.add(id)
          const injectValues =
            `const ${dirnameVarName} = ${JSON.stringify(path.posix.dirname(id))};` +
            `const ${filenameVarName} = ${JSON.stringify(id)};` +
            `const ${importMetaUrlVarName} = ${JSON.stringify(pathToFileURL(id).href)};` +
            `const ${importMetaResolveVarName} = (specifier, importer = ${importMetaUrlVarName}) => ` +
            `__vike_import_meta_resolve(specifier, importer);`
          return {
            contents: injectFileScopeVariables(code, injectValues),
            loader: getEsbuildLoader(id),
          }
        })
      },
    },
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
          // - Still required for esbuild@0.24.0 (November 2024).
          // - Let's try to remove this workaround again later.
          if (resolved.errors.length > 0) {
            const resolvedWithNode = requireResolveOptionalDir({
              importPath: path,
              importerDir: toPosixPath(args.resolveDir),
              userRootDir,
            })
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

          // Built-in modules e.g. node:fs
          if (resolved.path === args.path) {
            const isPointerImport = false
            pointerImports[args.path] = isPointerImport
            if (debug.isActivated) debug('onResolve() [built-in module]', { args, resolved })
            assert(resolved.external)
            return resolved
          }

          const importPathResolved = toPosixPath(resolved.path)
          const importPathOriginal = args.path

          // Esbuild resolves path aliases.
          // - Enabling us to use:
          //   - assertImportIsNpmPackage()
          //   - isImportNpmPackage(str, { cannotBePathAlias: true })
          assertFilePathAbsoluteFilesystem(importPathResolved)

          //  Should we remove this? See comment below.
          const isVikeExtensionImport =
            (path.startsWith('vike-') && path.endsWith('/config')) || importPathResolved.endsWith('+config.js')

          const isPointerImport =
            transformImports === 'all' ||
            // .jsx, .vue, .svg, ... => obviously not config code => pointer import
            !isPlainScriptFile(importPathResolved) ||
            // Import of a Vike extension config => make it a pointer import because we want to show nice error messages (that can display whether a config has been set by the user or by a Vike extension).
            //  - Should we stop doing this? (And instead let Node.js directly load Vike extensions.)
            //    - In principle, we can use the setting 'name' value of Vike extensions.
            //      - vike@0.4.162 started soft-requiring Vike extensions to set the name config.
            //    - In practice, it seems like it requires some (non-trivial?) refactoring.
            isVikeExtensionImport ||
            args.with?.['type'] === 'vike:pointer'

          assertPosixPath(importPathResolved)
          // False positive if `importPathOriginal` is a path alias that a) looks like an npm package import and b) resolves outside of `userRootDir` => we then we wrongfully assume that `importPathOriginal` is an npm package import.
          // - For example: https://github.com/vikejs/vike/issues/2326
          const isMostLikelyNpmPkgImport =
            isImportNpmPackageOrPathAlias(importPathOriginal) &&
            (importPathResolved.includes('/node_modules/') ||
              // Linked npm package
              !importPathResolved.startsWith(userRootDir))

          const isExternal =
            isPointerImport ||
            // Performance: npm package imports can be externalized. (We could as well let esbuild transpile /node_modules/ code but it's useless as /node_modules/ code is already built. It would unnecessarily slow down transpilation.)
            (isMostLikelyNpmPkgImport && isPlainJavaScriptFile(importPathResolved))
          if (!isExternal) {
            // User-land config code (i.e. not runtime code) => let esbuild transpile it
            assert(!isPointerImport)
            if (debug.isActivated) debug('onResolve() [non-external]', { args, resolved, isPointerImport, isExternal })
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
              userRootDir,
            })
            if (filePathAbsoluteUserRootDir && !isMostLikelyNpmPkgImport) {
              // `importPathOriginal` is most likely a path alias.
              // - We have to use esbuild's path alias resolution, because:
              //   - Vike doesn't resolve path aliases at all.
              //   - Node.js doesn't support `tsconfig.js#compilerOptions.paths`.
              // - Esbuild path alias resolution seems reliable, e.g. it supports `tsconfig.js#compilerOptions.paths`.
              importPathTranspiled = importPathResolved
            } else {
              // `importPathOriginal` is most likely an npm package import.
              assertImportIsNpmPackage(importPathOriginal)
              // For improved error messages, let the resolution be handled by Vike or Node.js.
              importPathTranspiled = importPathOriginal
            }
          }

          if (debug.isActivated)
            debug('onResolve() [external]', { args, resolved, importPathTranspiled, isPointerImport, isExternal })
          pointerImports[importPathTranspiled] = isPointerImport
          return { external: true, path: importPathTranspiled }
        })
      },
    },
    // Track dependencies
    {
      name: 'vike:dependency-tracker',
      setup(b) {
        b.onLoad({ filter: /./ }, (args) => {
          // We collect the dependency `args.path` in case the build fails (upon build error => error is thrown => no metafile)
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
      },
    },
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

  const code = normalizeInlineSourceMapSources(result.outputFiles![0]!.text, entryFileDir)
  assert(typeof code === 'string')
  return { code, pointerImports }
}

function normalizeInlineSourceMapSources(code: string, sourceDir: string): string {
  const match = code.match(inlineSourceMapRE)
  if (!match) return code

  const sourceMapBase64 = match[1]!
  const sourceMap = JSON.parse(Buffer.from(sourceMapBase64, 'base64').toString('utf-8')) as {
    sourceRoot?: string
    sources?: string[]
  }
  if (!Array.isArray(sourceMap.sources)) return code

  // The generated artifact is imported from node_modules/.vike-temp, so relative
  // sources need to be made independent from the artifact's runtime location.
  sourceMap.sources = sourceMap.sources.map((source) =>
    normalizeSourceMapSource(source, sourceMap.sourceRoot, sourceDir),
  )
  delete sourceMap.sourceRoot

  const sourceMapNormalizedBase64 = Buffer.from(JSON.stringify(sourceMap), 'utf-8').toString('base64')
  return code.replace(inlineSourceMapRE, `${sourceMapCommentPrefix}${sourceMapNormalizedBase64}`)
}

function normalizeSourceMapSource(source: string, sourceRoot: string | undefined, sourceDir: string): string {
  if (source.startsWith('file://')) return fileURLToPath(source)
  if (path.posix.isAbsolute(source)) return source
  if (sourceRoot) {
    if (sourceRoot.startsWith('file://')) return fileURLToPath(new URL(source, sourceRoot))
    return path.posix.join(sourceRoot, source)
  }
  return path.posix.join(sourceDir, source)
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function injectFileScopeVariables(code: string, injectValues: string): string {
  // Keep the original line numbers stable for source maps. The first line's
  // columns can be offset by the injected prefix.
  if (!code.startsWith('#!')) {
    return injectValues + code
  }
  let firstLineEndIndex = code.indexOf('\n')
  if (firstLineEndIndex < 0) firstLineEndIndex = code.length
  return code.slice(0, firstLineEndIndex + 1) + injectValues + code.slice(firstLineEndIndex + 1)
}

function getEsbuildLoader(filePath: string): Loader {
  const fileExtension = path.posix.extname(filePath)
  if (fileExtension === '.ts' || fileExtension === '.mts' || fileExtension === '.cts') return 'ts'
  if (fileExtension === '.tsx') return 'tsx'
  if (fileExtension === '.jsx') return 'jsx'
  return 'js'
}

async function executeTranspiledFile(filePath: FilePathResolved, code: string) {
  const { filePathAbsoluteFilesystem } = filePath

  const vikeTempDir = findNearestNodeModules(path.posix.dirname(filePathAbsoluteFilesystem))
  if (!vikeTempDir) {
    return await executeTranspiledFileNextToSource(filePath, code)
  }

  const fileHash = crypto
    .createHash('sha256')
    .update(`${filePathAbsoluteFilesystem}\0${code}`)
    .digest('hex')
    .slice(0, 12)
  const fileName = `${path.posix.basename(filePathAbsoluteFilesystem)}.build-${fileHash}.mjs`

  const filePathTmp = path.posix.join(vikeTempDir, '.vike-temp', fileName)
  try {
    fs.mkdirSync(path.posix.dirname(filePathTmp), { recursive: true })
    fs.writeFileSync(filePathTmp, code)
  } catch (err) {
    if (!isWriteFailure(err)) throw err
    return await executeTranspiledFileNextToSource(filePath, code)
  }
  const clean = () => {
    try {
      fs.unlinkSync(filePathTmp)
    } catch {}
  }
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await executeFile(filePathTmp, filePath)
  } finally {
    clean()
  }
  return fileExports
}

async function executeTranspiledFileNextToSource(filePath: FilePathResolved, code: string) {
  const { filePathAbsoluteFilesystem } = filePath
  // Alternative to using a temporary file: https://github.com/vitejs/vite/pull/13269
  //  - But seems to break source maps, so I don't think it's worth it
  const filePathTmp = getTemporaryBuildFilePath(filePathAbsoluteFilesystem, code)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => {
    try {
      fs.unlinkSync(filePathTmp)
    } catch {
      // I don't know why but with Vitest (4.0.18) it seems that sometimes `filePathTmp` is already removed => we therefore swallow the follow error:
      // ```shell
      // Error: ENOENT: no such file or directory, unlink '/home/rom/tmp/vike/test/vitest/pages/+config.js.build-4718e6535172.mjs'
      // ```
    }
  }
  let fileExports: Record<string, unknown> = {}
  try {
    fileExports = await executeFile(filePathTmp, filePath)
  } finally {
    clean()
  }
  return fileExports
}

function findNearestNodeModules(basedir: string): string | null {
  assertPosixPath(basedir)
  while (basedir) {
    const nodeModulesDir = path.posix.join(basedir, 'node_modules')
    if (tryStatSync(nodeModulesDir)?.isDirectory()) {
      return nodeModulesDir
    }

    const nextBasedir = path.posix.dirname(basedir)
    if (nextBasedir === basedir) break
    basedir = nextBasedir
  }

  return null
}

function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {
    // Ignore errors
  }
}

function isWriteFailure(err: unknown): boolean {
  if (!isObject(err)) return false
  const code = err.code
  return (
    code === 'EACCES' ||
    code === 'EPERM' ||
    code === 'EROFS' ||
    code === 'ENOENT' ||
    code === 'ENOTDIR' ||
    code === 'EISDIR'
  )
}

async function executeFile(filePathToExecuteAbsoluteFilesystem: string, filePathSourceFile: FilePathResolved) {
  let fileExports: Record<string, unknown> = {}
  try {
    // `import(filePath)` is cached: if `filePath` doesn't change => the file isn't re-executed. The import() cache is required for the +meta.vite implementation to work correctly, see hasViteConfigChanged()
    // https://github.com/vikejs/vike/blob/0a4f54ff3eea128cbd886c0ac88972e44a74cf99/packages/vike/src/node/vite/shared/resolveVikeConfigInternal.ts#L305
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
function getConfigBuildErrorFormatted(err: unknown) {
  if (!isObject(err)) return null
  if (!(formatted in err)) return null
  assert(typeof err[formatted] === 'string')
  const errMsgFormatted = err[formatted] as ErrMsgFormatted
  return errMsgFormatted
}
type ErrMsgFormatted = `${ErrIntroMsgTranspile}\n${string}`
async function formatBuildErr(err: unknown, filePath: FilePathResolved): Promise<void> {
  assert(isObject(err) && err.errors)
  const msgEsbuild = (
    await formatMessages(err.errors as any, {
      kind: 'error',
      color: true,
    })
  )
    .map((m) => m.trim())
    .join('\n')
  const msgIntro = getErrIntroMsg('transpile', filePath)
  const errMsgFormatted: ErrMsgFormatted = `${msgIntro}\n${msgEsbuild}`
  err[formatted] = errMsgFormatted
}

const execErrIntroMsg = new WeakMap<object, ErrIntroMsgExecute>()
function getConfigExecutionErrorIntroMsg(err: unknown) {
  if (!isObject(err)) return null
  const errIntroMsg = execErrIntroMsg.get(err)
  return errIntroMsg ?? null
}

function getTemporaryBuildFilePath(filePathAbsoluteFilesystem: string, code: string): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  const fileDir = path.posix.dirname(filePathAbsoluteFilesystem)
  const filename = path.posix.basename(filePathAbsoluteFilesystem)
  // Using content hash in file path, so that the cache of dynamic `import()` behaves as we want.
  const fileHash = crypto.createHash('md5').update(code).digest('hex').slice(0, 12)
  // Syntax with semicolon `build:${/*...*/}` doesn't work on Windows: https://github.com/vikejs/vike/issues/800#issuecomment-1517329455
  const filePathTmp = path.posix.join(fileDir, `${filename}.build-${fileHash}.mjs`)
  assert(isTemporaryBuildFile(filePathTmp))
  return filePathTmp
}
function isTemporaryBuildFile(filePath: string): boolean {
  assertPosixPath(filePath)
  const fileName = path.posix.basename(filePath)
  return /\.build-[a-z0-9]{12}\.mjs$/.test(fileName)
}

// TO-DO/next-major-release: remove
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

type ErrIntroMsgExecute = ReturnType<typeof getErrIntroMsg<'execute'>>
type ErrIntroMsgTranspile = ReturnType<typeof getErrIntroMsg<'transpile'>>
function getErrIntroMsg<Operation extends 'transpile' | 'execute'>(operation: Operation, filePath: FilePathResolved) {
  const { filePathToShowToUserResolved } = filePath
  const msg =
    `${pc.red(`Failed to ${operation}`)} ${pc.bold(pc.red(filePathToShowToUserResolved))} ${pc.red(`because:`)}` as const
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
          !note.text.includes('as external to exclude it from the bundle'),
      )),
  )
}

function installSourceMapSupport() {
  // Don't break Vitest's source mapping
  if (isVitest()) return
  // How about other test runners?
  // Should we call installSourceMapSupport() lazily in transpileAndExecuteFile() instead?
  sourceMapSupport.install()
}
