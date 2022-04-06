export { stringifyStringArray };
function stringifyStringArray(stringList) {
    return '[' + stringList.map((str) => "'" + str + "'").join(', ') + ']';
}
