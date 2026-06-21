export { addProgrammaticPages }

import pc from '@brillout/picocolors'
import { assertUsage } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import type { LocationId } from './filesystemRouting.js'
import type { ConfigFile } from './loadFileAtConfigTime.js'
import {
  getPlusFileFromConfigFile,
  type PlusFileConfig,
  type PlusFilesByLocationId,
} from './getPlusFilesByLocationId.js'
import '../../assertEnvVite.js'

// Marker directory for programmatically defined pages (config.pages).
// - It's a parenthesis "route group" so it's transparent to Filesystem Routing (it's stripped from the filesystem-route fallback).
// - It namespaces synthetic pages so that they can never collide with — nor become the Filesystem Inheritance parent of — a real page.
const programmaticPagesDir = '(programmatic)'

// Turn each `config.pages` entry into a synthetic +config.js so that the rest of the config resolution treats it like a regular page.
function addProgrammaticPages(plusFilesByLocationId: PlusFilesByLocationId, userRootDir: string): void {
  // Snapshot the defining config files before mutating plusFilesByLocationId.
  const definingPlusFiles = Object.values(plusFilesByLocationId)
    .flat()
    .filter(
      (plusFile): plusFile is PlusFileConfig => plusFile.isConfigFile && 'pages' in plusFile.fileExportsByConfigName,
    )

  const locationIdsSeen = new Set<LocationId>(Object.keys(plusFilesByLocationId) as LocationId[])

  definingPlusFiles.forEach((definingPlusFile) => {
    const pages = definingPlusFile.fileExportsByConfigName.pages
    const definedAt = definingPlusFile.filePath.filePathToShowToUser
    assertUsage(
      Array.isArray(pages),
      `${definedAt} sets ${pc.cyan('+pages')} to an invalid value: it should be an array`,
    )
    pages.forEach((entry: unknown, i: number) => {
      const definedAtEntry = `${definedAt} > ${pc.cyan(`pages[${i}]`)}`
      assertUsage(isObject(entry), `${definedAtEntry} should be an object.`)
      assertUsage(
        'route' in entry,
        `${definedAtEntry} must define ${pc.cyan('+route')}`,
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
      const plusFile = getPlusFileFromConfigFile(
        configFile,
        definingPlusFile.isExtensionConfig,
        locationId,
        userRootDir,
      )
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
    assertUsage(
      false,
      `${definedAtEntry} sets ${pc.cyan('route')} to a non-string value: set a unique ${pc.cyan('id')}.`,
    )
  }
  const slug = base
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || String(i)
}
