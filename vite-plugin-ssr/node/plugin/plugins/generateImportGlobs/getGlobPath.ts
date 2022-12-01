export { getGlobPath }

import { assertPosixPath, scriptFileExtensions } from '../../utils'

function getGlobPath(globRoot: string, fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route'): string {
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*.${fileSuffix}.${scriptFileExtensions}`].filter(Boolean).join('/')
  globPath = '/' + globPath
  return globPath
}
