import mdx from '@mdx-js/rollup'
import assert from 'node:assert'
import { getVikeConfig } from 'vike/plugin'
import type { Config } from 'vike/types'
import type { UserConfig } from 'vite'

console.log(1)

export default (() => {
  const vikeConfig = getVikeConfig()
  assert(vikeConfig.pages['/pages/markdown']!.route === '/markdown')
  return {
    // TEST: using +vite to add Vite plugin
    plugins: [mdx()],
  } satisfies UserConfig
}) satisfies Config['vite']
