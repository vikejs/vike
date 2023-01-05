export { loadScript }
export { initSourceMap }

import esbuild from 'esbuild'
import sourceMapSupport from 'source-map-support'
import fs from 'fs'
import { import_ } from '@brillout/import'
import { assert } from '../utils'

const sourceMaps: Record<string, string> = {}

async function loadScript(scriptFile: string, debug = false): Promise<Record<string, unknown>> {
  const { outfile, clean } = await build(scriptFile, debug)
  let scriptExports: Record<string, unknown> = {}
  try {
    scriptExports = await import_(outfile)
  } finally {
    clean()
  }
  // Return a plain JavaScript object
  //  - import() returns `[Module: null prototype] { default: { onRenderClient: '...' }}`
  //  - AFAICT, this special object is unnecessary
  scriptExports = { ...scriptExports }
  return scriptExports
}

async function build(entry: string, debug: boolean): Promise<{ outfile: string; clean: () => void }> {
  const outfile = entry.split('.').slice(0, -1) + '.mjs'
  await esbuild.build({
    platform: 'node',
    entryPoints: [entry],
    sourcemap: true,
    outfile,
    logLevel: 'warning',
    format: 'esm',
    target: 'es2020',
    bundle: true,
    packages: 'external',
    minify: false
  })
  {
    const sourceMapFile = `${outfile}.map`
    sourceMaps[outfile] = fs.readFileSync(sourceMapFile, 'utf8')
    fs.unlinkSync(sourceMapFile)
  }
  const clean = () => {
    if (debug) {
      return
    }
    fs.unlinkSync(`${outfile}`)
  }
  return { outfile, clean }
}

const fsWindowsBugWorkaroundPrefix = 'file://'
function initSourceMap() {
  sourceMapSupport.install({
    retrieveSourceMap: function (source) {
      const prefix = fsWindowsBugWorkaroundPrefix
      if (source.startsWith(prefix)) {
        source = source.slice(prefix.length)
        if (process.platform == 'win32') {
          assert(source.startsWith('/'))
          source = source.slice(1)
          source = source.split('/').join('\\')
        }
      }
      let sourceMap = sourceMaps[source]
      if (sourceMap) {
        return {
          map: sourceMap
        }
      }
      assert(!source.endsWith('.test.mjs'), { source, sourceMapsKeys: Object.keys(sourceMaps) })
      return null
    }
  })
}
