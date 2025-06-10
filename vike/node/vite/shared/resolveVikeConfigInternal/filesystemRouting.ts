export { getFilesystemRouteString }
export { getFilesystemRouteDefinedBy }
export { isInherited }
export { getLocationId }
export { sortAfterInheritanceOrder }
export { applyFilesystemRoutingRootEffect }
export type { LocationId }

// For ./filesystemRouting.spec.ts
export { getLogicalPath }

import pc from '@brillout/picocolors'
import { assert, assertIsNotProductionRuntime, assertPosixPath, assertWarning, higherFirst } from '../../utils.js'
assertIsNotProductionRuntime()

/**
 * The `locationId` value is used for filesystem inheritance.
 *
 * Each config value is assigned with a `locationId` value. That's the source-of-truth for determining inheritance between config values.
 *
 * For Vike extensions, `locationId` is different than the config value's `definedAtFilePath`, for example the `onRenderHtml()` hook of `vike-react`:
 *  - `locationId === '/pages'` (the directory of `/pages/+config.js` which extends `vike-react`)
 *  - `definedAtFilePath.filePathAbsoluteFilesystem === '/home/rom/code/my-vike-app/node_modules/vike-react/dist/renderer/onRenderHtml.js'` (the file where the value is defined)
 *
 *  This is an important distinction because the Vike extension's config should only apply to where it's being extended from, for example:
 *  ```js
 *  // /pages/admin/+config.js
 *  import vikeVue from 'vike-vue/config'
 *  // Should only apply to /pages/admin/**
 *  export default { extends: [vikeVue] }
 *  ```
 *  ```js
 *  // /pages/marketing/+config.js
 *  import vikeReact from 'vike-react/config'
 *  // Should only apply to /pages/marketing/**
 *  export default { extends: [vikeReact] }
 *  ```
 */
type LocationId = string & { __brand: 'LocationId' }

/**
 * `getLocationId('/pages/some-page/+Page.js')` => `'/pages/some-page'`
 * `getLocationId('/renderer/+config.js')` => `'/renderer'`
 *
 * The value `locationId` is always a user-land path, because Filesystem Routing/Inheritance only applies to the user-land (Vike never uses Filesystem Routing/Inheritance for `node_modules/**`).
 */
function getLocationId(
  // We always determine `locationId` from a real user-land file: the `locationId` for Vike extensions is the `locationId` of the the user's `+config.js` that extends the Vike extension.
  filePathAbsoluteUserRootDir: string
): LocationId {
  assertPosixPath(filePathAbsoluteUserRootDir)
  assert(filePathAbsoluteUserRootDir.startsWith('/'))
  const locationId = removeFilename(filePathAbsoluteUserRootDir)
  assertLocationId(locationId)
  return locationId as LocationId
}
/** Filesystem Routing: get the URL */
function getFilesystemRouteString(locationId: LocationId): string {
  return getLogicalPath(locationId, ['renderer', 'pages', 'src', 'index'], true)
}
/** Filesystem Inheritance: get the apply root */
function getInheritanceRoot(locationId: LocationId): string {
  return getLogicalPath(locationId, [
    'renderer',
    // - Enable hooks defined by vike-{react,vue,solid} such as +onBeforeRenderClient to be defined at the root directory. In other words, avoid following error:
    //   ```bash
    //   [11:09:43.072][/test-preview.test.ts][npm run preview][stderr] Error: [vike][Wrong Usage] /+onBeforeRenderClient.ts sets the value of the config onBeforeRenderClient which is a custom config that is defined with https://vike.dev/meta at a path that doesn't apply to / — see https://vike.dev/config#inheritance
    //   ```
    // - Not sure if it's a good idea? Could it make config inheritance confusing? Let's try for now and see how it goes.
    // - TO-DO/eventually: update docs https://github.com/vikejs/vike/blob/5fcdc4d5094f1a4dcbefc0b481cdd30a205aef2d/docs/pages/filesystem-routing/%2BPage.mdx?plain=1#L98
    'pages'
  ])
}
/**
 * getLogicalPath('/pages/some-page', ['pages']) => '/some-page'
 */
function getLogicalPath(locationId: LocationId, ignoredDirs: string[], removeParenthesesDirs?: true): string {
  let logicalPath = removeIgnoredDirectories(locationId, ignoredDirs, removeParenthesesDirs)
  assertIsPath(logicalPath)
  return logicalPath
}

