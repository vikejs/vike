export { transpileAndLoadScriptFile }

import esbuild, { type BuildResult } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { import_ } from '@brillout/import'
import { assertPosixPath } from './filesystemPathHandling'
import { getRandomId } from './getRandomId'
import { assertServerEnv_setIsNotProduction } from './assertServerEnv'

assertServerEnv_setIsNotProduction()

async function transpileAndLoadScriptFile(
  scriptFile: string
): Promise<{ exports: Record<string, unknown> } | { err: unknown }> {
  assertPosixPath(scriptFile)
  const buildResult = await build(scriptFile)
  if ('err' in buildResult) {
    return { err: buildResult.err }
  }
  const { code } = buildResult
  const filePathTmp = getFilePathTmp(scriptFile)
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

function getFilePathTmp(filePath: string): string {
  assertPosixPath(filePath)
  const dirname = path.posix.dirname(filePath)
  const filename = path.posix.basename(filePath)
  const filePathTmp = path.posix.join(dirname, `[build:${getRandomId(12)}]${filename}.mjs`)
  return filePathTmp
}

async function build(entry: string) {
  let result: BuildResult
  try {
    result = await esbuild.build({
      platform: 'node',
      entryPoints: [entry],
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
    return { err }
  }
  const { text } = result.outputFiles![0]!
  return {
    code: text,
    dependencies: Object.keys(result.metafile!.inputs)
  }
}
