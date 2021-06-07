import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import ssr from 'vite-plugin-ssr/plugin'
import mdxParser from '@mdx-js/mdx'
import { UserConfig } from 'vite'
import unified from 'unified'
import parse from 'remark-parse'
import { assert } from './utils'

const remarkPlugins = [require('remark-highlight.js'), () => headerExporter]

const config: UserConfig = {
  plugins: [reactRefresh(), mdxHeaderExporter(), mdx({ remarkPlugins }), ssr()],
  optimizeDeps: { include: ['@mdx-js/react'] },
  clearScreen: false
}

export default config

function headerExporter(tree: any) {
  /*
  console.log('tt', tree)
  tree.children.push({
  type: 'export',
  value: `export const abc = 123`,
  })
  */
}

function mdxHeaderExporter() {
  return {
    name: 'mdxHeaderExporter',
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
      console.log('cc', code)
      return code
      /*
      const nodeRoot = unified().use(parse).parse(code)
      const sections = []
      const traverse = (node: any) => {
        if( !node ) return;
        if (node.type === 'heading') {
          const level = node.depth
          console.log(node.children)
          assert(node.children.length===1)
          const nodeText = node.children[0]
          assert(nodeText.type==='text')
          const title = nodeText.value
          sections.push({level, title})
          return;
        }
        if( node.children ) {
          node.children.forEach(traverse)
        }
      }
      console.log(1)
      traverse(nodeRoot)
      console.log(3)
      console.log('bef')
        //await new Promise(r => setTimeout(r, 1000))
      console.log('aft')
      //console.log(code);
        return
      try {
      const code_jsx = await mdxParser(code)
      console.log(code_jsx);
      } catch(err) {
      }
      return;
      */
    }
  }
}
