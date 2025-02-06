export { resolveConfigDefinitions }
export { getConfigDefinitions }
export { sortForGlobal }
export type { ConfigDefinitionsResolved }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  assertWarning,
  objectEntries,
  hasProp,
  includes,
  assertIsNotProductionRuntime,
  getMostSimilar,
  joinEnglish,
  assertKeys,
  objectKeys,
  objectFromEntries,
  unique,
  isCallable,
  makeFirst,
  lowerFirst
} from '../../../../utils.js'
import {
  configDefinitionsBuiltInAll,
  type ConfigDefinitions,
  type ConfigDefinitionInternal
} from './configDefinitionsBuiltIn.js'
import { isGlobalLocation, type LocationId } from './filesystemRouting.js'
import type { EsbuildCache } from './transpileAndExecuteFile.js'
import pc from '@brillout/picocolors'
import { loadPointerImport, loadValueFile } from './loadFileAtConfigTime.js'
import { type PlusFile, type PlusFilesByLocationId } from './getPlusFilesAll.js'

async function resolveConfigDefinitions(
  plusFilesAll: PlusFilesByLocationId,
  userRootDir: string,
  esbuildCache: EsbuildCache
) {
  const configDefinitionsGlobal = getConfigDefinitions(
    // We use `plusFilesAll` in order to allow local Vike extensions to create global configs.
    sortForGlobal(plusFilesAll),
    (configDef) => !!configDef.global
  )
  await loadCustomConfigBuildTimeFiles(plusFilesAll, configDefinitionsGlobal, userRootDir, esbuildCache)

  const configDefinitionsLocal: Record<
    LocationId,
    {
      configDefinitions: ConfigDefinitions
      // plusFiles that live at locationId
      plusFiles: PlusFile[]
      // plusFiles that influence locationId
      plusFilesRelevant: PlusFilesByLocationId
    }
  > = {}
  await Promise.all(
    objectEntries(plusFilesAll).map(async ([locationId, plusFiles]) => {
      const plusFilesRelevant = getPlusFilesRelevant(plusFilesAll, locationId)
      const configDefinitions = getConfigDefinitions(plusFilesRelevant, (configDef) => configDef.global !== true)
      await loadCustomConfigBuildTimeFiles(plusFiles, configDefinitions, userRootDir, esbuildCache)
      configDefinitionsLocal[locationId] = { configDefinitions, plusFiles, plusFilesRelevant }
    })
  )

  const configDefinitionsResolved = {
    configDefinitionsGlobal,
    configDefinitionsLocal
  }
  return configDefinitionsResolved
}
type ConfigDefinitionsResolved = Awaited<ReturnType<typeof resolveConfigDefinitions>>
// Load value files (with `env.config===true`) of *custom* configs.
// - The value files of *built-in* configs are already loaded at `getPlusFilesAll()`.
async function loadCustomConfigBuildTimeFiles(
  plusFiles: PlusFilesByLocationId | PlusFile[],
  configDefinitions: ConfigDefinitions,
  userRootDir: string,
  esbuildCache: EsbuildCache
): Promise<void> {
  const plusFileList: PlusFile[] = Object.values(plusFiles).flat(1)
  await Promise.all(
    plusFileList.map(async (plusFile) => {
      if (!plusFile.isConfigFile) {
        await loadValueFile(plusFile, configDefinitions, userRootDir, esbuildCache)
      } else {
        await Promise.all(
          Object.entries(plusFile.pointerImportsByConfigName).map(async ([configName, pointerImport]) => {
            await loadPointerImport(pointerImport, userRootDir, configName, configDefinitions, esbuildCache)
          })
        )
      }
    })
  )
}

function getConfigDefinitions(
  plusFilesRelevant: PlusFilesByLocationId,
  filter?: (configDef: ConfigDefinitionInternal) => boolean
): ConfigDefinitions {
  let configDefinitions: ConfigDefinitions = { ...configDefinitionsBuiltInAll }

  // Add user-land meta configs
  Object.entries(plusFilesRelevant)
    .reverse()
    .forEach(([_locationId, plusFiles]) => {
      plusFiles.forEach((plusFile) => {
        const confVal = getConfVal(plusFile, 'meta')
        if (!confVal) return
        assert(confVal.configValueLoaded)
        const meta = confVal.configValue
        assertMetaUsage(meta, `Config ${pc.cyan('meta')} defined at ${plusFile.filePath.filePathToShowToUser}`)

        // Set configDef._userEffectDefinedAtFilePath
        Object.entries(meta).forEach(([configName, configDef]) => {
          if (!configDef.effect) return
          assert(plusFile.isConfigFile)
          configDef._userEffectDefinedAtFilePath = {
            ...plusFile.filePath,
            fileExportPathToShowToUser: ['default', 'meta', configName, 'effect']
          }
        })

        objectEntries(meta).forEach(([configName, configDefinitionUserLand]) => {
          // User can override an existing config definition
          configDefinitions[configName] = {
            ...configDefinitions[configName],
            ...configDefinitionUserLand
          }
        })
      })
    })

  if (filter) {
    configDefinitions = Object.fromEntries(
      Object.entries(configDefinitions).filter(([_configName, configDef]) => filter(configDef))
    )
  }

  return configDefinitions
}

function sortForGlobal(plusFilesAll: PlusFilesByLocationId): PlusFilesByLocationId {
  const locationIdsAll = objectKeys(plusFilesAll)
  const plusFilesAllSorted = Object.fromEntries(
    objectEntries(plusFilesAll)
      .sort(lowerFirst(([locationId]) => locationId.split('/').length))
      .sort(makeFirst(([locationId]) => isGlobalLocation(locationId, locationIdsAll)))
  )
  return plusFilesAllSorted
}
