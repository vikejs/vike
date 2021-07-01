import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import { mdxExportHeadings } from './infra/vite-plugin-mdx-export-headings'
import low from 'lowlight'
// import {lowlight} from 'lowlight'
import { hljsDefineVue } from './infra/highlightjs-vue'

low.registerLanguage('vue', hljsDefineVue)

const remarkPlugins = [/*require('remark-highlight.js')*/]

const config: UserConfig = {
  plugins: [reactRefresh(), mdxExportHeadings(), mdx({ remarkPlugins }), ssr()],
  optimizeDeps: { include: ['@mdx-js/react'] },
  clearScreen: false
}

export default config
