export { unique }

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
