import preact from '@preact/preset-vite'
import ssr from 'vike/plugin'

const config = {
  plugins: [preact(), ssr()],
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks Vike's CI
  optimizeDeps: {
    include: ['preact', 'preact/devtools', 'preact/debug', 'preact/jsx-dev-runtime', 'preact/hooks']
  }
}

export default config
