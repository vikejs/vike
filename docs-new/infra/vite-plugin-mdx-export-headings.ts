import { assert, parseTitleMdx, getHeadingId } from '../utils'
import { parse as parseHtml } from 'node-html-parser'

export { mdxExportHeadings }

function mdxExportHeadings() {
  return {
    name: 'vite-plugin-mdx-export-headings',
    transform: async (code: string, id: string) => {
      if (!id.endsWith('/Docs.mdx')) {
        return
      }
      const headings: { level: number; title: string; id: string; titleAddendum?: string }[] = []
      let isCodeBlock = false
      let codeNew = code
        .split('\n')
        .map((line) => {
          // Skip code blocks, e.g.
          // ~~~md
          // # Markdown Example
          // Bla
          // ~~~
          if (line.startsWith('~~~') || line.startsWith('```')) {
            isCodeBlock = !isCodeBlock
            return line
          }
          if (isCodeBlock) {
            return line
          }

          if (line.startsWith('#')) {
            const [word, ...titleWords] = line.split(' ')
            assert(word.split('#').join('') === '')
            const level = word.length
            let title = titleWords.join(' ')
            assert(title)
            const id = getHeadingId({ title })
            title = parseTitleMdx(title)
            assert(id)
            headings.push({ level, title, id })
            const lineProcessed = `<h${level} id=${JSON.stringify(id)}>${title}</h${level}>`
            return lineProcessed
          }
          if (line.startsWith('<h')) {
            const htmlNode = parseHtml(line).querySelector('h1, h2, h3, h4, h5, h6')
            const { rawTagName, textContent } = htmlNode
            assert(['h1', 'h2', 'h3', 'h4', 'h5', 'h5'].includes(rawTagName))
            assert(textContent)
            const title = textContent
            const level = parseInt(rawTagName.slice(1), 10)
            const id = getHeadingId({ title })
            assert(id)
            const titleAddendum = htmlNode.getAttribute('title-addendum')
            assert(titleAddendum === undefined || typeof titleAddendum === 'string')
            htmlNode.setAttribute('id', id)
            const lineProcessed = htmlNode.toString()
            headings.push({ level, title, id, titleAddendum })
            // console.log(line, lineProcessed)
            return lineProcessed
          }

          return line
        })
        .join('\n')
      const headingsExportCode = `export const headings = [${headings
        // .map(({ level, title }) => `{ title: ${JSON.stringify(title)}, id: ${JSON.stringify(id)}, level: ${level} }`)
        .map((heading) => JSON.stringify(heading))
        .join(', ')}];`
      codeNew += `\n\n${headingsExportCode}\n`
      //console.log(codeNew)
      return codeNew
    }
  }
}
