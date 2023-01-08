export { loadScript }

import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { import_ } from '@brillout/import'

async function loadScript(scriptFile: string): Promise<Record<string, unknown>> {
  const { code } = await build(scriptFile)
  const fileNameTmp = path.dirname(scriptFile) + '_tmp-' + (Math.random() * 10000).toString().split('.')[0] + '.mjs'
  fs.writeFileSync(fileNameTmp, code)
  let scriptExports: Record<string, unknown> = {}
  try {
    scriptExports = await import_(fileNameTmp)
  } finally {
    fs.unlinkSync(fileNameTmp)
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - AFAICT, this special object is unnecessary
  scriptExports = { ...scriptExports }
  return scriptExports
}

async function build(entry: string): Promise<{ code: string; dependencies: string[] }> {
  const result = await esbuild.build({
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
  const { text } = result.outputFiles[0]!
  return {
    code: text,
    dependencies: Object.keys(result.metafile!.inputs)
  }
}
