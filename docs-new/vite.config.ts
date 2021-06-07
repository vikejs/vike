import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import { assert } from './utils'

const remarkPlugins = [require('remark-highlight.js')]

const config: UserConfig = {
  plugins: [reactRefresh(), exportHeadings(), mdx({ remarkPlugins }), ssr()],
  optimizeDeps: { include: ['@mdx-js/react'] },
  clearScreen: false
}

export default config

function exportHeadings() {
  return {
    name: 'exportHeadings',
    transform: async (code: string, id: string) => {
      if (!id.endsWith('.mdx')) {
        return
      }
      const headings: { level: number; title: string }[] = []
      code.split('\n').forEach((line) => {
        if (!line.startsWith('#')) {
          return
        }
        const [word, ...titleWords] = line.split(' ')
        assert(word.split('#').join('') === '')
        const level = word.length
        const title = titleWords.join(' ')
        assert(title)
        headings.push({ level, title })
      })
      const headingsExportCode = `export const headings = [${headings
        .map(({ level, title }) => `{ title: ${JSON.stringify(title)}, level: ${level} }`)
        .join(', ')}];`
      code += `\n\n${headingsExportCode}\n`
      return code
    }
  }
}
