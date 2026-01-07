import '../assertEnvClient.js'

export { loadPageConfigsLazyClientSide }
export type { PageContext_loadPageConfigsLazyClientSide }
export { isErrorFetchingStaticAssets }

import { getPageFilesClientSide, type PageFile } from '../../shared-server-client/getPageFiles.js'
import { resolvePageContextConfig } from '../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { findPageConfig } from '../../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import type { PageConfigGlobalRuntime, PageConfigRuntime, PageConfigRuntimeLoaded } from '../../types/PageConfig.js'
import { objectAssign } from '../../utils/objectAssign.js'

const errStamp = '_isAssetsError'

type PageContext_loadPageConfigsLazyClientSide = {
  pageId: string
  _pageFilesAll: PageFile[]
  _globalContext: {
    _pageConfigs: PageConfigRuntime[]
    _pageConfigGlobal: PageConfigGlobalRuntime
  }
}

async function loadPageConfigsLazyClientSide(
  pageId: string,
  pageFilesAll: PageFile[],
  pageConfigs: PageConfigRuntime[],
  pageConfigGlobal: PageConfigGlobalRuntime,
) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId)
  const pageConfig = findPageConfig(pageConfigs, pageId)
  let pageConfigLoaded: null | PageConfigRuntimeLoaded
  try {
    // prettier-ignore
    // biome-ignore format:
    const result = await Promise.all([
      pageConfig && loadAndParseVirtualFilePageEntry(pageConfig, import.meta.env.DEV),
      ...pageFilesClientSide.map((p) => p.loadFile?.()),
    ])
    pageConfigLoaded = result[0]
  } catch (err: unknown) {
    if (isFetchError(err)) {
      Object.assign(err, { [errStamp]: true })
    } else {
      // Syntax error in user file
    }
    throw err
  }
  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, resolvePageContextConfig(pageFilesClientSide, pageConfigLoaded, pageConfigGlobal))
  objectAssign(pageContextAddendum, { _pageFilesLoaded: pageFilesClientSide })
  return pageContextAddendum
}

function isErrorFetchingStaticAssets(err: unknown) {
  if (!err) {
    return false
  }
  return (err as Record<string, unknown>)[errStamp] === true
}

// https://stackoverflow.com/questions/75928310/how-to-detect-that-import-some-url-failed-because-some-url-isnt-a-javasc
function isFetchError(err: unknown): err is Error {
  if (!(err instanceof Error)) return false
  // https://github.com/stacks-network/clarity-js-sdk/blob/e757666b59af00b5db04dd1bf0df016e3a459ea2/packages/clarity/src/providers/registry.ts#L40-L45
  // https://github.com/modernweb-dev/web/blob/0a59b56e4c1b50af81fbf4588f36a1ceb71f3976/integration/test-runner/tests/test-failure/runTestFailureTest.ts#L11-L18
  const FAILED_TO_FETCH_MESSAGES = [
    // chromium
    'Failed to fetch dynamically imported module',
    // firefox
    'error loading dynamically imported module',
    // safari
    'Importing a module script failed',
    // ??
    'error resolving module specifier',
    // ??
    'failed to resolve module',
  ]
  return FAILED_TO_FETCH_MESSAGES.some((s) => err.message.toLowerCase().includes(s.toLowerCase()))
}
