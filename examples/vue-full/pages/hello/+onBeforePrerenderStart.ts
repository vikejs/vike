// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart }

import { names } from './names'

const onBeforePrerenderStart = async () => {
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
