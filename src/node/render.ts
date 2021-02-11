import { assert } from './utils/assert'
import { route } from './route.shared'
import {
  Html,
  Url,
  PageId,
  PageView,
  PageServerConfig,
  FilePathFromRoot
} from './types'
import { findUserFilePath, loadUserFile } from './findUserFiles'
import { renderHtmlTemplate } from './renderHtml'
import { getGlobal } from './global'
import { relative as pathRelative } from 'path'

export { PageConfig, addWindowType } from './types'
export { render }

async function render(url: Url): Promise<Html | null> {
  const pageId = await route(url)
  if (!pageId) {
    return null
  }
  const html = await renderPageToHtml(pageId, url)
  return html
}

async function renderPageToHtml(pageId: PageId, url: Url): Promise<Html> {
  const pageView: PageView = await loadUserFile('.page', { pageId })
  let htmlTemplate: Html =
    (await loadUserFile('.html', { pageId })) ||
    (await loadUserFile('.html', { defaultFile: true }))
  assert(htmlTemplate)
  const pageServerConfig: PageServerConfig =
    (await loadUserFile('.server', { pageId })) ||
    (await loadUserFile('.server', { defaultFile: true }))
  assert(pageServerConfig.render)

  const pageViewHtml: Html = await pageServerConfig.render({ pageView })

  htmlTemplate = await applyViteHtmlTransform(htmlTemplate, url)

  const initialProps = {}
  const scriptUrl = await getBrowserEntry(pageId)
  const html = renderHtmlTemplate({
    htmlTemplate,
    pageViewHtml,
    scripts: [{ scriptUrl }],
    initialProps
  })

  return html
}

async function getBrowserEntry(pageId: PageId): Promise<string> {
  let browserEntry: FilePathFromRoot | null =
    (await findUserFilePath('.browser', { pageId })) ||
    (await findUserFilePath('.browser', { defaultFile: true }))
  assert(browserEntry)
  browserEntry = await pathRelativeToRoot(browserEntry)
  return browserEntry
}

var viteManifest: Record<string, { file: string; isEntry?: true }>
async function pathRelativeToRoot(filePath: FilePathFromRoot): Promise<string> {
  assert(filePath.startsWith('/'))
  const { root, isProduction } = getGlobal()

  if (!isProduction) {
    return filePath
  } else {
    viteManifest = viteManifest || require(`${root}/dist/client/manifest.json`)
    const manifestKey = filePath.slice(1)
    const manifestVal = viteManifest[manifestKey]
    assert(manifestVal)
    assert(manifestVal.isEntry)
    const { file } = manifestVal
    assert(!file.startsWith('/'))
    return '/' + file
  }
}

async function applyViteHtmlTransform(html: Html, url: Url): Promise<Html> {
  const { viteDevServer, isProduction } = getGlobal()
  if (isProduction) {
    return html
  }
  html = await viteDevServer.transformIndexHtml(url, html)
  return html
}
