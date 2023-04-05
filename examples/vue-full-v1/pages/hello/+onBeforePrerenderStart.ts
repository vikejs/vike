export default onBeforePrerenderStart

import { names } from './names'

function onBeforePrerenderStart(): string[] {
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
