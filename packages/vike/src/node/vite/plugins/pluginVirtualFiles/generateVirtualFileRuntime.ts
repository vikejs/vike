export { generateVirtualFileRuntime }
export { getCode }

import { generateVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { requireResolveDistFile } from '../../../../utils/requireResolve.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getVikeEnvironmentName } from '../../shared/environmentName.js'
import { getConfigValueBuildTime } from '../../../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../../../types/PageConfig.js'
import '../../assertEnvVite.js'

async function generateVirtualFileRuntime(
  viteEnvironmentName: string,
  isServerSide: boolean,
  isDev: boolean,
): Promise<string> {
  const { _runtimeEnvironmentNames: runtimeEnvironmentNames, _pageConfigs: pageConfigs } =
    await getVikeConfigInternal(true)
  const environmentName = getVikeEnvironmentName(viteEnvironmentName, isServerSide, runtimeEnvironmentNames)
  return getCode(
    environmentName,
    viteEnvironmentName,
    isDev,
    requireResolveDistFile('dist/runtime/createLoadPageConfig.js'),
    getClientRouting(pageConfigs),
  )
}

// Client-side, a page's config values depend on whether the page uses Client Routing
function getClientRouting(pageConfigs: PageConfigBuildTime[]): boolean | string[] {
  const pageIds = pageConfigs
    .filter((pageConfig) => getConfigValueBuildTime(pageConfig, 'clientRouting', 'boolean')?.value)
    .map(({ pageId }) => pageId)
  if (pageIds.length === 0) return false
  if (pageIds.length === pageConfigs.length) return true
  return pageIds
}

function getCode(
  environmentName: string,
  viteEnvironmentName: string,
  isDev: boolean,
  createLoadPageConfigFile: string,
  clientRouting: boolean | string[],
) {
  // Only the client has two global entries (Client Routing and Server Routing)
  const clientRoutingOfEnvironment = environmentName === 'client' ? clientRouting : false
  const importGlobalEntry = (isClientRouting: boolean) =>
    `import(${JSON.stringify(generateVirtualFileId({ type: 'global-entry', environmentName, isClientRouting }))})`
  const loadGlobalEntry = !Array.isArray(clientRoutingOfEnvironment)
    ? `() => ${importGlobalEntry(clientRoutingOfEnvironment)}`
    : `(isClientRouting) => isClientRouting ? ${importGlobalEntry(true)} : ${importGlobalEntry(false)}`
  return [
    `import { createLoadPageConfig } from ${JSON.stringify(createLoadPageConfigFile)};`,
    `export const environmentName = ${JSON.stringify(environmentName)};`,
    `export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`,
    `export const loadPageConfig = createLoadPageConfig(${JSON.stringify(clientRoutingOfEnvironment)}, ${loadGlobalEntry}, ${JSON.stringify(isDev)});`,
  ].join('\n')
}
