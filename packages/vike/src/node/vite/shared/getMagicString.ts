export { getMagicString }

import MagicString from 'magic-string'
import '../assertEnvVite.js'

// Used everywhere instead of `new MagicString()` for consistent source map generation
function getMagicString(code: string, id: string) {
  const magicString = new MagicString(code)

  const getMagicStringResult = () => {
    if (!magicString.hasChanged()) return undefined
    return {
      code: magicString.toString(),
      // magic-string@1's SourceMap.sourcesContent is typed as (string | null)[], whereas Rollup's
      // ExistingRawSourceMap expects string[]. We never pass `includeContent`, so sourcesContent is
      // always undefined at runtime and this cast is safe.
      map: magicString.generateMap({ hires: true, source: id }) as any,
    }
  }

  return { magicString, getMagicStringResult }
}
