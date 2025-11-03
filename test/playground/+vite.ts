import mdx from '@mdx-js/rollup'
import { getVikeConfig } from 'vike/plugin'
import type { Config } from 'vike/types'
import type { UserConfig } from 'vite'

export default (() => {
  // @ts-ignore
  const vike = getVikeConfig()
  return {
    // TEST: use +vite to add Vite plugin
    plugins: [mdx()],
  } satisfies UserConfig
}) satisfies Config['vite']
