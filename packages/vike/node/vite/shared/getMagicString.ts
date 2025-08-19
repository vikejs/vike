export { getMagicString }

import MagicString from 'magic-string'

// Used everywhere instead of `new MagicString()` for consistent source map generation
function getMagicString(code: string, id: string) {
  const magicString = new MagicString(code)

  const getMagicStringResult = () => {
    return {
      code: magicString.toString(),
      map: magicString.generateMap({ hires: true, source: id }),
    }
  }

  return { magicString, getMagicStringResult }
}
