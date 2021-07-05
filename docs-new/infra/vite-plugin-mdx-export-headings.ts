import { assert, determineSectionUrlHash } from '../utils'

export { HeadingExtracted }
export { mdxExportHeadings }

type HeadingExtracted = {
  title: string,
  id: string,
  headingLevel: number,
  titleAddendum?: string
}

function mdxExportHeadings() {
  return {
    name: 'vite-plugin-mdx-export-headings',
    transform: async (code: string, id: string) => {
      if (!id.endsWith('.mdx')) {
        return
      }
      const codeNew = transformDocsMdx(code)
      return codeNew
    }
  }
}

function transformDocsMdx(code: string) {
  const headings: HeadingExtracted[] = []
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
        const heading = parseMarkdownHeading(line)
        headings.push(heading)
      }
      if (line.startsWith('<h')) {
        assert(false)
      }

      return line
    })
    .join('\n')
  const headingsExportCode = `export const headings = [${headings
    .map((heading) => JSON.stringify(heading))
    .join(', ')}];`
  codeNew += `\n\n${headingsExportCode}\n`
  return codeNew
}

function parseMarkdownHeading(
  line: string
): HeadingExtracted {
  const [lineBegin, ...lineWords] = line.split(' ')
  assert(lineBegin.split('#').join('') === '', { line, lineWords })
  const headingLevel = lineBegin.length

  const titleMdx = lineWords.join(' ')
  assert(!titleMdx.startsWith(' '), { line, lineWords })
  assert(titleMdx)

  const id = determineSectionUrlHash(titleMdx)
  const title = titleMdx
  const heading = { headingLevel, title, id }
  return heading
}