// See getPlusFilesRelevant() and getPlusFilesOrdered()
function sortAfterInheritanceOrder(
  locationId1: LocationId,
  locationId2: LocationId,
  locationIdPage: LocationId
): -1 | 1 | 0 {
  assertLocationId(locationId1)
  assertLocationId(locationId2)

  if (locationId1 === locationId2) return 0

  const inheritanceRoot1 = getInheritanceRoot(locationId1)
  const inheritanceRoot2 = getInheritanceRoot(locationId2)
  const inheritanceRootPage = getInheritanceRoot(locationIdPage)

  // Only works if both locationId1 and locationId2 are inherited by the same page
  assert(isInherited(locationId1, locationIdPage))
  assert(isInherited(locationId2, locationIdPage))
  // Equivalent assertion (see isInherited() implementation)
  assert(startsWith(inheritanceRootPage, inheritanceRoot1))
  assert(startsWith(inheritanceRootPage, inheritanceRoot2))

  if (inheritanceRoot1 !== inheritanceRoot2) {
    // Should be true since locationId1 and locationId2 are both inherited by the same page
    assert(startsWith(inheritanceRoot1, inheritanceRoot2) || startsWith(inheritanceRoot2, inheritanceRoot1))
    assert(inheritanceRoot1.length !== inheritanceRoot2.length)
    return higherFirst<string>((inheritanceRoot) => inheritanceRoot.length)(inheritanceRoot1, inheritanceRoot2)
  }

  // locationId1 first, i.e. `indexOf(locationId1) < indexOf(locationId2)`
  const locationId1First = -1
  // locationId2 first, i.e. `indexOf(locationId2) < indexOf(locationId1)`
  const locationId2First = 1

  if (locationIsRendererDir(locationId1) !== locationIsRendererDir(locationId2)) {
    return locationIsRendererDir(locationId1) ? locationId2First : locationId1First
  }

  // Doesn't have any function beyond making the order deterministic
  //  - Although we make /src/renderer/+config.js override /renderer/+config.js which potentially can make somewhat sense (e.g. when ejecting a renderer)
  if (locationId1.length !== locationId2.length) {
    return higherFirst<string>((locationId) => locationId.length)(locationId1, locationId2)
  }
  return locationId1 > locationId2 ? locationId1First : locationId2First
}
function locationIsRendererDir(locationId: LocationId) {
  return locationId.split('/').includes('renderer')
}

/** Whether configs defined at `locationId1` also apply at `locationId2` */
function isInherited(locationId1: LocationId, locationId2: LocationId): boolean {
  const inheritanceRoot1 = getInheritanceRoot(locationId1)
  const inheritanceRoot2 = getInheritanceRoot(locationId2)
  return startsWith(inheritanceRoot2, inheritanceRoot1)
}

function removeIgnoredDirectories(somePath: string, ignoredDirs: string[], removeParenthesesDirs?: true): string {
  assertPosixPath(somePath)
  somePath = somePath
    .split('/')
    .filter((dir) => {
      if (ignoredDirs.includes(dir)) {
        return false
      }
      if (removeParenthesesDirs && dir.startsWith('(') && dir.endsWith(')')) {
        assertRedundantParentheses(dir, ignoredDirs, somePath)
        return false
      }
      return true
    })
    .join('/')
  if (somePath === '') somePath = '/'
  return somePath
}
function assertRedundantParentheses(dir: string, ignoredDirs: string[], somePath: string) {
  const dirWithoutParentheses = dir.slice(1, -1)
  if (!ignoredDirs.includes(dirWithoutParentheses)) {
    return
  }
  const dirnameActual = dir
  const dirnameCorect = dirWithoutParentheses
  const dirpathActual = somePath.slice(0, somePath.indexOf(dirnameActual) + dirnameActual.length)
  const dirpathCorect = dirpathActual.replaceAll(dirnameActual, dirnameCorect)
  const logDir = (d: string) => pc.bold(d + '/')
  assertWarning(
    false,
    [
      `The directories ${logDir(dirnameCorect)} are always ignored by Vike's Filesystem Routing`,
      '(https://vike.dev/filesystem-routing):',
      `rename directory ${logDir(dirpathActual)} to ${logDir(dirpathCorect)}`
    ].join(' '),
    { onlyOnce: true }
  )
}

function removeFilename(filePathAbsoluteUserRootDir: string) {
  const filePathParts = filePathAbsoluteUserRootDir.split('/')
  {
    const filename = filePathParts.slice(-1)[0]!
    assert(filename.includes('.'))
  }
  let locationId = filePathParts.slice(0, -1).join('/')
  if (locationId === '') locationId = '/'
  assertLocationId(locationId)
  return locationId
}

function getFilesystemRouteDefinedBy(locationId: LocationId): string {
  if (locationId === '/') return locationId
  assert(!locationId.endsWith('/'))
  const routeFilesystemDefinedBy = locationId + '/'
  return routeFilesystemDefinedBy
}

function applyFilesystemRoutingRootEffect(
  routeFilesystem: string,
  filesystemRoutingRootEffect: { before: string; after: string }
): string {
  const { before, after } = filesystemRoutingRootEffect
  assert(after.startsWith('/'))
  assert(routeFilesystem.startsWith(before))
  routeFilesystem = after + '/' + routeFilesystem.slice(before.length)
  routeFilesystem = '/' + routeFilesystem.split('/').filter(Boolean).join('/')
  return routeFilesystem
}

function assertLocationId(locationId: string) {
  assert(locationId.startsWith('/'))
  assert(!locationId.endsWith('/') || locationId === '/')
}
function assertIsPath(logicalPath: string) {
  assert(logicalPath.startsWith('/'))
  assert(!logicalPath.endsWith('/') || logicalPath === '/')
}

/** Whether `inheritanceRoot1` starts with `inheritanceRoot2` */
function startsWith(inheritanceRoot1: string, inheritanceRoot2: string): boolean {
  assertIsPath(inheritanceRoot1)
  assertIsPath(inheritanceRoot2)
  const segments1 = inheritanceRoot1.split('/').filter(Boolean)
  const segments2 = inheritanceRoot2.split('/').filter(Boolean)
  for (const i in segments2) {
    const segment1 = segments1[i]
    const segment2 = segments2[i]
    if (segment1 !== segment2) {
      /* This assertion fails for:
         ```
         inheritanceRoot1: '/pages/about2'
         inheritanceRoot2: '/pages/about'
         ```
      assert(!inheritanceRoot1.startsWith(inheritanceRoot2))
      */
      return false
    }
  }
  assert(inheritanceRoot1.startsWith(inheritanceRoot2))
  return true
}
