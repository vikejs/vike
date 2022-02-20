import { getSsrEnv } from '../ssrEnv'
import { toPosixPath } from '../utils'

export { getRoot }
//
// TODO move normalized `root` to `pageContext`
function getRoot(): string {
  let { root } = getSsrEnv()
  root = root || process.cwd()
  root = toPosixPath(root)
  return root
}
