import { expect, describe, it } from 'vitest'
import { stripAnsi } from '../../utils'
import { getPrettyErrMessage, getPrettyErrorWithCodeSnippet, isErrorWithCodeSnippet } from './errorWithCodeSnippet'

// To generate new test cases:
// ```bash
// DEBUG=vps:error pnpm run dev
// ```

describe('getPrettyErrorWithCodeSnippet()', () => {
  it('real use case - @vitejs/plugin-react-swc', () => {
    const err = {
      stack:
        "Error: \n  \u001b[38;2;255;30;30m×\u001b[0m Expected ';', '}' or <eof>\n   ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx\u001b[0m:1:1]\n \u001b[2m1\u001b[0m │ export default Page\n \u001b[2m2\u001b[0m │ \n \u001b[2m3\u001b[0m │ impeort React from 'react'\n   · \u001b[38;2;246;87;248m───┬───\u001b[0m\u001b[38;2;30;201;212m ─────\u001b[0m\n   ·    \u001b[38;2;246;87;248m╰── \u001b[38;2;246;87;248mThis is the expression part of an expression statement\u001b[0m\u001b[0m\n \u001b[2m4\u001b[0m │ \n \u001b[2m5\u001b[0m │ function Page({ name }: { name: string }) {\n \u001b[2m6\u001b[0m │   return (\n   ╰────\n\n\nCaused by:\n    Syntax Error",
      code: 'GenericFailure',
      line: '1',
      column: '1',
      plugin: 'vite:react-swc',
      id: '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx',
      pluginCode:
        'export default Page\n\nimpeort React from \'react\'\n\nfunction Page({ name }: { name: string }) {\n  return (\n    <>\n      <h1>Hello</h1>\n      <p>\n        Hi <b>{name}</b>.\n      </p>\n      <ul>\n        <li>\n          <a href="/hello/eli">/hello/eli</a>\n        </li>\n        <li>\n          <a href="/hello/jon">/hello/jon</a>\n        </li>\n      </ul>\n      <p>\n        Parameterized routes can be defined by exporting a route string in <code>*.page.route.js</code>.\n      </p>\n    </>\n  )\n}\n',
      loc: {
        file: '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx',
        line: '1',
        column: '1'
      },
      frame: '1  |  /home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx\n   |   ^',
      message:
        "\n  \u001b[38;2;255;30;30m×\u001b[0m Expected ';', '}' or <eof>\n   ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx\u001b[0m:1:1]\n \u001b[2m1\u001b[0m │ export default Page\n \u001b[2m2\u001b[0m │ \n \u001b[2m3\u001b[0m │ impeort React from 'react'\n   · \u001b[38;2;246;87;248m───┬───\u001b[0m\u001b[38;2;30;201;212m ─────\u001b[0m\n   ·    \u001b[38;2;246;87;248m╰── \u001b[38;2;246;87;248mThis is the expression part of an expression statement\u001b[0m\u001b[0m\n \u001b[2m4\u001b[0m │ \n \u001b[2m5\u001b[0m │ function Page({ name }: { name: string }) {\n \u001b[2m6\u001b[0m │   return (\n   ╰────\n\n\nCaused by:\n    Syntax Error"
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full-v1')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /pages/hello/+Page.tsx because:
      × Expected ';', '}' or <eof>
         ╭─[/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx:1:1]
       1 │ export default Page
       2 │ 
       3 │ impeort React from 'react'
         · ───┬─── ─────
         ·    ╰── This is the expression part of an expression statement
       4 │ 
       5 │ function Page({ name }: { name: string }) {
       6 │   return (
         ╰────
      Caused by:
          Syntax Error"
    `)
  })

  it('real use case - @vitejs/plugin-react-swc - big JSX error', () => {
    const err = {
      code: 'GenericFailure',
      line: '6',
      column: '1',
      plugin: 'vite:react-swc',
      id: '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx',
      pluginCode:
        "export default Page\n\nimport React from 'react'\nimport { navigate } from 'vite-plugin-ssr/client/router'\nimport { Counter } from '../../components/Counter'\n\nfunction Page() {\n  return (\n    <>\n      <h1>\n        Welcome to <code>vite-plugin-ssr</code>\n      <h1>\n      This page is:\n      <ul>\n        <li>Rendered to HTML.</li>\n        <li>\n          Interactive. <Counter />\n        </li>\n      </ul>\n      <p>\n        <button\n          onClick={() => {\n            const randomIndex = Math.floor(Math.random() * 3)\n            navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])\n          }}\n        >\n          Random Page\n        </button>\n      </p>\n    </>\n  )\n}\n",
      loc: {
        file: '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx',
        line: '6',
        column: '1'
      },
      frame: '',
      message:
        "\n  \u001b[38;2;255;30;30m×\u001b[0m Expression expected\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:6:1]\n \u001b[2m 6\u001b[0m │ \n \u001b[2m 7\u001b[0m │ function Page() {\n \u001b[2m 8\u001b[0m │   return (\n \u001b[2m 9\u001b[0m │     <>\n    · \u001b[38;2;246;87;248m     ─\u001b[0m\n \u001b[2m10\u001b[0m │       <h1>\n \u001b[2m11\u001b[0m │         Welcome to <code>vite-plugin-ssr</code>\n \u001b[2m12\u001b[0m │       <h1>\n    ╰────\n\n  \u001b[38;2;255;30;30m×\u001b[0m Unexpected token. Did you mean `{'}'}` or `&rbrace;`?\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:29:1]\n \u001b[2m29\u001b[0m │       </p>\n \u001b[2m30\u001b[0m │     </>\n \u001b[2m31\u001b[0m │   )\n \u001b[2m32\u001b[0m │ }\n    · \u001b[38;2;246;87;248m▲\u001b[0m\n    ╰────\n\n  \u001b[38;2;255;30;30m×\u001b[0m Unterminated JSX contents\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:27:1]\n \u001b[2m27\u001b[0m │               Random Page\n \u001b[2m28\u001b[0m │             </button>\n \u001b[2m29\u001b[0m │           </p>\n \u001b[2m30\u001b[0m │ \u001b[38;2;246;87;248m╭\u001b[0m\u001b[38;2;246;87;248m─\u001b[0m\u001b[38;2;246;87;248m▶\u001b[0m     </>\n \u001b[2m31\u001b[0m │ \u001b[38;2;246;87;248m│\u001b[0m     )\n \u001b[2m32\u001b[0m │ \u001b[38;2;246;87;248m╰\u001b[0m\u001b[38;2;246;87;248m─\u001b[0m\u001b[38;2;246;87;248m▶\u001b[0m }\n    ╰────\n\n\nCaused by:\n    Syntax Error",
      stack:
        "Error: \n  \u001b[38;2;255;30;30m×\u001b[0m Expression expected\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:6:1]\n \u001b[2m 6\u001b[0m │ \n \u001b[2m 7\u001b[0m │ function Page() {\n \u001b[2m 8\u001b[0m │   return (\n \u001b[2m 9\u001b[0m │     <>\n    · \u001b[38;2;246;87;248m     ─\u001b[0m\n \u001b[2m10\u001b[0m │       <h1>\n \u001b[2m11\u001b[0m │         Welcome to <code>vite-plugin-ssr</code>\n \u001b[2m12\u001b[0m │       <h1>\n    ╰────\n\n  \u001b[38;2;255;30;30m×\u001b[0m Unexpected token. Did you mean `{'}'}` or `&rbrace;`?\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:29:1]\n \u001b[2m29\u001b[0m │       </p>\n \u001b[2m30\u001b[0m │     </>\n \u001b[2m31\u001b[0m │   )\n \u001b[2m32\u001b[0m │ }\n    · \u001b[38;2;246;87;248m▲\u001b[0m\n    ╰────\n\n  \u001b[38;2;255;30;30m×\u001b[0m Unterminated JSX contents\n    ╭─[\u001b[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx\u001b[0m:27:1]\n \u001b[2m27\u001b[0m │               Random Page\n \u001b[2m28\u001b[0m │             </button>\n \u001b[2m29\u001b[0m │           </p>\n \u001b[2m30\u001b[0m │ \u001b[38;2;246;87;248m╭\u001b[0m\u001b[38;2;246;87;248m─\u001b[0m\u001b[38;2;246;87;248m▶\u001b[0m     </>\n \u001b[2m31\u001b[0m │ \u001b[38;2;246;87;248m│\u001b[0m     )\n \u001b[2m32\u001b[0m │ \u001b[38;2;246;87;248m╰\u001b[0m\u001b[38;2;246;87;248m─\u001b[0m\u001b[38;2;246;87;248m▶\u001b[0m }\n    ╰────\n\n\nCaused by:\n    Syntax Error"
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full-v1')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /pages/index/+Page.tsx because:
      × Expression expected
          ╭─[/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx:6:1]
        6 │ 
        7 │ function Page() {
        8 │   return (
        9 │     <>
          ·      ─
       10 │       <h1>
       11 │         Welcome to <code>vite-plugin-ssr</code>
       12 │       <h1>
          ╰────
        × Unexpected token. Did you mean \`{'}'}\` or \`&rbrace;\`?
          ╭─[/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx:29:1]
       29 │       </p>
       30 │     </>
       31 │   )
       32 │ }
          · ▲
          ╰────
        × Unterminated JSX contents
          ╭─[/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/index/+Page.tsx:27:1]
       27 │               Random Page
       28 │             </button>
       29 │           </p>
       30 │ ╭─▶     </>
       31 │ │     )
       32 │ ╰─▶ }
          ╰────
      Caused by:
          Syntax Error"
    `)
  })

  it('real use case - @mdx-js/rollup', () => {
    const err = {
      name: '5:5-5:6',
      message: 'Unexpected closing slash `/` in tag, expected an open tag first',
      reason: 'Unexpected closing slash `/` in tag, expected an open tag first',
      line: 5,
      column: 5,
      position: {
        start: { line: 5, column: 5, offset: 109, _index: 6, _bufferIndex: 4 },
        end: { line: 5, column: 6, offset: 110, _index: 6, _bufferIndex: 5 }
      },
      source: 'mdast-util-mdx-jsx',
      ruleId: 'unexpected-closing-slash',
      plugin: '@mdx-js/rollup',
      id: '/home/rom/code/vite-plugin-ssr/docs/pages/dynamic-import.page.server.mdx',
      pluginCode:
        'import { Link, Note } from \'@brillout/docpress\'\n\nPage moved to <Link href="/client-only-components" />.\n\n   </Note>\n\n\nexport const headings = [];\n',
      loc: {
        file: '/home/rom/code/vite-plugin-ssr/docs/pages/dynamic-import.page.server.mdx',
        start: { line: 5, column: 5, offset: 109, _index: 6, _bufferIndex: 4 },
        end: { line: 5, column: 6, offset: 110, _index: 6, _bufferIndex: 5 }
      },
      frame: '',
      stack: ''
    }
    // We can't prettify this error because there isn't any code snippet (err.pluginCode contains the whole file without any code position)
    // That said, we could generate the code snippet ourselves since we have err.position and err.pluginCode
    expect(isErrorWithCodeSnippet(err)).toBe(false)
  })

  it('real use case - @vitejs/plugin-vue - template', () => {
    const err = {
      id: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue',
      plugin: 'vite:vue',
      message: 'Element is missing end tag.',
      name: 'SyntaxError',
      stack:
        'SyntaxError: Element is missing end tag.\n    at createCompilerError (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:19:19)\n    at emitError (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:1594:29)\n    at parseElement (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:1146:9)\n    at parseChildren (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:937:28)\n    at parseElement (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:1125:22)\n    at parseChildren (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:937:28)\n    at parseElement (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:1125:22)\n    at parseChildren (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:937:28)\n    at Object.baseParse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-core@3.2.33/node_modules/@vue/compiler-core/dist/compiler-core.cjs.js:852:23)\n    at Object.parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-dom@3.2.33/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js:3077:25)',
      loc: { file: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue', line: 2, column: 46 },
      pluginCode:
        "<template>\n  <h1>Welcome to <code>vite-plugin-ssr</code><h1>\n  This page is:\n  <ul>\n    <li>Rendered to HTML.</li>\n    <li>Interactive. <Counter /></li>\n  </ul>\n  <p>\n    <button @click=\"randomNavigation\">Random Page</button>\n  </p>\n</template>\n\n<script lang=\"ts\" setup>\nimport Counter from '../../components/Counter.vue'\nimport { navigate } from 'vite-plugin-ssr/client/router'\n\nconst randomNavigation = () => {\n  const randomIndex = Math.floor(Math.random() * 3)\n  navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])\n}\n</script>\n",
      frame:
        '1  |  <template>\n2  |    <h1>Welcome to <code>vite-plugin-ssr</code><h1>\n   |                                                ^\n3  |    This page is:\n4  |    <ul>'
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /pages/index/+Page.vue because:
      Element is missing end tag.
      1  |  <template>
      2  |    <h1>Welcome to <code>vite-plugin-ssr</code><h1>
         |                                                ^
      3  |    This page is:
      4  |    <ul>"
    `)
  })

  it('real use case - @vitejs/plugin-vue - SFC javascript', () => {
    const err = {
      code: 'BABEL_PARSER_SYNTAX_ERROR',
      reasonCode: 'MissingSemicolon',
      loc: { line: 2, column: 7, index: 8 },
      pos: 8,
      plugin: 'vite:vue',
      id: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue',
      pluginCode:
        "<template>\n  <h1>Welcome to <code>vite-plugin-ssr</code></h1>\n  This page is:\n  <ul>\n    <li>Rendered to HTML.</li>\n    <li>Interactive. <Counter /></li>\n  </ul>\n  <p>\n    <button @click=\"randomNavigation\">Random Page</button>\n  </p>\n</template>\n\n<script lang=\"ts\" setup>\nimeport Counter from '../../components/Counter.vue'\nimport { navigate } from 'vite-plugin-ssr/client/router'\n\nconst randomNavigation = () => {\n  const randomIndex = Math.floor(Math.random() * 3)\n  navigate(['/markdown', '/star-wars', '/hello/alice'][randomIndex])\n}\n</script>\n",
      frame:
        '1  |  <template>\n   |          ^\n2  |    <h1>Welcome to <code>vite-plugin-ssr</code></h1>\n3  |    This page is:',
      message:
        "[@vue/compiler-sfc] Missing semicolon. (2:7)\n\n/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue\n12 |  \n13 |  <script lang=\"ts\" setup>\n14 |  imeport Counter from '../../components/Counter.vue'\n   |         ^\n15 |  import { navigate } from 'vite-plugin-ssr/client/router'\n16 |  ",
      stack:
        "SyntaxError: [@vue/compiler-sfc] Missing semicolon. (2:7)\n\n/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue\n12 |  \n13 |  <script lang=\"ts\" setup>\n14 |  imeport Counter from '../../components/Counter.vue'\n   |         ^\n15 |  import { navigate } from 'vite-plugin-ssr/client/router'\n16 |  \n    at instantiate (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parse-error/credentials.ts:62:21)\n    at toParseError (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parse-error.ts:60:12)\n    at TypeScriptParserMixin.raise (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/tokenizer/index.ts:1490:19)\n    at TypeScriptParserMixin.semicolon (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/util.ts:138:10)\n    at TypeScriptParserMixin.parseExpressionStatement (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:1279:10)\n    at TypeScriptParserMixin.parseExpressionStatement (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:3044:28)\n    at TypeScriptParserMixin.parseStatementContent (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:643:19)\n    at TypeScriptParserMixin.parseStatementContent (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:2887:20)\n    at TypeScriptParserMixin.parseStatementLike (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:417:17)\n    at TypeScriptParserMixin.parseModuleItem (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:354:17)"
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /pages/index/+Page.vue because:
      [@vue/compiler-sfc] Missing semicolon. 
      12 |  
      13 |  <script lang=\\"ts\\" setup>
      14 |  imeport Counter from '../../components/Counter.vue'
         |         ^
      15 |  import { navigate } from 'vite-plugin-ssr/client/router'
      16 |"
    `)
  })
})

describe('getPrettyErrMessage()', () => {
  const id = '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx'
  const frame = `Expected ";" but found "React"
  1  |  iemport React, { useState } from 'react'
     |          ^
  2  |  
  3  |  export { Counter }`

  it('operations', () => {
    {
      const message = '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx'
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe('')
    }
    {
      const message = '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:2: abc'
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe('abc')
    }
    {
      const message = 'Transform failed with 1 error'
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe('')
    }
    {
      const message = 'Transform failed with 42 errors: abc'
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe('abc')
    }
    {
      const codeSnippet = [
        // prettier-ignore
        '  | some',
        '> | fake',
        '  | code'
      ].join('\n')
      const message = `(1:2)\n${codeSnippet}`
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe(codeSnippet.trim())
    }
    {
      const message = '(1:2)'
      const err = { message, id, frame }
      expect(getPrettyErrMessage(err)).toBe('(1:2)')
    }
  })

  it('real use case - @vitejs/plugin-react (1)', () => {
    const message = `Transform failed with 1 error:
/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:8: ERROR: Expected ";" but found "React"`
    const err = { message, id, frame }
    expect(getPrettyErrMessage(err)).toBe('')
  })

  it('real use case - @vitejs/plugin-react (2)', () => {
    const message =
      '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx:1:8: Expected ";" but found "React"'
    const err = { message, id, frame }
    expect(getPrettyErrMessage(err)).toBe('')
  })

  it('real use case - @vitejs/plugin-vue', () => {
    const id = '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue'
    const message = `SyntaxError: [@vue/compiler-sfc] Missing semicolon. (2:7)

/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/pages/index/+Page.vue
12 |  
13 |  <script lang="ts" setup>
14 |  iemport Counter from '../../components/Counter.vue'
   |         ^
15 |  import { navigate } from 'vite-plugin-ssr/client/router'
16 |  `
    const result = `SyntaxError: [@vue/compiler-sfc] Missing semicolon. 

12 |  
13 |  <script lang="ts" setup>
14 |  iemport Counter from '../../components/Counter.vue'
   |         ^
15 |  import { navigate } from 'vite-plugin-ssr/client/router'
16 |`
    const err = { message, id, frame }
    expect(getPrettyErrMessage(err)).toBe(result)
  })

  it('real use case - @vitejs/plugin-react (3)', () => {
    const message =
      "/home/rom/code/vite-plugin-ssr/examples/react-full-v1/components/Counter.tsx: Missing semicolon. (1:7)\n\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 1 |\u001b[39m iemport \u001b[33mReact\u001b[39m\u001b[33m,\u001b[39m { useState } \u001b[36mfrom\u001b[39m \u001b[32m'react'\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m   |\u001b[39m        \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 2 |\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 3 |\u001b[39m \u001b[36mexport\u001b[39m { \u001b[33mCounter\u001b[39m }\u001b[0m\n\u001b[0m \u001b[90m 4 |\u001b[39m\u001b[0m"
    const frame =
      "> 1  |  iemport React, { useState } from 'react'\n   |         ^\n  2  |  \n  3  |  export { Counter }  4 |"
    const err = { message, id, frame }
    const codeSnippet = message.split('semicolon. (1:7)')[1]
    expect(getPrettyErrMessage(err)).toBe(`Missing semicolon. ${codeSnippet}`)
  })
})
