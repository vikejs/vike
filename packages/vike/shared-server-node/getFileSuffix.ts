export { getFileSuffix }

const suffixes = ['ssr', 'server', 'client'] as const
type Suffix = (typeof suffixes)[number]

function getFileSuffix(file: string): Suffix {
  return suffixes.map((suffix) => {
    // TODO/ai
  })
}
