export { setNodeEnvToProduction }

function setNodeEnvToProduction() {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4
  const proc = process
  const { env } = proc
  env['NODE_ENV'] = 'production'
}
