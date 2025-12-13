export { getFileSuffixes }

const suffixesAssertEnv = [
  // .server.js
  'server',
  // .client.js
  'client',
  // .ssr.js
  'ssr',
] as const
const suffixes = [
  ...suffixesAssertEnv,
  // .shared.js
  'shared',
  // .clear.js
  'clear',
  // .default.js
  'default',
] as const
type Suffix = (typeof suffixes)[number]

function getFileSuffixes(fileName: string): Suffix[] {
  return suffixes.filter((suffix) => fileName.includes(`.${suffix}.`))
}
