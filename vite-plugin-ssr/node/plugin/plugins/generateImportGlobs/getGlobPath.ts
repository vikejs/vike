export { getGlobPath }

import { assertPosixPath, toPosixPath } from '../../utils'
import path from 'path'
import { pageFileExtensions } from './pageFileExtensions'

function getGlobPath(
  globRoot: string,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  root?: string,
): string {
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*.${fileSuffix}.${pageFileExtensions}`].filter(Boolean).join('/')
  if (root) {
    globPath = toPosixPath(path.posix.join(root, globPath))
  } else {
    globPath = '/' + globPath
  }
  return globPath
}
