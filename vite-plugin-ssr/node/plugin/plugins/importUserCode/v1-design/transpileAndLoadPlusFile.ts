export { transpileAndLoadPageConfig }
export { transpileAndLoadConfigValueFile }

import esbuild, { type BuildResult, type BuildOptions } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { import_ } from '@brillout/import'
import { assertPosixPath, getRandomId, assertIsVitePluginCode } from '../../../utils'
import { replaceImportStatements } from './replaceImportStatements'

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
async function transpileAndLoadPlusFile(filePathAbsolute: string, isPageConfig: boolean): Promise<Result> {
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
  if (isPageConfig) {
    code = replaceImportStatements(code)
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
  // Syntax with semicolon `[build:${/*...*/}]` doesn't work on Windows: https://github.com/brillout/vite-plugin-ssr/issues/800#issuecomment-1517329455
  const tag = `[build-${getRandomId(12)}]`
  const filePathTmp = path.posix.join(dirname, `${tag}${filename}.mjs`)
  return filePathTmp
}
