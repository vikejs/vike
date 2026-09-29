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
    requireResolveDistFile('dist/runtime/createRuntime.js'),
    getClientRouting(pageConfigs),
  )
}

// Client-side, a page's config values depend on whether the page uses Client Routing: `true` => every page, `false` => no page, array => these pages
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
  createRuntimeFile: string,
  clientRouting: boolean | string[],
) {
  const getLoadRuntime = (isClientRouting: boolean) => {
    const globalEntryId = generateVirtualFileId({ type: 'global-entry', environmentName, isClientRouting })
    return `import(${JSON.stringify(globalEntryId)}).then(({ pageConfigsSerialized, pageConfigGlobalSerialized }) => createRuntime(pageConfigsSerialized, pageConfigGlobalSerialized, ${JSON.stringify(isDev)}))`
  }
  // Only the client has two global entries (Client Routing and Server Routing)
  if (environmentName !== 'client') clientRouting = false
  const loadRuntime = !Array.isArray(clientRouting)
    ? `() => ${getLoadRuntime(clientRouting)}`
    : `(isClientRouting) => isClientRouting ? ${getLoadRuntime(true)} : ${getLoadRuntime(false)}`
  const isClientRouting = !Array.isArray(clientRouting) ? 'false' : `${JSON.stringify(clientRouting)}.includes(pageId)`
  // - The global entry is loaded only upon loadPageConfig(), so that importing `environmentName` is cheap
  // - Not cached in development, so that loadPageConfig() reflects added pages and modified configs
  return [
    `import { createRuntime } from ${JSON.stringify(createRuntimeFile)};`,
    `export const environmentName = ${JSON.stringify(environmentName)};`,
    `export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`,
    `const loadRuntime = ${loadRuntime};`,
    ...(isDev
      ? [
          `export async function loadPageConfig(pageId) {`,
          `  return (await loadRuntime(${isClientRouting}))(pageId);`,
          `}`,
        ]
      : [
          `const runtimePromises = new Map();`,
          `export async function loadPageConfig(pageId) {`,
          `  const isClientRouting = ${isClientRouting};`,
          `  if (!runtimePromises.has(isClientRouting)) runtimePromises.set(isClientRouting, loadRuntime(isClientRouting));`,
          `  return (await runtimePromises.get(isClientRouting))(pageId);`,
          `}`,
        ]),
  ].join('\n')
}
