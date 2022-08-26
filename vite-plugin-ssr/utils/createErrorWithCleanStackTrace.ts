export { createErrorWithCleanStackTrace }

function createErrorWithCleanStackTrace(errorMessage: string, numberOfStackTraceLinesToRemove: number) {
  let err
  {
    var stackTraceLimit__original = Error.stackTraceLimit
    Error.stackTraceLimit = Infinity
    err = new Error(errorMessage)
    Error.stackTraceLimit = stackTraceLimit__original
  }

  err.stack = clean(err.stack, numberOfStackTraceLinesToRemove)

  return err
}

function clean(errStack: string | undefined, numberOfStackTraceLinesToRemove: number): string | undefined {
  if (!errStack) {
    return errStack
  }

  const stackLines = splitByLine(errStack)

  let linesRemoved = 0

  const stackLine__cleaned = stackLines
    .filter((line) => {
      // Remove internal stack traces
      if (line.includes(' (internal/') || line.includes(' (node:internal')) {
        return false
      }
      if (linesRemoved < numberOfStackTraceLinesToRemove && isStackTraceLine(line)) {
        linesRemoved++
        return false
      }

      return true
    })
    .join('\n')

  return stackLine__cleaned
}

function isStackTraceLine(line: string): boolean {
  return line.startsWith('    at ')
}

function splitByLine(str: string): string[] {
  // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
  return str.split(/\r?\n/)
}
