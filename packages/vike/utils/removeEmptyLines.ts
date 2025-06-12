export function removeEmptyLines(msg: string): string {
  return msg
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n')
}
