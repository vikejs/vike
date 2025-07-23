export { getPageAssets }
export { setResolveClientEntriesDev }
export { resolveIncludeAssetsImportedByServer }
export type { PageAsset }
export type { GetPageAssets }
export type { PageContextGetPageAssets }

import { assert, prependBase, toPosixPath, unique, getGlobalObject, getViteRPC } from '../utils.js'
import { retrieveAssetsDev } from './getPageAssets/retrieveAssetsDev.js'
import { retrieveAssetsProd } from './getPageAssets/retrieveAssetsProd.js'
import { inferMediaType, type MediaType } from './inferMediaType.js'
import { getManifestEntry } from './getPageAssets/getManifestEntry.js'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import { sortPageAssetsForEarlyHintsHeader } from './getPageAssets/sortPageAssetsForEarlyHintsHeader.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { ViteManifest } from '../../../types/ViteManifest.js'
import type { ResolveClientEntriesDev } from '../../vite/shared/resolveClientEntriesDev.js'
import type { ConfigResolved } from '../../../types/index.js'
import type { ViteDevServer } from 'vite'
import type { ViteRpc } from '../../vite/plugins/pluginViteRPC.js'

const globalObject = getGlobalObject('renderPage/getPageAssets.ts', {
  resolveClientEntriesDev: null as null | ResolveClientEntriesDev,
})

type PageAsset = {
  src: string
  assetType: null | NonNullable<MediaType>['assetType']
  mediaType: null | NonNullable<MediaType>['mediaType']
  isEntry: boolean
}
type GetPageAssets = () => Promise<PageAsset[]>

type PageContextGetPageAssets = {
  _baseServer: string
  _baseAssets: string | null
  _globalContext: GlobalContextServerInternal
}

async function getPageAssets(
  pageContext: PageContextGetPageAssets,
  clientDependencies: ClientDependency[],
  clientEntries: string[],
): Promise<PageAsset[]> {
  const globalContext = pageContext._globalContext
  const { _isProduction: isProduction } = globalContext
  const isDev = !isProduction

  const { assetUrls, clientEntriesSrc } = isDev
    ? !globalContext._viteDevServer
      ? await getViteRPC<ViteRpc>().retrievePageAssetsDevRpc(clientDependencies, clientEntries)
      : await retrievePageAssetsDev(globalContext._viteDevServer, clientDependencies, clientEntries)
    : retrievePageAssetsProd(
        globalContext.assetsManifest,
        clientDependencies,
        clientEntries,
        resolveIncludeAssetsImportedByServer(globalContext.config),
      )

  let pageAssets: PageAsset[] = []
  unique([...clientEntriesSrc, ...assetUrls]).forEach((src: string) => {
    const { mediaType = null, assetType = null } = inferMediaType(src) || {}

    if (isDev && assetType === 'style') {
      // https://github.com/vikejs/vike/issues/449
      if (src.endsWith('?inline')) {
        return
      }
      // https://github.com/vikejs/vike/issues/401
      // WARNING: if changing following line, then also update https://github.com/vikejs/vike/blob/fae90a15d88e5e87ca9fcbb54cf2dc8773d2f229/vike/client/shared/removeFoucBuster.ts#L28
      src = src + '?direct'
    }

    const isEntry =
      clientEntriesSrc.includes(src) ||
      // Vite automatically injects CSS, not only in development, but also in production (albeit with a FOUC). Therefore, strictly speaking, CSS aren't entries. We still, however, set `isEntry: true` for CSS, in order to denote page assets that should absolutely be injected in the HTML, regardless of preload strategy (not injecting CSS leads to FOUC).
      assetType === 'style'

    pageAssets.push({
      src,
      assetType,
      mediaType,
      isEntry,
    })
  })

  pageAssets.forEach(({ src }) => {
    assert(1 === pageAssets.filter((p) => p.src === src).length)
  })

  pageAssets = pageAssets.map((pageAsset) => {
    const baseServerAssets = pageContext._baseAssets || pageContext._baseServer
    pageAsset.src = prependBase(toPosixPath(pageAsset.src), baseServerAssets)
    return pageAsset
  })

  await sortPageAssetsForEarlyHintsHeader(pageAssets, isProduction)

  return pageAssets
}

async function retrievePageAssetsDev(
  viteDevServer: ViteDevServer,
  clientDependencies: ClientDependency[],
  clientEntries: string[],
) {
  const clientEntriesSrc = clientEntries.map((clientEntry) =>
    globalObject.resolveClientEntriesDev!(clientEntry, viteDevServer),
  )
  const assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
  return { clientEntriesSrc, assetUrls }
}
function retrievePageAssetsProd(
  assetsManifest: ViteManifest,
  clientDependencies: ClientDependency[],
  clientEntries: string[],
  includeAssetsImportedByServer: boolean,
) {
  const clientEntriesSrc = clientEntries.map((clientEntry) => resolveClientEntriesProd(clientEntry, assetsManifest))
  const assetUrls = retrieveAssetsProd(
    clientDependencies,
    assetsManifest,
    resolveIncludeAssetsImportedByServer(includeAssetsImportedByServer),
  )
  return { clientEntriesSrc, assetUrls }
}
function resolveClientEntriesProd(clientEntry: string, assetsManifest: ViteManifest): string {
  const { manifestEntry } = getManifestEntry(clientEntry, assetsManifest)
  assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry || clientEntry.endsWith('.css'), { clientEntry })
  let { file } = manifestEntry
  assert(!file.startsWith('/'))
  return '/' + file
}

function setResolveClientEntriesDev(resolveClientEntriesDev: ResolveClientEntriesDev) {
  globalObject.resolveClientEntriesDev = resolveClientEntriesDev
}

function resolveIncludeAssetsImportedByServer(config: ConfigResolved): boolean {
  return config.includeAssetsImportedByServer ?? true
}
