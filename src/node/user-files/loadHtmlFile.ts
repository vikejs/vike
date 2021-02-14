import { readFileSync } from 'fs'
import { getGlobal } from '../global'
import { join as pathJoin } from 'path'
import { findUserFiles, findFile } from '../findUserFiles'

export { loadHtmlFile }

type PageId = string
type Filter = { pageId: PageId } | { defaultFile: true }

async function loadHtmlFile(filter: Filter) {
  const files = await findUserFiles('.html')

  const file = findFile(files, filter)
  if (file === null) {
    return null
  }

  let { filePath } = file

  const { root } = getGlobal()
  filePath = pathJoin(root, filePath)

  const html = readFileSync(filePath, 'utf8')
  return html
}
