export { getPlusFilesByLocationId }
export type { PlusFileValue }
export type { PlusFile }
export type { PlusFilesByLocationId }

import { assert, assertUsage } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import pc from '@brillout/picocolors'
import { metaBuiltIn } from './metaBuiltIn.js'
import { type LocationId, getLocationId } from './filesystemRouting.js'
import { type EsbuildCache } from './transpileAndExecuteFile.js'
import { crawlPlusFilePaths, getPlusFileValueConfigName } from './crawlPlusFilePaths.js'
import { getConfigFileExport } from './getConfigFileExport.js'
import { type ConfigFile, loadConfigFile, loadValueFile, PointerImportLoaded } from './loadFileAtConfigTime.js'
import { resolvePointerImport } from './resolvePointerImport.js'
import { getFilePathResolved } from '../getFilePath.js'
import type { FilePathResolved } from '../../../../types/FilePath.js'
import { assertExtensionsConventions, assertExtensionsRequire } from './assertExtensions.js'
import '../../assertEnvVite.js'

type PlusFile = PlusFileConfig | PlusFileValue
type PlusFileCommon = {
  locationId: LocationId
  filePath: FilePathResolved
}
/** +config.js */
type PlusFileConfig = PlusFileCommon & {
  /** Whether file is `+config.js` or `+{configName}.js` */
  isConfigFile: true
  fileExportsByConfigName: Record<
    string, // configName
    unknown // configValue
  >
  pointerImportsByConfigName: Record<
    string, // configName
    PointerImportLoaded[]
  >
  isExtensionConfig: boolean
  extendsFilePaths: string[]
  // TypeScript convenience
  isNotLoaded?: undefined
}
/** +{configName}.js */
type PlusFileValue = PlusFileCommon & {
  /** Whether file is `+config.js` or `+{configName}.js` */
  isConfigFile: false
  configName: string
} & (
    | {
        isNotLoaded: false
        fileExportsByConfigName: Record<
          string, // configName
          unknown // configValue
        >
      }
    | {
        isNotLoaded: true
      }
  ) & {
    // TypeScript convenience
    isExtensionConfig?: undefined
  }
type PlusFilesByLocationId = Record<LocationId, PlusFile[]>

async function getPlusFilesByLocationId(
  userRootDir: string,
  esbuildCache: EsbuildCache,
): Promise<PlusFilesByLocationId> {
  const plusFilePaths: FilePathResolved[] = (await crawlPlusFilePaths(userRootDir)).map(
    ({ filePathAbsoluteUserRootDir }) => getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir }),
  )

  const plusFilesByLocationId: PlusFilesByLocationId = {}
  await Promise.all(
    plusFilePaths.map(async (filePath) => {
      if (getPlusFileValueConfigName(filePath.filePathAbsoluteFilesystem) === 'config') {
        // +config.js files

        const { filePathAbsoluteUserRootDir } = filePath
        assert(filePathAbsoluteUserRootDir)
        const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [], false, esbuildCache)
        assert(filePath.filePathAbsoluteUserRootDir)
        const locationId = getLocationId(filePathAbsoluteUserRootDir)
        const plusFile = getPlusFileFromConfigFile(configFile, false, locationId, userRootDir)

        plusFilesByLocationId[locationId] = plusFilesByLocationId[locationId] ?? []
        plusFilesByLocationId[locationId]!.push(plusFile)
        extendsConfigs.forEach((extendsConfig) => {
          /* We purposely use the same locationId because the Vike extension's config should only apply to where it's being extended from, for example:
          ```js
          // /pages/admin/+config.js

          import vikeVue from 'vike-vue/config'
          // Should only apply to /pages/admin/**
          export default { extends: [vikeVue] }
          ```
          ```js
          // /pages/marketing/+config.js

          import vikeReact from 'vike-react/config'
          // Should only apply to /pages/marketing/**
          export default { extends: [vikeReact] }
          ```
          */
          const plusFile = getPlusFileFromConfigFile(extendsConfig, true, locationId, userRootDir)
          assertExtensionsConventions(plusFile)
          plusFilesByLocationId[locationId]!.push(plusFile)
        })
      } else {
        // +{configName}.js files

        const { filePathAbsoluteUserRootDir } = filePath
        assert(filePathAbsoluteUserRootDir)

        const configName = getPlusFileValueConfigName(filePathAbsoluteUserRootDir)
        assert(configName)

        const locationId = getLocationId(filePathAbsoluteUserRootDir)

        const plusFile: PlusFileValue = {
          locationId,
          filePath,
          isConfigFile: false,
          isNotLoaded: true,
          configName,
        }
        plusFilesByLocationId[locationId] = plusFilesByLocationId[locationId] ?? []
        plusFilesByLocationId[locationId]!.push(plusFile)

        // We don't have access to the custom config definitions defined by the user yet.
        //  - If `configDef` is `undefined` => we load the file +{configName}.js later.
        //  - We already need to load +meta.js here (to get the custom config definitions defined by the user)
        await loadValueFile(plusFile, metaBuiltIn, userRootDir, esbuildCache)
      }
    }),
  )

  // Programmatically defined pages (config.pages) — resolved at config-time.
  addProgrammaticPages(plusFilesByLocationId, userRootDir)

  // Make lists element order deterministic
  Object.entries(plusFilesByLocationId).forEach(([_locationId, plusFiles]) => {
    plusFiles.sort(sortMakeDeterministic)
  })

  assertPlusFiles(plusFilesByLocationId)
  return plusFilesByLocationId
}

