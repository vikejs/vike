import { getSsrEnv } from '../ssrEnv'
import { toPosixPath } from '../utils'
import { hasProp } from '../../utils/hasProp'

export { getRoot }

// TODO move normalized `root` to `pageContext`
function getRoot(): string | null {
  let { root } = getSsrEnv()
  if (root) {
    root = toPosixPath(root)
    return root
  }
  if (typeof process == 'undefined' || !hasProp(process, 'cwd')) {
    return null
  }
  root = process.cwd()
  root = toPosixPath(root)
  return root
}
