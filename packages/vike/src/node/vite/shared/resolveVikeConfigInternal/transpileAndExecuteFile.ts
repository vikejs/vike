export { transpileAndExecuteFile }
export { getConfigBuildErrorFormatted }
export { getConfigExecutionErrorIntroMsg }
export { isTemporaryBuildFile }
export type { BuildCache }

import {
  rolldown,
  type Plugin,
  type PluginContext,
  type PluginContextResolveOptions,
  type ResolvedId,
  type RolldownBuild,
  type RolldownLog,
  type RolldownOutput,
  VERSION,
} from 'rolldown'
import { parseAst } from 'rolldown/parseAst'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
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
import {
  assertPointerImportHasEffect,
  pointerImportAttributeSuffix,
  removePointerImportAttributeSuffix,
  transformPointerImports,
} from './pointerImports.js'
import sourceMapSupport from 'source-map-support'
import type { FilePathResolved } from '../../../../types/FilePath.js'
import { getFilePathAbsoluteUserRootDir } from '../getFilePath.js'
import { getMagicString } from '../getMagicString.js'
import '../../assertEnvVite.js'

assertIsNotProductionRuntime()
installSourceMapSupport()
const debug = createDebug('vike:pointer-imports')
const debugRolldownResolve = createDebug('vike:rolldown-resolve')
const debugConfig = createDebug('vike:config')
if (debugRolldownResolve.isActivated) debugRolldownResolve('rolldown version', VERSION)

type FileExports = { fileExports: Record<string, unknown> }

