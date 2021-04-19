import { normalizeUrl } from '../utils/normalizeUrl';
import { isErrorPage } from './is-error-page';
import { PageId } from './types';
import { assertUsage, assert, slice } from '../utils';

function removeCommonPrefix(pageId: PageId, allPageIds: PageId[]) {
  const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
  const commonPrefix = getCommonPath(relevantPageIds)
  assert(pageId.startsWith(commonPrefix))
  return pageId.slice(commonPrefix.length)
}

function getCommonPath(pageIds: string[]): string {
  pageIds.forEach((pageId) => {
    assertUsage(
      !pageId.includes('\\'),
      'Your directory names and file names are not allowed to contain the character `\\`'
    )
  })
  const pageIdList = pageIds.concat().sort()
  const first = pageIdList[0]
  const last = pageIdList[pageIdList.length - 1]
  let idx = 0
  for (; idx < first.length; idx++) {
    if (first[idx] !== last[idx]) break
  }
  const commonPrefix = first.slice(0, idx)
  const pathsPart = commonPrefix.split('/')
  assert(pathsPart.length >= 2)
  const commonPath = slice(pathsPart, 0, -1).join('/') + '/'
  return commonPath
}

export function getFilesystemRoute(pageId: string, allPageIds: string[]): string {
  let pageRoute = removeCommonPrefix(pageId, allPageIds)
  pageRoute = pageRoute
    .split('/')
    .filter((part) => part !== 'index')
    .join('/')
  pageRoute = normalizeUrl(pageRoute)
  return pageRoute
}