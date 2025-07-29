export { getMagicString }

import MagicString from 'magic-string'

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
