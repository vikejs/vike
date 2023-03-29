export { transpileAndLoadPageConfig }
export { transpileAndLoadConfigValueFile }

import esbuild, { type BuildResult } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { import_ } from '@brillout/import'
import { assertPosixPath, getRandomId, assertIsVitePluginCode, assert } from '../../../utils'

assertIsVitePluginCode()

type Result = { exports: Record<string, unknown> } | { err: unknown }

async function transpileAndLoadPageConfig(filePathAbsolute: string): Promise<Result> {
  return transpileAndLoadPlusFile(filePathAbsolute, true)
}

async function transpileAndLoadConfigValueFile(filePathAbsolute: string): Promise<Result> {
  return transpileAndLoadPlusFile(filePathAbsolute, false)
}

async function transpileAndLoadPlusFile(filePathAbsolute: string, isPageConfig: boolean): Promise<Result> {
  assertPosixPath(filePathAbsolute)
  assert(filePathAbsolute.includes('+'))
  assert(isPageConfig === path.posix.basename(filePathAbsolute).includes('+config'))
  const buildResult = await buildFile(filePathAbsolute)
  if ('err' in buildResult) {
    return { err: buildResult.err }
  }
  const { code } = buildResult
  const filePathTmp = getFilePathTmp(filePathAbsolute)
  fs.writeFileSync(filePathTmp, code)
  const clean = () => fs.unlinkSync(filePathTmp)
  let exports: Record<string, unknown> = {}
  try {
    exports = await import_(filePathTmp)
  } catch (err) {
    return { err }
  } finally {
    clean()
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - We don't need this special object
  exports = { ...exports }
  return { exports }
}

async function buildFile(filePathAbsolute: string) {
  let result: BuildResult
  try {
    result = await esbuild.build({
      platform: 'node',
      entryPoints: [filePathAbsolute],
      sourcemap: 'inline',
      write: false,
      metafile: true,
      target: ['node14.18', 'node16'],
      outfile: 'NEVER_EMITTED.js',
      logLevel: 'silent',
      format: 'esm',
      bundle: true,
      packages: 'external',
      minify: false
    })
  } catch (err) {
    // TODO: let the error throw?
    return { err }
  }
  const { text } = result.outputFiles![0]!
  return {
    code: text,
    dependencies: Object.keys(result.metafile!.inputs)
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
