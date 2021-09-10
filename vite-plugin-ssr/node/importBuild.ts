import { createPageRendererWasCalled } from './createPageRenderer'
import { setViteManifest } from './getViteManifest'
import { setPageFiles } from '../shared/getPageFiles'
import { assertUsage } from '../shared/utils'

export { importBuild }
export { importBuildWasCalled }

let wasCalled = false

function importBuildWasCalled() {
  return wasCalled
}

function importBuild({
  pageFiles,
  clientManifest,
  serverManifest
}: {
  pageFiles: unknown
  clientManifest: unknown
  serverManifest: unknown
}) {
  assertUsage(
    wasCalled === false,
    'You are trying to load `dist/server/importBuild.js` a second time, but it should be loaded only once.'
  )
  assertUsage(
    createPageRendererWasCalled() === false,
    'You are trying to load `dist/server/importBuild.js` after calling `createPageRenderer()`. Make sure to load `dist/server/importBuild.js` before calling `createPageRenderer()` instead.'
  )
  setPageFiles(pageFiles)
  setViteManifest({ clientManifest, serverManifest })
  wasCalled = true
}
