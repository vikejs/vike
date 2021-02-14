import { readFileSync } from 'fs'
import { getGlobal } from '../global.node'
import { join as pathJoin } from 'path'
import { findUserFiles, findFile } from './findUserFiles.shared'

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