type BuildCache = {
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
  buildCache: BuildCache,
): Promise<FileExports> {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath
  assert(filePathAbsoluteFilesystem)
  const fileExtension = getFileExtension(filePathAbsoluteFilesystem)

  if (buildCache.transpileCache[filePathAbsoluteFilesystem]) {
    return await buildCache.transpileCache[filePathAbsoluteFilesystem]
  }
  const { promise, resolve } = genPromise<FileExports>()
  buildCache.transpileCache[filePathAbsoluteFilesystem] = promise

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
      debugConfig(filePathToShowToUserResolved, 'executed directly (no rolldown transpilation)')
    }
    fileExports = await executeFile(filePathAbsoluteFilesystem, filePath)
  } else {
    const transformImports = isHeader ? 'all' : true
    const code = await transpileFile(filePath, transformImports, userRootDir, buildCache)
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
  buildCache: BuildCache,
) {
  const { filePathAbsoluteFilesystem, filePathToShowToUserResolved } = filePath

  assert(filePathAbsoluteFilesystem)
  assertPosixPath(filePathAbsoluteFilesystem)
  buildCache.vikeConfigDependencies.add(filePathAbsoluteFilesystem)

  if (debug.isActivated) debug('transpile', filePathToShowToUserResolved)
  let { code, pointerImports } = await transpileWithRolldown(filePath, userRootDir, transformImports, buildCache)
  if (debug.isActivated) debug(`code, post rolldown (${filePathToShowToUserResolved})`, code)

  let isImportTransformed = false
  if (transformImports) {
    const codeMod = transformPointerImports(code, pointerImports)
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

async function transpileWithRolldown(
  filePath: FilePathResolved,
  userRootDir: string,
  transformImports: boolean | 'all',
  buildCache: BuildCache,
) {
  const entryFilePath = filePath.filePathAbsoluteFilesystem
  const entryFileDir = path.posix.dirname(entryFilePath)

  const pointerImports: Record<string, boolean> = {}
  const importStatements: Record<
    string, // importer
    ImportStatement[]
  > = {}
  const pointerImportsWithoutEffect: { importer: string; importStatement: ImportStatement }[] = []
  const unresolvedImports: RolldownLog[] = []

  const plugins: Plugin[] = [
    // Determine whether an import should be:
    //  - A pointer import
    //  - Externalized
    {
      name: 'vike:pointer-imports',
      async resolveId(importPath, importer, options) {
        if (options.isEntry || options.kind !== 'import-statement') return
        assert(importer)

        // Import with the import attribute `with { type: 'vike:pointer' }`, see transform() below
        const isPointerImportAttribute = importPath.endsWith(pointerImportAttributeSuffix)
        const importPathOriginal = isPointerImportAttribute
          ? importPath.slice(0, -pointerImportAttributeSuffix.length)
          : importPath

        const resolved = await resolveImport(this, importPathOriginal, importer, userRootDir, options)

        if (!resolved) {
          /* We could do the following to let Node.js throw the error, but we don't because the error shown by Rolldown is prettier: the Node.js error refers to the transpiled +config.ts.build-f7i251e0iwnw.mjs whereas Rolldown refers to the source +config.ts file.
          pointerImports[importPathOriginal] = false
          return { id: importPathOriginal, external: true }
          */
          // Let Rolldown throw the error
          return null
        }

        // Built-in modules e.g. node:fs
        if (resolved.external) {
          const importPathBuiltIn = resolved.id
          const isPointerImport = false
          pointerImports[importPathBuiltIn] = isPointerImport
          if (debug.isActivated) debug('resolveId() [built-in module]', { importPathOriginal, importer, resolved })
          return { id: importPathBuiltIn, external: true }
        }

        // Rolldown's internal modules, e.g. helpers injected by Oxc's transformer
        if (isVirtualModule(resolved.id)) return resolved

        const importPathResolved = toPosixPath(resolved.id)

        const { isExternal, isPointerImport, importPathTranspiled } = classifyImport(
          importPathOriginal,
          importPathResolved,
          isPointerImportAttribute,
          transformImports,
          userRootDir,
        )
        if (!isExternal) {
          if (debug.isActivated) debug('resolveId() [non-external]', { importPathOriginal, importer, resolved })
          return resolved
        }

        // Pointer import without importing any value, e.g. `import './some.css'`
        // - We cannot detect these by looking at Rolldown's output: Rolldown transforms unused imports `import { unused } from './some.js'` into `import './some.js'`
        if (isPointerImport) {
          const importStatementsOfImportPath = (importStatements[importer] ?? []).filter(
            (importStatement) =>
              importStatement.importPath === importPathOriginal &&
              importStatement.isPointerImportAttribute === isPointerImportAttribute,
          )
          const importStatement = importStatementsOfImportPath[0]
          if (importStatement && importStatementsOfImportPath.every((s) => s.isSideEffectImport)) {
            pointerImportsWithoutEffect.push({ importer, importStatement })
          }
        }

        let id = importPathTranspiled
        // Keep the mark, so that the ID is different than the ID of the same file loaded and executed at config-time, see transform() below.
        // - The mark is removed by transformPointerImports()
        if (isPointerImportAttribute) id += pointerImportAttributeSuffix

        if (debug.isActivated)
          debug('resolveId() [external]', { importPathOriginal, importer, resolved, id, isPointerImport, isExternal })
        pointerImports[id] = isPointerImport
        return { id, external: true }
      },
      async transform(code, id) {
        // Rolldown's internal modules, e.g. \0rolldown/runtime.js
        if (isVirtualModule(id)) return
        // Rolldown doesn't pass import attributes `with { type: 'vike:pointer' }` to resolveId() => we parse the imports ourselves.
        // - The transform() hook of a module is always called before the resolveId() hook of its imports.
        const importStatementsOfModule = parseImportStatements(code, id)
        importStatements[id] = importStatementsOfModule
        // Rolldown calls resolveId() only once per import path of a module, and a file cannot be both external and bundled => we mark the import path of imports that have the import attribute, so that they're resolved separately. For example:
        //   ```js
        //   // Pointer import
        //   import { Page } from './Page.ts' with { type: 'vike:pointer' }
        //   // Loaded and executed at config-time
        //   import { title } from './Page.ts'
        //   ```
        const { magicString, getMagicStringResult } = getMagicString(code, id)
        for (const { isPointerImportAttribute, importPath, importPathSpan } of importStatementsOfModule) {
          if (!isPointerImportAttribute) continue
          // We don't mark import paths that cannot be resolved: we let Rolldown throw the resolve error, which then shows the original code
          if (!(await resolveImport(this, importPath, id, userRootDir))) continue
          // Mark the import path, right before its closing quote
          magicString.appendLeft(importPathSpan.end - 1, pointerImportAttributeSuffix)
        }
        return {
          ...getMagicStringResult(),
          // Disable tree-shaking of user-land code: we want to execute user-land code as-is. (Rolldown's internal modules, such as its runtime helpers, are tree-shaken.)
          moduleSideEffects: 'no-treeshake',
        }
      },
    },
    // Track dependencies
    {
      name: 'vike:dependency-tracker',
      load(id) {
        // We collect the dependencies with the load() hook (instead of using Rolldown's output), so that we also collect them if the build fails
        if (isVirtualModule(id)) return
        buildCache.vikeConfigDependencies.add(toPosixPath(id))
        /* To exhaustively collect all dependencies upon build failure, we would also need to use resolveId().
         *  - Because load() isn't call if the config dependency can't be resolved.
         *  - For example, the following breaks auto-reload (the config is stuck in its error state and the user needs to touch the importer for the config to reload):
         *    ```bash
         *    mv ./some-config-dependency.js /tmp/ && mv /tmp/some-config-dependency.js .
         *    ```
         *  - But implementing a fix is complex and isn't worth it.
        resolveId(...)
        */
      },
    },
  ]

  let bundle: RolldownBuild | undefined
  let output: RolldownOutput
  try {
    bundle = await rolldown({
      input: entryFilePath,
      cwd: userRootDir,
      platform: 'node',
      // Resolve path aliases defined in tsconfig.json
      tsconfig: true,
      transform: {
        // Vike's minimum supported Node.js version, see assertNodeVersion()
        target: 'node20.19',
      },
      // Keep the absolute path of pointer imports, so that the import paths of Rolldown's output match `pointerImports`
      makeAbsoluteExternalsRelative: false,
      plugins,
      onLog(level, log) {
        if (debugRolldownResolve.isActivated) debugRolldownResolve('log', { level, log })
        // Rolldown treats unresolved imports that aren't relative (e.g. npm packages and path aliases) as external, but we want the build to fail instead
        if (log.code === 'UNRESOLVED_IMPORT') unresolvedImports.push(log)
        // Swallow all other logs
      },
    })
    output = await bundle.generate({
      format: 'esm',
      sourcemap: 'inline',
      // Needed for correct inline source map (bundle.generate() doesn't emit any file)
      dir: entryFileDir,
      // Avoid dead-code elimination (Rolldown's default is `minify: 'dce-only'`)
      minify: false,
      // Single chunk
      codeSplitting: false,
    })
    if (unresolvedImports.length > 0) throw getErrUnresolvedImports(unresolvedImports)
  } catch (err) {
    formatBuildErr(err, filePath)
    throw err
  } finally {
    await bundle?.close()
  }

  pointerImportsWithoutEffect.forEach(({ importer, importStatement }) => {
    const importerFilePath = toPosixPath(importer)
    const importerFilePathToShowToUser =
      importerFilePath === entryFilePath
        ? filePath.filePathToShowToUserResolved
        : getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem: importerFilePath, userRootDir }) ||
          importerFilePath
    assertPointerImportHasEffect(importStatement.code, importStatement.importPath, importerFilePathToShowToUser)
  })

  const chunk = output.output[0]
  assert(chunk.type === 'chunk')
  const { code } = chunk
  assert(typeof code === 'string')
  return { code, pointerImports }
}

