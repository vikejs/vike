export default onPrerender

import { names } from './names'

function onPrerender(): string[] {
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
