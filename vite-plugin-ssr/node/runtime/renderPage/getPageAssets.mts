export { getPageAssets }
export type { PageAsset }
export type { GetPageAssets }
export type { PageContextGetPageAssets }

import {
  assert,
  normalizePath,
  prependBase,
  assertPosixPath,
  toPosixPath,
  isNpmPackageImport,
  unique,
  isNotNullish,
  pathJoin
} from '../utils.mjs'
import { retrieveAssetsDev } from './getPageAssets/retrieveAssetsDev.mjs'
import { retrieveAssetsProd } from './getPageAssets/retrieveAssetsProd.mjs'
import { inferMediaType, type MediaType } from './inferMediaType.mjs'
import { getManifestEntry } from './getPageAssets/getManifestEntry.mjs'
import type { ViteDevServer } from 'vite'
import type { ClientDependency } from '../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.mjs'
import { sortPageAssetsForEarlyHintsHeader } from './getPageAssets/sortPageAssetsForEarlyHintsHeader.mjs'
import type { ConfigVpsResolved } from '../../../shared/ConfigVps.mjs'
import { getGlobalContext } from '../globalContext.mjs'
import { assertClientEntryId } from './getPageAssets/assertClientEntryId.mjs'
import type { ViteManifest } from '../../shared/ViteManifest.mjs'
import { import_ } from '@brillout/import'
import type { createRequire as CreateRequire } from 'module'

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
  _includeAssetsImportedByServer: boolean
}

async function getPageAssets(
  pageContext: PageContextGetPageAssets,
  clientDependencies: ClientDependency[],
  clientEntries: string[]
): Promise<PageAsset[]> {
  const globalContext = getGlobalContext()
  const isDev = !globalContext.isProduction

  let assetUrls: string[]
  let clientEntriesSrc: string[]
  if (isDev) {
    const { viteDevServer, configVps } = globalContext
    clientEntriesSrc = await Promise.all(
      clientEntries.map((clientEntry) => resolveClientEntriesDev(clientEntry, viteDevServer, configVps))
    )
    assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
  } else {
    const { pluginManifest, clientManifest } = globalContext
    const manifestKeyMap = pluginManifest.manifestKeyMap
    clientEntriesSrc = clientEntries.map((clientEntry) =>
      resolveClientEntriesProd(clientEntry, clientManifest, manifestKeyMap)
    )
    assetUrls = retrieveAssetsProd(
      clientDependencies,
      clientManifest,
      pageContext._includeAssetsImportedByServer,
      manifestKeyMap
    )
  }

  let pageAssets: PageAsset[] = []
  unique([...clientEntriesSrc, ...assetUrls]).forEach((src: string) => {
    const { mediaType = null, assetType = null } = inferMediaType(src) || {}

    if (isDev && assetType === 'style') {
      // https://github.com/brillout/vite-plugin-ssr/issues/449
      if (src.endsWith('?inline')) {
        return
      }
      // https://github.com/brillout/vite-plugin-ssr/issues/401
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
      isEntry
    })
  })

  pageAssets.forEach(({ src }) => {
    assert(1 === pageAssets.filter((p) => p.src === src).length)
  })

  pageAssets = pageAssets.map((pageAsset) => {
    const baseServerAssets = pageContext._baseAssets || pageContext._baseServer
    pageAsset.src = prependBase(normalizePath(pageAsset.src), baseServerAssets)
    return pageAsset
  })

  sortPageAssetsForEarlyHintsHeader(pageAssets)

  return pageAssets
}

async function resolveClientEntriesDev(
  clientEntry: string,
  viteDevServer: ViteDevServer,
  configVps: ConfigVpsResolved
): Promise<string> {
  assertClientEntryId(clientEntry)

  let root = viteDevServer.config.root
  assert(root)
  root = toPosixPath(root)

  // The `?import` suffix is needed for MDX to be transpiled:
  //   - Not transpiled: `/pages/markdown.page.mdx`
  //   - Transpiled: `/pages/markdown.page.mdx?import`
  // But `?import` doesn't work with `/@fs/`:
  //   - Not transpiled: /@fs/home/runner/work/vite-plugin-ssr/vite-plugin-ssr/examples/react-full/pages/markdown.page.mdx
  //   - Not transpiled: /@fs/home/runner/work/vite-plugin-ssr/vite-plugin-ssr/examples/react-full/pages/markdown.page.mdx?import
  if (clientEntry.endsWith('?import')) {
    assert(clientEntry.startsWith('/'))
    return clientEntry
  }

  assertPosixPath(clientEntry)
  let filePath: string
  if (clientEntry.startsWith('/')) {
    // User files
    filePath = pathJoin(root, clientEntry)
  } else if (clientEntry.startsWith('@@vite-plugin-ssr/')) {
    // VPS client entry
    assert(clientEntry.endsWith('.js'))
    const createRequire = (await import_('module')).createRequire as typeof CreateRequire
    const req = createRequire(import.meta.url)
    // @ts-expect-error
    // Bun workaround https://github.com/brillout/vite-plugin-ssr/pull/1048
    const res = typeof Bun !== 'undefined' ? (toPath: string) => Bun.resolveSync(toPath, __dirname) : req.resolve
    try {
      // For Vitest (which doesn't resolve vite-plugin-ssr to its dist but to its source files)
      // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vite-plugin-ssr/node/runtime/renderPage/getPageAssets.mjs
      filePath = toPosixPath(
        res(clientEntry.replace('@@vite-plugin-ssr/dist/client/', '../../../client/').replace('.mjs', '.mts'))
      )
    } catch {
      // For users
      // [RELATIVE_PATH_FROM_DIST] Current file: node_modules/vite-plugin-ssr/dist/node/runtime/renderPage/getPageAssets.mjs
      filePath = toPosixPath(res(clientEntry.replace('@@vite-plugin-ssr/dist/client/', '../../../../dist/client/')))
    }
  } else if (isNpmPackageImport(clientEntry)) {
    const extensionPageFile = configVps.extensions
      .map(({ pageConfigsDistFiles }) => pageConfigsDistFiles)
      .flat()
      .filter(isNotNullish)
      .find((e) => e.importPath === clientEntry)
    assert(extensionPageFile, clientEntry)
    filePath = extensionPageFile.filePath
  } else {
    assert(false)
  }

  if (!filePath.startsWith('/')) {
    assert(process.platform === 'win32')
    filePath = '/' + filePath
  }

  filePath = '/@fs' + filePath
  assertPosixPath(filePath)

  return filePath
}
function resolveClientEntriesProd(
  clientEntry: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): string {
  const { manifestEntry } = getManifestEntry(clientEntry, clientManifest, manifestKeyMap)
  assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry || clientEntry.endsWith('.css'), { clientEntry })
  let { file } = manifestEntry
  assert(!file.startsWith('/'))
  return '/' + file
}
