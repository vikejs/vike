export { startDevServer }

import { resolveConfig } from 'vite'

async function startDevServer() {
  console.log('startDevServer called')

  const config = await resolveConfig({}, 'serve')

  //@ts-ignore
  const serverEntry = globalThis.__vike_serverEntry
  console.log(serverEntry)
}
