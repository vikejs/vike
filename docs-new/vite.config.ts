import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import { assert, parseTitleMdx, getHeadingId } from './utils'

const remarkPlugins = [
  require('remark-highlight.js')
]

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
      const headings: { level: number; title: string, id: string }[] = []
      let codeNew = code.split('\n').map((line) => {
        if (line.startsWith('#')) {
          const [word, ...titleWords] = line.split(' ')
          assert(word.split('#').join('') === '')
          const level = word.length
          const title = titleWords.join(' ')
          assert(title)
          const id = getHeadingId({title})
          assert(id)
          headings.push({ level, title, id })
          return `<h${level} id=${JSON.stringify(id)}>${parseTitleMdx(title)}</h${level}>`
        }
        if( line.startsWith('<h') ) {
          ;
        }
        return line
      }).join('\n')
      const headingsExportCode = `export const headings = [${headings
        // .map(({ level, title }) => `{ title: ${JSON.stringify(title)}, id: ${JSON.stringify(id)}, level: ${level} }`)
        .map(heading => JSON.stringify(heading))
        .join(', ')}];`
      codeNew += `\n\n${headingsExportCode}\n`
      //console.log(codeNew)
      return codeNew
    }
  }
}
