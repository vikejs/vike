export { getVirtualFileImportPageConfigs }

import { getVikeConfig } from './getVikeConfig.js'
import type { ConfigVpsResolved } from '../../../../../shared/ConfigVps.js'
import { serializePageConfigs } from './serializePageConfigs.js'

async function getVirtualFileImportPageConfigs(
  userRootDir: string,
  isForClientSide: boolean,
  isDev: boolean,
  id: string,
  configVps: ConfigVpsResolved
): Promise<string> {
  const { pageConfigsData, pageConfigGlobal } = await getVikeConfig(userRootDir, isDev, configVps.extensions, true)
  return serializePageConfigs(pageConfigsData, pageConfigGlobal, isForClientSide, isDev, id)
}
