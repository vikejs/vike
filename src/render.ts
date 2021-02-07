import { assert, assertUsage } from './utils/assert'
import { route } from './route.shared'
import { sep as pathSep } from 'path'
import {
  Html,
  Url,
  PageId,
  PageView,
  PageServerConfig,
  FilePath
} from './types'
import { findUserFiles } from './findUserFiles'
import { renderHtmlTemplate } from './renderHtml'

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
  const pageView = await findPageView(pageId)
  let htmlTemplate = await findHtmlTemplate(pageId)
  let pageServerConfig = await findPageServerConfig(pageId)

  htmlTemplate = htmlTemplate || (await findDefaultHtmlTemplate(pageId))
  pageServerConfig = pageServerConfig || (await findDefaultServerConfig(pageId))
  assert(htmlTemplate)
  assert(pageServerConfig.render)

  const pageViewHtml = await pageServerConfig.render({ pageView })

  htmlTemplate = await applyViteHtmlTransform(htmlTemplate, url)

  const scripts = []
  /*
  scripts.push({
    scriptContent: [
    '<script type="module">',
    `console.log(9);`,
    `import "/vite-plugin-ssr/browserTest.ts";`,
    '</script>'
  ].join('\n')
  });
  //*/
  scripts.push({
    scriptUrl: '/vite-plugin-ssr/browserTest'
  })
  const initialProps = {}
  const html = renderHtmlTemplate(
    htmlTemplate,
    pageViewHtml,
    scripts,
    initialProps
  )

  return html
}

async function applyViteHtmlTransform(html: Html, url: Url): Promise<Html> {
  // @ts-ignore
  const { viteServer } = global
  assert(viteServer)
  html = await viteServer.transformIndexHtml(url, html)
  return html
}

async function findPageView(pageId: PageId): Promise<PageView> {
  const files = await findUserFiles('.page')
  const file = findFile(files, { pageId })
  assert(file)
  const fileExports = await file()
  assertUsage(fileExports.default, pageId + ' should `export default`')
  return fileExports.default
}

async function findHtmlTemplate(pageId: PageId): Promise<Html | null> {
  const files = await findUserFiles('.html')
  const file = findFile(files, { pageId })
  if (!file) {
    return null
  }
  const fileExports = await file()
  assertUsage(fileExports.default, pageId + ' should `export default`')
  return fileExports.default
}
async function findDefaultHtmlTemplate(pageId: PageId): Promise<Html> {
  assert(pageId)
  const files = await findUserFiles('.html')
  const file = findFile(files, { defaultFile: true })
  assert(file)
  const fileExports = await file()
  assertUsage(fileExports.default, pageId + ' should `export default`')
  return fileExports.default
}

async function findPageServerConfig(
  pageId: PageId
): Promise<PageServerConfig | null> {
  const files = await findUserFiles('.server')
  const file = findFile(files, { pageId })
  if (!file) {
    return null
  }
  const fileExports = await file()
  assertUsage(fileExports.default, pageId + ' should `export default`')
  return fileExports.default
}
async function findDefaultServerConfig(
  pageId: PageId
): Promise<PageServerConfig> {
  assert(pageId)
  const files = await findUserFiles('.server')
  const file = findFile(files, { defaultFile: true })
  assert(file)
  const fileExports = await file()
  assertUsage(fileExports.default, pageId + ' should `export default`')
  return fileExports.default
}

function findFile<T>(
  files: Record<FilePath, T>,
  filter: { pageId: PageId } | { defaultFile: true }
): T | null {
  let fileNames = Object.keys(files) as FilePath[]
  if ('pageId' in filter) {
    fileNames = fileNames.filter((fileName) =>
      fileName.startsWith(filter.pageId)
    )
    assertUsage(fileNames.length <= 1, 'Conflicting ' + fileNames.join(' '))
  }
  if ('defaultFile' in filter) {
    assert(filter.defaultFile === true)
    fileNames = fileNames.filter(
      (fileName) =>
        fileName.includes('/default.') ||
        fileName.includes(pathSep + 'default.')
    )
    assertUsage(fileNames.length === 1, 'TODO')
  }
  if (fileNames.length === 0) {
    return null
  }
  assert(fileNames.length === 1)
  const fileName = fileNames[0]
  return files[fileName]
}
