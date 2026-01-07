import '../../assertEnvClient.js'

export { removeBuiltInOverrides }

import { assert, assertWarning } from '../../../utils/assert.js'

const BUILT_IN_CLIENT_ROUTER = ['urlPathname', 'urlParsed'] as const
const BUILT_IN_CLIENT = ['Page', 'pageExports', 'exports'] as const
type DeletedKeys = (typeof BUILT_IN_CLIENT)[number] | (typeof BUILT_IN_CLIENT_ROUTER)[number]
function removeBuiltInOverrides(pageContext: Record<string, unknown> & { [key in DeletedKeys]?: never }) {
  const alreadySet = [...BUILT_IN_CLIENT, ...BUILT_IN_CLIENT_ROUTER]
  alreadySet.forEach((prop) => {
    if (prop in pageContext) {
      // We need to cast `BUILT_IN_CLIENT` to `string[]`
      //  - https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes
      //  - https://stackoverflow.com/questions/57646355/check-if-string-is-included-in-readonlyarray-in-typescript
      if ((BUILT_IN_CLIENT_ROUTER as any as string[]).includes(prop)) {
        assert(prop.startsWith('url'))
        assertWarning(
          false,
          `pageContext.${prop} is already available in the browser when using Client Routing; adding '${prop}' to passToClient has no effect`,
          { onlyOnce: true },
        )
      } else {
        assertWarning(
          false,
          `pageContext.${prop} is a built-in that cannot be overridden; adding '${prop}' to passToClient has no effect`,
          { onlyOnce: true },
        )
      }
      delete pageContext[prop]
    }
  })
}
