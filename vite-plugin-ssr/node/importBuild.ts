import { createPageRenderWasCalled } from './createPageRender.node'
import { setViteManifest } from './getViteManifest.node'
import { setPageFiles } from '../shared/getPageFiles.shared'
import { assertUsage } from '../utils'

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
    createPageRenderWasCalled() === false,
    'You are trying to load `dist/server/importBuild.js` after calling `createPageRender()`. Make sure to load `dist/server/importBuild.js` before calling `createPageRender()` instead.'
  )
  setPageFiles(pageFiles)
  setViteManifest({ clientManifest, serverManifest })
  wasCalled = true
}
