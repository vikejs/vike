import { getHintForCjsEsmError } from '../logHintForCjsEsmError'
import { expect, describe, it, assert } from 'vitest'
import { stripAnsi } from '../../utils'

describe('getHintForCjsEsmError()', () => {
  it('log fixtures', () => {
    expect(
      getLog({
        message:
          "Cannot find module 'node_modules/vike-react/dist/renderer/getPageElement' imported from node_modules/vike-react/dist/renderer/onRenderHtml.js",
        code: 'ERR_MODULE_NOT_FOUND'
      })
    ).toMatchInlineSnapshot(
      '"Error could be a CJS/ESM issue, consider adding vike-react to ssr.noExternal, see https://vike.dev/broken-npm-package"'
    )

    expect(
      getLog({
        message:
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."
      })
    ).toMatchInlineSnapshot('"To fix this error, see https://vike.dev/broken-npm-package#react-invalid-component"')
  })
})

function getLog(error: Parameters<typeof getHintForCjsEsmError>[0]): string {
  let log = getHintForCjsEsmError(error)
  expect(log).toBeTruthy()
  assert(log)
  log = stripAnsi(log)
  return log
}
