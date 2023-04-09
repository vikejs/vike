export { pathJoin }

import { assert } from './assert'

function pathJoin(path1: string, path2: string): string {
  assert(!path1.includes('\\'))
  assert(!path2.includes('\\'))
  let joined = [...path1.split('/'), ...path2.split('/')].filter(Boolean).join('/')
  if (path1.startsWith('/')) joined = '/' + joined
  return joined
}
