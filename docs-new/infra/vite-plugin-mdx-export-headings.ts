import { assert } from '../utils'
import { parse as parseHtml } from 'node-html-parser'

export { mdxExportHeadings }

function mdxExportHeadings() {
  return {
    name: 'vite-plugin-mdx-export-headings',
    transform: async (code: string, id: string) => {
      if (!id.endsWith('/Docs.mdx')) {
        return
      }
      const codeNew = transformDocsMdx(code)
      return codeNew
    }
  }
}

function transformDocsMdx(code: string) {
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
        const { lineProcessed, heading } = parseMarkdownHeading(line)
        headings.push(heading)
        return lineProcessed
      }
      if (line.startsWith('<h')) {
        const { lineProcessed, heading } = parseJsxHeading(line)
        headings.push(heading)
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
  return codeNew
}

function parseMarkdownHeading(
  line: string
): { lineProcessed: string; heading: { title: string; id: string; level: number } } {
  const [lineBegin, ...lineWords] = line.split(' ')
  assert(lineBegin.split('#').join('') === '', { line, lineWords })
  const level = lineBegin.length

  const titleMdx = lineWords.join(' ')
  assert(!titleMdx.startsWith(' '), { line, lineWords })
  assert(titleMdx)

  const id = computeHeaderId(titleMdx)
  const titleHtml = transformMarkdownTitleToHtml(titleMdx)
  assert(id)

  const heading = { level, title: titleHtml, id }

  const titleJsx = transformMarkdownTitleToHtml(titleMdx, true)
  const lineProcessed = `<h${level} id=${JSON.stringify(id)}>${titleJsx}</h${level}>`

  // console.log(titleMdx, titleHtml, titleJsx)

  return { lineProcessed, heading }
}

function parseJsxHeading(line: string) {
  const htmlNode = parseHtml(line).querySelector('h1, h2, h3, h4, h5, h6')
  const { rawTagName, textContent, innerHTML } = htmlNode
  assert(['h1', 'h2', 'h3', 'h4', 'h5', 'h5'].includes(rawTagName))
  const title = innerHTML
  const level = parseInt(rawTagName.slice(1), 10)
  const id = computeHeaderId(textContent)
  assert(id)
  const titleAddendum = htmlNode.getAttribute('title-addendum')
  assert(titleAddendum === undefined || typeof titleAddendum === 'string')
  htmlNode.setAttribute('id', id)
  const lineProcessed = htmlNode.toString()

  const heading = { level, title, id, titleAddendum }
  return { lineProcessed, heading }
}

function computeHeaderId(title: string): string {
  return title
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .join('-')
}

function transformMarkdownTitleToHtml(title: string, jsx?: true) {
  const parts = title.split('`')
  const transformer = jsx ? escapeTitlePart : escapeHtml
  return parts
    .map((part, idx) => {
      if (idx === parts.length - 1) {
        return transformer(part)
      }
      if (isEven(idx)) {
        return transformer(part) + '<code>'
      } else {
        return transformer(part) + '</code>'
      }
    })
    .join('')
}
function escapeTitlePart(part: string) {
  return '{'+JSON.stringify(part)+'}'
}
function escapeHtml(unsafeString: string): string {
  // Source: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/6234804#6234804
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}
function isEven(i: number) {
  return i % 2 === 0
}
