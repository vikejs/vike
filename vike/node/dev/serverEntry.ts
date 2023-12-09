export { startDevServer }

import { resolveConfig } from 'vite'

async function startDevServer() {
  console.log('startDevServer called')

  const config = await resolveConfig({}, 'serve')

  console.log(config)
}
