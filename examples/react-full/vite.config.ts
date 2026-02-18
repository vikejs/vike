import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

const vikePromise = (async () => {
  console.log('vikePromise init')
  const vikePlugin = await vike()
  console.log('vikePlugin', vikePlugin)
  return vikePlugin
})()

export default {
  plugins: [vikePromise, mdx(), react()],
} satisfies UserConfig
