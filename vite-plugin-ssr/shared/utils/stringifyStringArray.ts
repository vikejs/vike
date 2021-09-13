export { stringifyStringArray }

function stringifyStringArray(stringList: string[] | readonly string[]) {
  return '[' + stringList.map((str) => "'" + str + "'").join(', ') + ']'
}
