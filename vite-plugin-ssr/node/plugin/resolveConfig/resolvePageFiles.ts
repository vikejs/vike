import { toPosixPath } from '../utils'
import { resolveGlobConfig } from '../glob'

export { resolvePageFiles }

function resolvePageFiles(pageFiles: undefined | { include: string[] }) {
  const includePageFiles: string[] = []
  if (pageFiles) {
    includePageFiles.push(...pageFiles.include.map(normalizeIncludePaths))
  }
  const getGlobRoots = resolveGlobConfig(includePageFiles)
  return getGlobRoots
}

function normalizeIncludePaths(includePath: string): string {
  includePath = toPosixPath(includePath)
  if (includePath.endsWith('/')) {
    includePath = includePath.slice(0, -1)
  }
  return includePath
}
