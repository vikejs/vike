import mdx from '@mdx-js/rollup'
import { getVikeConfig } from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  // TEST: use +vite to add Vite plugin
  plugins: [
    mdx(),
    (async () => {
      console.log('+vite plugin', new Error().stack)
      await sleep(1)
      // @ts-ignore
      const vike = getVikeConfig()
      console.log('vike', vike)
      console.log(2)
      return {
        name: 'bla',
      }
    })(),
  ],
} satisfies UserConfig

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
