import { writeFile as writeFile_cb } from 'fs'
import { green, gray, cyan } from 'kolorist'
import * as rollup from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { assert } from './utils'
import { join, sep, relative } from 'path'

export { buildCloudflareWorker }

async function buildCloudflareWorker({ worker, root = process.cwd() }: { worker: string; root?: string }) {
  console.log(
    `${cyan(`vite-plugin-ssr ${require('../package.json').version}`)} ${green('building Cloudflare Worker...')}`
  )

  await buildImporter(root)

  const inputOptions: rollup.InputOptions = {
    input: worker,
    plugins: [
      esbuild({
        sourceMap: false,
        minify: false
      }),
      resolve(),
      commonjs(),
      json(),
      nodePolyfills({ sourceMap: false }) as rollup.Plugin
    ],
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        // Circular dependency warning doesn't seem to break build; https://github.com/snowpackjs/snowpack/pull/289#issuecomment-622167990
        return
      }
      warn(warning)
    }
  }
  const bundle = await rollup.rollup(inputOptions)
  const dir = join('dist', 'server') + sep
  const fileName = 'worker.js'
  const file = join(relative(__dirname, root), dir, fileName)
  const outputOptions: rollup.OutputOptions = {
    format: 'iife',
    exports: 'none',
    file,
    sourcemap: false
  }
  const { output } = await bundle.generate(outputOptions)
  assert(output.length === 1)
  assert(output[0].fileName === fileName)
  console.log(`${gray(dir)}${cyan(fileName)}`)
  console.log(`${green(`✓`)} Worker built.`)

  // or write the bundle to disk
  await bundle.write(outputOptions)

  // closes the bundle
  await bundle.close()
}

async function buildImporter(root: string): Promise<void> {
  const importerCode = getImporterCode()
  await writeFile(join(root, 'dist', 'server', 'importer.js'), importerCode)
}

function getImporterCode(): string {
  return `// Import/require this file if you need to bundle your entire server code into a single file. For example for Cloudflare Workers.
// (The path of following dependencies are normally determined at run-time; this file makes them statically-analysable instead so that bundlers can determine the entire dependency tree at build-time.)
require("./infra.node.vite-entry.js");
const clientManifest = require("../client/manifest.json");
const serverManifest = require("../server/manifest.json");
const { __private_setViteManifest } = require("vite-plugin-ssr");
__private_setViteManifest({ clientManifest, serverManifest });
`
}

function writeFile(path: string, fileContent: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile_cb(path, fileContent, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
