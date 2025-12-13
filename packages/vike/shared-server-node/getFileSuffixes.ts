export { getFileSuffixes }

const suffixesAssertEnv = [
  // .ssr.js
  'ssr',
  // .server.js
  'server',
  // .client.js
  'client',
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
