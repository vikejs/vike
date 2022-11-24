export { setProduction }

function setProduction() {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4 (which Cloudflare Workers uses)
  const proc = process
  const { env } = proc
  env['NODE_ENV'] = 'production'
}
