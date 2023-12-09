export { startDevServer }

import { resolveConfig } from 'vite'

async function startDevServer() {
  const config = resolveConfig(
    {
      //   configFile: './vite.con'
    },
    'serve'
  )
}