// Resolve with Rolldown, and fallback to Node.js's resolution
async function resolveImport(
  pluginContext: PluginContext,
  importPath: string,
  importer: string,
  userRootDir: string,
  options: PluginContextResolveOptions = { kind: 'import-statement' },
) {
  let resolved: ResolvedId | { id: string; external?: undefined } | null = await pluginContext.resolve(
    importPath,
    importer,
    {
      ...options,
      skipSelf: true,
    },
  )
  if (debugRolldownResolve.isActivated) debugRolldownResolve('args', { importPath, importer, options })
  if (debugRolldownResolve.isActivated) debugRolldownResolve('resolved', resolved)

  // Fallback to Node.js's resolution
  // - Originally a workaround for an esbuild bug: https://github.com/evanw/esbuild/issues/3973
  // - Let's try to remove this workaround again later.
  if (!resolved && !isVirtualModule(importer)) {
    const resolvedWithNode = requireResolveOptionalDir({
      importPath,
      importerDir: path.posix.dirname(toPosixPath(importer)),
      userRootDir,
    })
    if (debugRolldownResolve.isActivated) debugRolldownResolve('resolvedWithNode', resolvedWithNode)
    if (resolvedWithNode) resolved = { id: resolvedWithNode }
  }

  return resolved
}

// Determine whether an import should be:
//  - A pointer import
//  - Externalized
function classifyImport(
  importPathOriginal: string,
  importPathResolved: string,
  isPointerImportAttribute: boolean,
  transformImports: boolean | 'all',
  userRootDir: string,
):
  | { isExternal: false; isPointerImport: false; importPathTranspiled?: undefined }
  | { isExternal: true; isPointerImport: boolean; importPathTranspiled: string } {
  // Rolldown resolves path aliases.
  // - Enabling us to use:
  //   - assertImportIsNpmPackage()
  //   - isImportNpmPackage(str, { cannotBePathAlias: true })
  assertFilePathAbsoluteFilesystem(importPathResolved)

  //  Should we remove this? See comment below.
  const isVikeExtensionImport =
    (importPathOriginal.startsWith('vike-') && importPathOriginal.endsWith('/config')) ||
    importPathResolved.endsWith('+config.js')

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
    isPointerImportAttribute

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
    // Performance: npm package imports can be externalized. (We could as well let Rolldown transpile /node_modules/ code but it's useless as /node_modules/ code is already built. It would unnecessarily slow down transpilation.)
    (isMostLikelyNpmPkgImport && isPlainJavaScriptFile(importPathResolved))
  if (!isExternal) {
    // User-land config code (i.e. not runtime code) => let Rolldown transpile it
    assert(!isPointerImport)
    return { isExternal, isPointerImport }
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
      // - We have to use Rolldown's path alias resolution, because:
      //   - Vike doesn't resolve path aliases at all.
      //   - Node.js doesn't support `tsconfig.js#compilerOptions.paths`.
      // - Rolldown path alias resolution seems reliable, e.g. it supports `tsconfig.js#compilerOptions.paths`.
      importPathTranspiled = importPathResolved
    } else {
      // `importPathOriginal` is most likely an npm package import.
      assertImportIsNpmPackage(importPathOriginal)
      // For improved error messages, let the resolution be handled by Vike or Node.js.
      importPathTranspiled = importPathOriginal
    }
  }

  return { isExternal, isPointerImport, importPathTranspiled }
}

