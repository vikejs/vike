export { getFileSuffix }

const suffixes = ['ssr', 'server', 'client', 'shared'] as const
type Suffix = (typeof suffixes)[number]

// TODO/ai return array
function getFileSuffix(fileName: string): Suffix | null {
  for (const suffix of suffixes) {
    if (fileName.includes(`.${suffix}.`)) {
      return suffix
    }
  }
  return null
}
