import { createPageRendererWasCalled } from './createPageRenderer'
import { setViteManifest } from './getViteManifest'
import { setPageFilesServerSide } from '../shared/getPageFiles'
import { assertUsage } from './utils'

export { importBuild }
export { importBuildWasLoaded }

let wasCalled = false

function importBuildWasLoaded() {
  return wasCalled
}

function importBuild({
  pageFiles,
  clientManifest,
  serverManifest,
  pluginManifest,
}: {
  pageFiles: unknown
  clientManifest: unknown
  serverManifest: unknown
  pluginManifest: unknown
}) {
  assertUsage(
    wasCalled === false,
    'You are trying to load `dist/server/importBuild.js` a second time, but it should be loaded only once.',
  )
  assertUsage(
    createPageRendererWasCalled() === false,
    'You are trying to load `dist/server/importBuild.js` after calling `createPageRenderer()`. Make sure to load `dist/server/importBuild.js` before calling `createPageRenderer()` instead.',
  )
  setPageFilesServerSide(pageFiles)
  setViteManifest({ clientManifest, serverManifest, pluginManifest })
  wasCalled = true
}
