export { humanizeTime }

function humanizeTime(milliseconds: number): string {
  const seconds = milliseconds / 1000
  if (seconds < 120) {
    const n = round(seconds)
    return `${n} second${plural(n)}`
  }
  {
    const minutes = seconds / 60
    const n = round(minutes)
    return `${n} minute${plural(n)}`
  }
}

function round(n: number): string {
  let rounded = n.toFixed(1)
  if (rounded.endsWith('.0')) rounded = rounded.slice(0, -2)
  return rounded
}

function plural(n: string): string {
  return n === '1' ? '' : 's'
}
