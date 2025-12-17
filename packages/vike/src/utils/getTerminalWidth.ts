export function getTerminalWidth(): number | undefined {
  // https://stackoverflow.com/questions/30335637/get-width-of-terminal-in-node-js/30335724#30335724
  return (
    (typeof process !== 'undefined' && typeof process.stdout !== 'undefined' && process.stdout.columns) || undefined
  )
}
