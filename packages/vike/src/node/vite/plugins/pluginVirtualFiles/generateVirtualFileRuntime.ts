export { generateVirtualFileRuntime }
export { getCode }

import { generateVirtualFileId } from '../../../../shared-server-node/virtualFileId.js'
import { requireResolveDistFile } from '../../../../utils/requireResolve.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { getVikeEnvironmentName } from '../../shared/environmentName.js'
import '../../assertEnvVite.js'

async function generateVirtualFileRuntime(
  viteEnvironmentName: string,
  isServerSide: boolean,
  isDev: boolean,
): Promise<string> {
  const { _runtimeEnvironmentNames: runtimeEnvironmentNames } = await getVikeConfigInternal(true)
  const environmentName = getVikeEnvironmentName(viteEnvironmentName, isServerSide, runtimeEnvironmentNames)
  return getCode(environmentName, viteEnvironmentName, isDev, requireResolveDistFile('dist/runtime/createRuntime.js'))
}

function getCode(environmentName: string, viteEnvironmentName: string, isDev: boolean, createRuntimeFile: string) {
  const globalEntryId = generateVirtualFileId({
    type: 'global-entry',
    environmentName,
    isClientRouting: environmentName === 'client',
  })
  const loadRuntime = `import(${JSON.stringify(globalEntryId)}).then(({ pageConfigsSerialized, pageConfigGlobalSerialized }) => createRuntime(pageConfigsSerialized, pageConfigGlobalSerialized, ${JSON.stringify(isDev)}))`
  // - The global entry is loaded only upon loadPageConfig(), so that importing `environmentName` is cheap
  // - Not cached in development, so that loadPageConfig() reflects added pages and modified configs
  return [
    `import { createRuntime } from ${JSON.stringify(createRuntimeFile)};`,
    `export const environmentName = ${JSON.stringify(environmentName)};`,
    `export const viteEnvironmentName = ${JSON.stringify(viteEnvironmentName)};`,
    ...(isDev
      ? [`export async function loadPageConfig(pageId) {`, `  return (await ${loadRuntime})(pageId);`, `}`]
      : [
          `let runtimePromise;`,
          `export async function loadPageConfig(pageId) {`,
          `  if (!runtimePromise) runtimePromise = ${loadRuntime};`,
          `  return (await runtimePromise)(pageId);`,
          `}`,
        ]),
  ].join('\n')
}
