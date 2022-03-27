import { resolvePageFiles } from './resolveConfig/resolvePageFiles'

export { resolveConfig }
export type { Config }

type Config = { base?: string; baseAssets?: string; pageFiles?: { include: string[] } }

function resolveConfig(config: Config | undefined) {
  const getGlobRoots = resolvePageFiles(config?.pageFiles)
  const { baseAssets = null, base: baseUrl = '/' } = config ?? {}
  return { getGlobRoots, baseAssets, baseUrl }
}
