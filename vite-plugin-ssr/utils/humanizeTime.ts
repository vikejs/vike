export { humanizeTime }

function humanizeTime(milliseconds: number) {
  const seconds = milliseconds / 1000
  if (seconds < 120) {
    return `${round(seconds)} seconds`
  }
  const minutes = seconds / 60
  return `${round(minutes)} minutes`
}

function round(n: number): string {
  let rounded = n.toFixed(1)
  if (rounded.endsWith('.0')) rounded = rounded.slice(0, -2)
  return rounded
}
