import esbuild from 'esbuild'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

esbuild
  .build({
    plugins: [NodeModulesPolyfillPlugin()],
    platform: 'browser',
    conditions: ['node'],
    entryPoints: ['./worker/index.js'],
    sourcemap: true,
    outfile: './dist/worker.js',
    logLevel: 'warning',
    format: 'esm',
    target: 'es2020',
    bundle: true,
  })
  .then(() => console.log('Worker built successfully'))
  .catch((error) => console.error('Worker build failed', error))
