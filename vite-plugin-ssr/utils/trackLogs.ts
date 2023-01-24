trackLogs()

// https://stackoverflow.com/questions/45395369/how-to-get-console-log-line-numbers-shown-in-nodejs/75109905#75109905
function trackLogs() {
  const logOriginal = process.stdout.write
  // @ts-ignore
  const log = (msg) => logOriginal.call(process.stdout, msg + '\n')
  ;['stdout', 'stderr'].forEach((stdName) => {
    // @ts-ignore
    var methodOriginal = process[stdName].write
    // @ts-ignore
    process[stdName].write = function (...args) {
      log('LOG:')
      // @ts-ignore
      methodOriginal.apply(process[stdName], args)
      // @ts-ignore
      log(new Error().stack.replace(/^Error/, 'LOGGED FROM:'))
    }
  })

  Error.stackTraceLimit = Infinity
}
