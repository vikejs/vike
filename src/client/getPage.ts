import { findUserFiles } from '../node/findUserFiles'
import { route } from '../node/route.shared'
import { FilePath, PageId, PageView } from '../node/types'
import { assert, assertUsage } from '../node/utils/assert'

export { getPage }

async function getPage() {
  const url = window.location.pathname
  const pageId = await route(url)
  assert(pageId)
  const pageView = await findPageView(pageId)
  const page = {
    view: pageView,
    initialProps: {}
  }
  return page
}

// TODO dedupe
async function findPageView(pageId: PageId): Promise<PageView> {
  const files = await findUserFiles('.page')
  const file = findFile(files, { pageId })
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
        fileName.includes('/default.') || fileName.includes('default.')
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
