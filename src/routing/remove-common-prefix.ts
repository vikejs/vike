import { isErrorPage } from './is-error-page';
import { getCommonPath } from './get-common-path';
import { PageId } from './types';
import { assert } from '../utils';

export function removeCommonPrefix(pageId: PageId, allPageIds: PageId[]) {
  const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
  const commonPrefix = getCommonPath(relevantPageIds)
  assert(pageId.startsWith(commonPrefix))
  return pageId.slice(commonPrefix.length)
}