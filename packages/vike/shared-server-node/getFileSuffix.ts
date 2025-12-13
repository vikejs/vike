export { getFileSuffix }

const suffixes = [
  // .ssr.js
  'ssr',
  // .server.js
  'server',
  // .client.js
  'client',
  // .shared.js
  'shared',
  // .clear.js
  'clear',
  // .default.js
  'default',
] as const
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
