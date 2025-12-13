export { getFileSuffix }

const suffixes = ['ssr', 'server', 'client', 'shared'] as const
type Suffix = (typeof suffixes)[number]

function getFileSuffix(fileName: string): Suffix[] {
  const found: Suffix[] = []
  for (const suffix of suffixes) {
    if (fileName.includes(`.${suffix}.`)) {
      found.push(suffix)
    }
  }
  return found
}
