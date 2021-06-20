import assert = require('assert')
import { slice } from './slice'

export { partRegex }

function partRegex(parts: TemplateStringsArray, ...variables: RegExp[]): RegExp {
  assert(parts.length === variables.length + 1)
  let str = ''
  for (let i = 0; i < variables.length; i++) {
    const variable = variables[i]
    assert(variable.constructor === RegExp)
    str += escapeRegex(parts[i]) + slice(variable.toString(), 1, -1)
  }
  str += escapeRegex(parts[parts.length - 1])
  return new RegExp(str)
}

function escapeRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
