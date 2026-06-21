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
      const slug = getProgrammaticPageSlug(entry.route, i)
      const locationId = getProgrammaticPageLocationId(definingPlusFile.locationId, slug)
      assertUsage(
        !locationIdsSeen.has(locationId),
        `${definedAtEntry} resolves to the same page as another page — set a unique ${pc.cyan('route')}.`,
      )
      locationIdsSeen.add(locationId)

      const configFile: ConfigFile = {
        // The page is defined by the +config.js setting config.pages: resolve pointer imports (e.g. config.Page) relative to it.
        fileExports: { default: entry },
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
function getProgrammaticPageSlug(route: unknown, i: number): string {
  // Fall back to the array index when the route isn't a plain string (e.g. a Route Function).
  if (typeof route !== 'string') return String(i)
  const slug = route
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || String(i)
}
