export { serverEntryPlugin }

import pc from '@brillout/picocolors'
import { createRequire } from 'module'
import path from 'path'
import type { Plugin } from 'vite'
import { getConfigVike } from '../../shared/getConfigVike.js'
import { assert, assertUsage, injectRollupInputs, viteIsSSR } from '../utils.js'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

function serverEntryPlugin(): Plugin {
  return {
    enforce: 'pre',
    name: 'vike:serverEntry',
    async configResolved(config) {
      const { server } = await getConfigVike(config)
      if (!server) {
        return
      }
      const entries = Object.entries(server.entry)
      assert(entries.length)
      const resolvedEntries: { [name: string]: string } = {}
      for (const [name, path_] of entries) {
        let entryFilePath = path.join(config.root, path_)
        try {
          resolvedEntries[name] = require_.resolve(entryFilePath)
        } catch (err) {
          assert((err as Record<string, unknown>).code === 'MODULE_NOT_FOUND')
          assertUsage(
            false,
            `No file found at ${entryFilePath}. Does the value ${pc.cyan(`'${server.entry}'`)} of ${pc.cyan(
              'server.entry'
            )} point to an existing file?`
          )
        }
      }

      if (viteIsSSR(config)) {
        config.build.rollupOptions.input = injectRollupInputs(resolvedEntries, config)
      }
    }
  }
}
