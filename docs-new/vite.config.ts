import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import { assert, parseTitleMdx, getHeadingId } from './utils'
import { parse as parseHtml } from 'node-html-parser';

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
      const headings: { level: number; title: string, id: string, titleAddendum?: string }[] = []
      let codeNew = code.split('\n').map((line) => {
        if (line.startsWith('#')) {
          const [word, ...titleWords] = line.split(' ')
          assert(word.split('#').join('') === '')
          const level = word.length
          let title = titleWords.join(' ')
          assert(title)
          const id = getHeadingId({title})
          title = parseTitleMdx(title)
          assert(id)
          headings.push({ level, title, id })
          const lineProcessed = `<h${level} id=${JSON.stringify(id)}>${title}</h${level}>`
          return lineProcessed
        }
        if( line.startsWith('<h') ) {
          const htmlNode = parseHtml(line).querySelector('h1, h2, h3, h4, h5, h6')
          const { rawTagName, textContent } = htmlNode
          assert(['h1', 'h2', 'h3', 'h4', 'h5', 'h5'].includes(rawTagName))
          assert(textContent)
          const title = textContent
          const level = parseInt(rawTagName.slice(1), 10)
          const id = getHeadingId({title})
          assert(id)
          const titleAddendum = htmlNode.getAttribute('title-addendum')
          assert(titleAddendum===undefined || typeof titleAddendum === 'string')
          htmlNode.setAttribute('id', id)
          const lineProcessed = htmlNode.toString()
          headings.push({ level, title, id, titleAddendum })
          // console.log(line, lineProcessed)
          return lineProcessed
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
