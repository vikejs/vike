const assert = require('assert')

module.exports.partRegex = partRegex

function partRegex(parts, ...variables) {
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

function escapeRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function slice(thing, from, to) {
  if (typeof thing === 'string') {
    return sliceArray(thing.split(''), from, to).join('')
  } else {
    return sliceArray(thing, from, to)
  }
}

function sliceArray(list, from, to) {
  const listSlice = []

  let begin = from >= 0 ? from : list.length + from
  assert(begin >= 0 && begin < list.length)
  const end = to >= 0 ? to : list.length + to
  assert(end >= 0 && end < list.length)

  while (begin !== end) {
    listSlice.push(list[begin])
    begin++
    if (begin === list.length) {
      begin = 0
    }
  }

  return listSlice
}
