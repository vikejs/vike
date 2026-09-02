export { getCacheValue }
export { setCacheValue }

import fs from 'node:fs/promises'
import path from 'node:path'
import { isObject } from '../../../utils/isObject.js'
import '../assertEnvVite.js'

// Persistent key-value cache at node_modules/.vike/cache.json — e.g. to remember that a check was already done.
// - Best-effort: a missing or invalid file reads as empty, and write errors (e.g. read-only file system) are swallowed.
// - One top-level key per feature: entries are merged into the existing file.
// - Values must be JSON-serializable.
const cacheFilePathRelative = 'node_modules/.vike/cache.json'

async function getCacheValue(userRootDir: string, key: string): Promise<unknown> {
  const cache = await readCache(userRootDir)
  return cache[key]
}

async function setCacheValue(userRootDir: string, key: string, value: unknown): Promise<void> {
  const filePath = getCacheFilePath(userRootDir)
  try {
    const cache = await readCache(userRootDir)
    cache[key] = value
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, `${JSON.stringify(cache, null, 2)}\n`, 'utf8')
  } catch {
    // E.g. read-only file system
  }
}

async function readCache(userRootDir: string): Promise<Record<string, unknown>> {
  const filePath = getCacheFilePath(userRootDir)
  try {
    const cache: unknown = JSON.parse(await fs.readFile(filePath, 'utf8'))
    if (isObject(cache)) return cache
  } catch {
    // Missing or invalid cache file
  }
  return {}
}

function getCacheFilePath(userRootDir: string): string {
  return path.join(userRootDir, ...cacheFilePathRelative.split('/'))
}
