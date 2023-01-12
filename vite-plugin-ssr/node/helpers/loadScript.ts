export { loadScript }

import esbuild, { type BuildResult } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { import_ } from '@brillout/import'
import { assertPosixPath } from '../utils'

async function loadScript(scriptFile: string): Promise<{ exports: Record<string, unknown> } | { err: unknown }> {
  assertPosixPath(scriptFile)
  const buildResult = await build(scriptFile)
  if ('err' in buildResult) {
    return { err: buildResult.err }
  }
  const { code } = buildResult
  const filePathTmp = getFilePathTmp(scriptFile)
  fs.writeFileSync(filePathTmp, code)
  let exports: Record<string, unknown> = {}
  try {
    exports = await import_(filePathTmp)
  } catch (err) {
    return { err }
  } finally {
    fs.unlinkSync(filePathTmp)
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - AFAICT, this special object is unnecessary
  exports = { ...exports }
  return { exports }
}

function getFilePathTmp(filePath: string): string {
  assertPosixPath(filePath)
  const dirname = path.posix.dirname(filePath)
  const filename = path.posix.basename(filePath)
  const filenameBase = filename.split('.')[0]
  const randomString = Math.pow(10, 5).toString().split('.')[0]
  const filePathTmp = path.posix.join(dirname, `${filenameBase}_tmp-${randomString}.mjs`)
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
      logLevel: 'warning',
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