// Marker directory for programmatically defined pages (config.pages).
// - It's a parenthesis "route group" so it's transparent to Filesystem Routing (it's stripped from the filesystem-route fallback).
// - It namespaces synthetic pages so that they can never collide with — nor become the Filesystem Inheritance parent of — a real page.
const programmaticPagesDir = '(programmatic)'

// Turn each `config.pages` entry into a synthetic +config.js so that the rest of the config resolution treats it like a regular page.
function addProgrammaticPages(plusFilesByLocationId: PlusFilesByLocationId, userRootDir: string): void {
  // Snapshot the defining config files before mutating plusFilesByLocationId.
  const definingPlusFiles = Object.values(plusFilesByLocationId)
    .flat()
    .filter((plusFile): plusFile is PlusFileConfig => plusFile.isConfigFile && 'pages' in plusFile.fileExportsByConfigName)

  const locationIdsSeen = new Set<LocationId>(Object.keys(plusFilesByLocationId) as LocationId[])

  definingPlusFiles.forEach((definingPlusFile) => {
    const pages = definingPlusFile.fileExportsByConfigName.pages
    const definedAt = definingPlusFile.filePath.filePathToShowToUser
    assertUsage(
      Array.isArray(pages),
      `${definedAt} sets the config ${pc.cyan('pages')} to an invalid value: it should be an array.`,
    )
    pages.forEach((entry: unknown, i: number) => {
      const definedAtEntry = `${definedAt} > ${pc.cyan(`pages[${i}]`)}`
      assertUsage(isObject(entry), `${definedAtEntry} should be an object.`)
      assertUsage(
        'route' in entry,
        `${definedAtEntry} doesn't set ${pc.cyan('route')} but a programmatically defined page requires a ${pc.cyan('route')}.`,
      )
      const slug = getProgrammaticPageSlug(entry, i, definedAtEntry)
      const locationId = getProgrammaticPageLocationId(definingPlusFile.locationId, slug)
      assertUsage(
        !locationIdsSeen.has(locationId),
        `${definedAtEntry} resolves to the same page as another page — set a unique ${pc.cyan('route')} or ${pc.cyan('id')}.`,
      )
      locationIdsSeen.add(locationId)

      // `id` is metadata used to compute the locationId — it isn't a config.
      const fileExports = { default: { ...entry } }
      delete (fileExports.default as Record<string, unknown>).id

      const configFile: ConfigFile = {
        fileExports,
        // The page is defined by the +config.js setting config.pages: resolve pointer imports (e.g. config.Page) relative to it.
        filePath: definingPlusFile.filePath,
        extendsFilePaths: [],
      }
      const plusFile = getPlusFileFromConfigFile(configFile, definingPlusFile.isExtensionConfig, locationId, userRootDir)
      plusFilesByLocationId[locationId] = [plusFile]
    })
  })
}
function getProgrammaticPageLocationId(definingLocationId: LocationId, slug: string): LocationId {
  const base = definingLocationId === '/' ? '' : definingLocationId
  return `${base}/${programmaticPagesDir}/${slug}` as LocationId
}
function getProgrammaticPageSlug(entry: Record<string, unknown>, i: number, definedAtEntry: string): string {
  let base: string
  if (typeof entry.id === 'string' && entry.id) {
    base = entry.id
  } else if (typeof entry.route === 'string') {
    base = entry.route
  } else {
    assertUsage(false, `${definedAtEntry} sets ${pc.cyan('route')} to a non-string value: set a unique ${pc.cyan('id')}.`)
  }
  const slug = base
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || String(i)
}
function assertPlusFiles(plusFilesByLocationId: PlusFilesByLocationId) {
  const plusFiles = Object.values(plusFilesByLocationId).flat()
  // The earlier we call it the better, so that +require can be used by Vike extensions to depend on new Vike features
  assertExtensionsRequire(plusFiles)
}

function getPlusFileFromConfigFile(
  configFile: ConfigFile,
  isExtensionConfig: boolean,
  locationId: LocationId,
  userRootDir: string,
) {
  const { fileExports, filePath, extendsFilePaths } = configFile

  const fileExportsByConfigName: PlusFileConfig['fileExportsByConfigName'] = {}
  const pointerImportsByConfigName: PlusFileConfig['pointerImportsByConfigName'] = {}
  const fileExport = getConfigFileExport(fileExports, filePath.filePathToShowToUser)
  Object.entries(fileExport).forEach(([configName, configValue]) => {
    fileExportsByConfigName[configName] = configValue

    // Pointer imports
    const values = Array.isArray(configValue) ? configValue : [configValue]
    const pointerImports = values
      .map((value) => resolvePointerImport(value, configFile.filePath, userRootDir, configName))
      .filter((pointerImport) => pointerImport !== null)
      .map((pointerImport) => ({ ...pointerImport, fileExportValueLoaded: false as const }))
    if (pointerImports.length > 0) {
      pointerImportsByConfigName[configName] = pointerImports
    }
  })

  const plusFile: PlusFileConfig = {
    locationId,
    filePath,
    fileExportsByConfigName,
    pointerImportsByConfigName,
    isConfigFile: true,
    isExtensionConfig,
    extendsFilePaths,
  }
  return plusFile
}

// Make order deterministic (no other purpose)
function sortMakeDeterministic(plusFile1: PlusFile, plusFile2: PlusFile): 0 | -1 | 1 {
  // Sort by file path
  return plusFile1.filePath.filePathAbsoluteVite < plusFile2.filePath.filePathAbsoluteVite ? -1 : 1
}
