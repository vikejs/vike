export const errMdx1 = {
  name: '5:5-5:6',
  message: 'Unexpected closing slash `/` in tag, expected an open tag first',
  reason: 'Unexpected closing slash `/` in tag, expected an open tag first',
  line: 5,
  column: 5,
  position: {
    start: { line: 5, column: 5, offset: 109, _index: 6, _bufferIndex: 4 },
    end: { line: 5, column: 6, offset: 110, _index: 6, _bufferIndex: 5 },
  },
  source: 'mdast-util-mdx-jsx',
  ruleId: 'unexpected-closing-slash',
  plugin: '@mdx-js/rollup',
  id: '/home/rom/code/vike/docs/pages/dynamic-import.page.server.mdx',
  pluginCode:
    'import { Link, Note } from \'@brillout/docpress\'\n\nPage moved to <Link href="/ClientOnly" />.\n\n   </Note>\n\n\nexport const headings = [];\n',
  loc: {
    file: '/home/rom/code/vike/docs/pages/dynamic-import.page.server.mdx',
    start: { line: 5, column: 5, offset: 109, _index: 6, _bufferIndex: 4 },
    end: { line: 5, column: 6, offset: 110, _index: 6, _bufferIndex: 5 },
  },
  frame: '',
  stack: '',
}
