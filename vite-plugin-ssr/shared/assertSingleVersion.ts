import { assertUsage, projectInfo } from './utils'

const { projectVersion } = projectInfo

const key = '__vite_plugin_ssr_version'
// @ts-ignore
const version: string = (globalThis[key] = globalThis[key] = projectVersion)

assertUsage(
  version === projectVersion,
  `Multiple versions \`vite-pluging-ssr@${version}\` and \`vite-pluging-ssr@${projectVersion}\` loaded. Make sure to load the same version.`,
)
