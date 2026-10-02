export { pluginEnvironmentEntries }
export { getEnvironmentEntryPlaceholder }

// Vike's server environment imports the global entry of every other Vike environment (e.g. `rsc`), see addPageContextEnvironments.ts
// - The other environment is a separate build, so the server imports its entry by a path relative to the importing chunk, which is known only after chunking (the same marker + renderChunk() as @vitejs/plugin-rsc's import.meta.viteRsc.loadModule())

import { assertUsage } from '../../../../utils/assert.js'
import type { Plugin } from 'vite'
import { generateVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getMagicString } from '../../shared/getMagicString.js'
import path from 'node:path'
import '../../assertEnvVite.js'

const environmentEntryFileName = 'entry-environment.mjs'
const environmentEntryPlaceholder = '__VIKE_ENVIRONMENT_ENTRY__'
const environmentEntryPlaceholderRegex = new RegExp(`(["'\`])${environmentEntryPlaceholder}:(.+?)\\1`, 'g')

function pluginEnvironmentEntries(): Plugin[] {
  return [
    {
      name: 'vike:build:emitEnvironmentEntry',
      apply: 'build',
      buildStart: {
        async handler() {
          const { name, config } = this.environment
          const { _otherEnvironmentNames: otherEnvironmentNames } = await getVikeConfigInternal()
          if (!otherEnvironmentNames.includes(name)) return
          assertUsage(
            config.consumer === 'server',
            `The Vike environment ${name} should be a server-side Vite environment`,
          )
          this.emitFile({
            type: 'chunk',
            id: generateVirtualFileId({ type: 'global-entry', environmentName: name }),
            fileName: environmentEntryFileName,
          })
        },
      },
    },
    {
      name: 'vike:build:linkEnvironmentEntries',
      apply: 'build',
      renderChunk: {
        handler(code, chunk) {
          if (!code.includes(environmentEntryPlaceholder)) return
          const { config } = this.environment
          const chunkDir = path.dirname(path.resolve(config.root, config.build.outDir, chunk.fileName))
          const { magicString, getMagicStringResult } = getMagicString(code, chunk.fileName)
          for (const match of code.matchAll(environmentEntryPlaceholderRegex)) {
            const outDir = config.environments[match[2]!]!.build.outDir
            const environmentEntry = path.resolve(config.root, outDir, environmentEntryFileName)
            let importPath = path.relative(chunkDir, environmentEntry).split(path.sep).join('/')
            if (!importPath.startsWith('.')) importPath = `./${importPath}`
            magicString.overwrite(match.index, match.index + match[0].length, `import(${JSON.stringify(importPath)})`)
          }
          return getMagicStringResult()
        },
      },
    },
  ]
}

// Replaced by an import() of the environment's entry, once the importer's location is known
function getEnvironmentEntryPlaceholder(environmentName: string) {
  return `${environmentEntryPlaceholder}:${environmentName}`
}
