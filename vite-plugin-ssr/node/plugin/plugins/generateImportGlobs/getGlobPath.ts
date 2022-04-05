import { assertPosixPath, toPosixPath } from '../../utils'
import path from 'path'

export { getGlobPath }

function getGlobPath(
  globRoot: string,
  fileSuffix: 'page' | 'page.client' | 'page.server' | 'page.route',
  root?: string,
): string {
  // Vite uses `fast-glob` which resolves globs with micromatch: https://github.com/micromatch/micromatch
  // Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs
  const fileExtention = '*([a-zA-Z0-9])'
  assertPosixPath(globRoot)
  let globPath = [...globRoot.split('/'), '**', `*.${fileSuffix}.${fileExtention}`].filter(Boolean).join('/')
  if (root) {
    globPath = toPosixPath(path.posix.join(root, globPath))
  } else {
    globPath = '/' + globPath
  }
  return globPath
}