type ImportStatement = {
  /** The import path, as written by the user, e.g. `'./some.css'` */
  importPath: string
  /** Position of the import path string literal (including quotes) */
  importPathSpan: { start: number; end: number }
  /** The import statement, as written by the user, e.g. `import './some.css'` */
  code: string
  /** Import attribute `with { type: 'vike:pointer' }` */
  isPointerImportAttribute: boolean
  /** Import without importing any value, e.g. `import './some.css'` */
  isSideEffectImport: boolean
}
function parseImportStatements(code: string, id: string): ImportStatement[] {
  // Performance trick
  if (!code.includes('import') && !code.includes('vike:pointer')) return []

  let program: ReturnType<typeof parseAst>
  try {
    program = parseAst(code, { lang: getLang(id), sourceType: 'module' }, id)
  } catch {
    // Let Rolldown throw the parse error (Rolldown shows a prettier error)
    return []
  }

  const importStatements: ImportStatement[] = []
  program.body.forEach((node) => {
    if (node.type === 'ImportDeclaration') {
      // Removed by TypeScript transpilation
      if (node.importKind === 'type') return
      importStatements.push({
        importPath: node.source.value,
        importPathSpan: { start: node.source.start, end: node.source.end },
        code: code.slice(node.start, node.end),
        isPointerImportAttribute: hasPointerImportAttribute(node.attributes),
        isSideEffectImport: node.specifiers.length === 0,
      })
    }
    if ((node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') && node.source) {
      // Removed by TypeScript transpilation
      if (node.exportKind === 'type') return
      importStatements.push({
        importPath: node.source.value,
        importPathSpan: { start: node.source.start, end: node.source.end },
        code: code.slice(node.start, node.end),
        isPointerImportAttribute: hasPointerImportAttribute(node.attributes),
        isSideEffectImport: false,
      })
    }
  })
  return importStatements
}
type ImportAttribute = Extract<
  ReturnType<typeof parseAst>['body'][number],
  { type: 'ImportDeclaration' }
>['attributes'][number]
function hasPointerImportAttribute(attributes: ImportAttribute[]) {
  return attributes.some(({ key, value }) => {
    const keyName = key.type === 'Identifier' ? key.name : key.value
    return keyName === 'type' && value.value === 'vike:pointer'
  })
}
function getLang(filePath: string): 'js' | 'jsx' | 'ts' | 'tsx' {
  const fileExtension = getFileExtension(filePath)
  if (['ts', 'mts', 'cts'].includes(fileExtension)) return 'ts'
  if (fileExtension === 'tsx') return 'tsx'
  if (fileExtension === 'jsx') return 'jsx'
  return 'js'
}

function isVirtualModule(id: string) {
  return id.startsWith('\0')
}

async function executeTranspiledFile(filePath: FilePathResolved, code: string) {
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
function formatBuildErr(err: unknown, filePath: FilePathResolved): void {
  if (!isRolldownBuildError(err)) return
  // Remove the mark of imports with the import attribute `with { type: 'vike:pointer' }`, see transpileWithRolldown()
  err.message = removePointerImportAttributeSuffix(err.message)
  if (err.stack) err.stack = removePointerImportAttributeSuffix(err.stack)
  const msgRolldown = err.errors.map((e) => removePointerImportAttributeSuffix(e.message).trim()).join('\n')
  const msgIntro = getErrIntroMsg('transpile', filePath)
  const errMsgFormatted: ErrMsgFormatted = `${msgIntro}\n${msgRolldown}`
  // Non-enumerable, otherwise `$ vike build` prints it in addition to the error message
  Object.defineProperty(err, formatted, { value: errMsgFormatted, enumerable: false, configurable: true })
}
function isRolldownBuildError(err: unknown): err is Error & { errors: RolldownLog[] } {
  return (
    isObject(err) && Array.isArray(err.errors) && err.errors.every((e) => isObject(e) && typeof e.message === 'string')
  )
}
function getErrUnresolvedImports(logs: RolldownLog[]) {
  const errors = logs.map((log) => ({
    ...log,
    // We make the build fail, thus:
    // - Color it as an error (instead of as a warning)
    // - Remove `, treating it as an external dependency` from the message `Module not found, treating it as an external dependency`
    message: log.message
      .replace('\x1b[33m[UNRESOLVED_IMPORT]', '\x1b[31m[UNRESOLVED_IMPORT]')
      .replace(', treating it as an external dependency', '.'),
  }))
  const msg = `Build failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:\n\n${errors.map((e) => e.message).join('\n')}`
  const err = new Error(msg)
  // Getter (like Rolldown's errors), otherwise `$ vike build` prints it in addition to the error message (Node.js's util.inspect() always prints `error.errors` if it's an array)
  Object.defineProperty(err, 'errors', { get: () => errors, enumerable: true, configurable: true })
  return err
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

function installSourceMapSupport() {
  // Don't break Vitest's source mapping
  if (isVitest()) return
  // How about other test runners?
  // Should we call installSourceMapSupport() lazily in transpileAndExecuteFile() instead?
  sourceMapSupport.install()
}
