export { getGlobPath }

import { assertPosixPath, toPosixPath, javascriptFileExtensions } from '../../utils'
import path from 'path'

function getGlobPath(
  globRoot: string,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  root?: string,
): string {
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*.${fileSuffix}.${javascriptFileExtensions}`].filter(Boolean).join('/')
  if (root) {
    globPath = toPosixPath(path.posix.join(root, globPath))
  } else {
    globPath = '/' + globPath
  }
  return globPath
}
