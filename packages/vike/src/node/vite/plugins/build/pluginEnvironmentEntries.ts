export { pluginEnvironmentEntries }
export { getEnvironmentEntryPlaceholder }

// Vike's server environment imports the global entry of every additional environment (e.g. `rsc`), see loadPageContextEnvironments.ts
// - An additional environment is a separate build, so the server imports its entry by a path relative to the importing chunk, which is known only after chunking (the same marker + renderChunk() as @vitejs/plugin-rsc's import.meta.viteRsc.loadModule())

import { assertUsage } from '../../../../utils/assert.js'
import type { Environment, Plugin } from 'vite'
import { generateVirtualFileIdAdditionalEnvironment } from '../../../../shared-server-node/virtualFileId.js'
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
          const { _additionalEnvironmentNames: additionalEnvironmentNames } = await getVikeConfigInternal()
          if (!additionalEnvironmentNames.includes(name)) return
          assertUsage(
            config.consumer === 'server',
            `The Vike environment ${name} should be a server-side Vite environment`,
          )
          this.emitFile({
            type: 'chunk',
            id: generateVirtualFileIdAdditionalEnvironment(name),
            fileName: environmentEntryFileName,
          })
        },
      },
    },
    {
      name: 'vike:build:linkEnvironmentEntries',
      apply: 'build',
      resolveId: {
        filter: { id: new RegExp(`^${environmentEntryPlaceholder}:`) },
        handler(id) {
          return { id, external: true }
        },
      },
      renderChunk: {
        handler(code, chunk) {
          return replaceEnvironmentEntryPlaceholders(code, chunk.fileName, this.environment)
        },
      },
    },
  ]
}

// The import specifier of the environment's entry, replaced by its relative path once the importer's location is known
function getEnvironmentEntryPlaceholder(environmentName: string) {
  return `${environmentEntryPlaceholder}:${environmentName}`
}

// Replace each placeholder with the path of the environment's entry, relative to the chunk
function replaceEnvironmentEntryPlaceholders(code: string, chunkFileName: string, environment: Environment) {
  if (!code.includes(environmentEntryPlaceholder)) return
  const { config } = environment
  const chunkDir = path.dirname(path.resolve(config.root, config.build.outDir, chunkFileName))
  const { magicString, getMagicStringResult } = getMagicString(code, chunkFileName)
  for (const match of code.matchAll(environmentEntryPlaceholderRegex)) {
    const outDir = config.environments[match[2]!]!.build.outDir
    const environmentEntry = path.resolve(config.root, outDir, environmentEntryFileName)
    let importPath = path.relative(chunkDir, environmentEntry).split(path.sep).join('/')
    if (!importPath.startsWith('.')) importPath = `./${importPath}`
    magicString.overwrite(match.index, match.index + match[0].length, JSON.stringify(importPath))
  }
  return getMagicStringResult()
}
