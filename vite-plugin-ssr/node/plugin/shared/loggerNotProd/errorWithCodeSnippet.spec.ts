import { expect, describe, it } from 'vitest'
import { stripAnsi } from '../../utils'
import { getPrettyErrMessage, getPrettyErrorWithCodeSnippet, isErrorWithCodeSnippet } from './errorWithCodeSnippet'

// To generate new test cases:
// ```bash
// DEBUG=vps:error pnpm run dev
// ```

describe('getPrettyErrorWithCodeSnippet() - success', () => {
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

  it('real use case - @vitejs/plugin-vue - SFC CSS', () => {
    const err = {
      name: 'CssSyntaxError',
      reason: 'Unexpected }',
      file: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue',
      source:
        '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
      line: 6,
      column: 2,
      endLine: 6,
      endColumn: 3,
      input: {
        line: 6,
        column: 2,
        endLine: 6,
        endColumn: 3,
        source:
          '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
        url: 'file:///home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue',
        file: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue'
      },
      loc: { file: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue', line: 45, column: 2 },
      id: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue',
      plugin: 'vite:vue',
      pluginCode:
        '\n.layout {\n  display: flex;\n  max-width: 900px;\n  margin: auto;\n}}\n.content {\n  padding: 20px;\n  padding-bottom: 50px;\n  min-height: 100vh;\n}\n.navigation {\n  padding: 20px;\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.8em;\n  border-right: 2px solid #eee;\n}\n.logo {\n  margin-top: 20px;\n  margin-bottom: 10px;\n}\n.content {\n  transition: opacity 0.1s ease-in;\n}\n.content.page-transition {\n  opacity: 0;\n}\n',
      frame:
        '43 |    margin: auto;\n44 |  }}\n45 |  .content {\n   |    ^\n46 |    padding: 20px;\n47 |    padding-bottom: 50px;',
      message: '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue:6:2: Unexpected }',
      stack:
        'CssSyntaxError: /home/rom/code/vite-plugin-ssr/examples/vue-full-v1/renderer/PageShell.vue:6:2: Unexpected }\n    at Input.error (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/input.js:148:16)\n    at Parser.unexpectedClose (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:548:22)\n    at Parser.end (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:379:12)\n    at Parser.parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:56:16)\n    at parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parse.js:11:12)\n    at new LazyResult (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:133:16)\n    at Processor.process (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/processor.js:28:14)\n    at doCompileStyle (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-sfc@3.2.33/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:17246:45)\n    at Object.compileStyleAsync (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vue+compiler-sfc@3.2.33/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js:17188:12)\n    at transformStyle (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@vitejs+plugin-vue@4.2.1_vite@4.3.5_vue@3.2.33/node_modules/@vitejs/plugin-vue/dist/index.cjs:2622:41)'
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /renderer/PageShell.vue because:
      Unexpected }
      43 |    margin: auto;
      44 |  }}
      45 |  .content {
         |    ^
      46 |    padding: 20px;
      47 |    padding-bottom: 50px;"
    `)
  })

  it('real use case - @vitejs/plugin-react - JavaScript esuild', () => {
    const err = {
      errors: [
        {
          id: '',
          location: {
            column: 20,
            file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
            length: 1,
            line: 7,
            lineText: 'export { PageShell }}',
            namespace: '',
            suggestion: ''
          },
          notes: [],
          pluginName: '',
          text: 'Unexpected "}"'
        }
      ],
      warnings: [],
      frame:
        '\n\u001b[33mUnexpected "}"\u001b[39m\n5  |  import type { PageContext } from \'./types\'\n6  |  \n7  |  export { PageShell }}\n   |                      ^\n8  |  \n9  |  function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {\n',
      loc: {
        column: 20,
        file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
        length: 1,
        line: 7,
        lineText: 'export { PageShell }}',
        namespace: '',
        suggestion: ''
      },
      plugin: 'vite:esbuild',
      id: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
      pluginCode:
        "import React from 'react'\nimport logoUrl from './logo.svg'\nimport { PageContextProvider } from './usePageContext'\nimport { Link } from './Link'\nimport type { PageContext } from './types'\n\nexport { PageShell }}\n\nfunction PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {\n  return (\n    <React.StrictMode>\n      <PageContextProvider pageContext={pageContext}>\n        <Layout>\n          <Sidebar>\n            <Logo />\n            <Link href=\"/\">Welcome</Link>\n            <Link href=\"/markdown\">Markdown</Link>\n            <Link href=\"/star-wars\">Data Fetching</Link>\n            <Link href=\"/hello\">Routing</Link>\n          </Sidebar>\n          <Content>{children}</Content>\n        </Layout>\n      </PageContextProvider>\n    </React.StrictMode>\n  )\n}\n\nfunction Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      style={{\n        display: 'flex',\n        maxWidth: 900,\n        margin: 'auto'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Sidebar({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      id=\"sidebar\"\n      style={{\n        padding: 20,\n        flexShrink: 0,\n        display: 'flex',\n        flexDirection: 'column',\n        lineHeight: '1.8em',\n        borderRight: '2px solid #eee'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Content({ children }: { children: React.ReactNode }) {\n  return (\n    <div id=\"page-container\">\n      <div\n        id=\"page-content\"\n        style={{\n          padding: 20,\n          paddingBottom: 50,\n          minHeight: '100vh'\n        }}\n      >\n        {children}\n      </div>\n    </div>\n  )\n}\n\nfunction Logo() {\n  return (\n    <div\n      style={{\n        marginTop: 20,\n        marginBottom: 10\n      }}\n    >\n      <a href=\"/\">\n        <img src={logoUrl} height={64} width={64} />\n      </a>\n    </div>\n  )\n}\n",
      message:
        'Transform failed with 1 error:\n/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx:7:20: ERROR: Unexpected "}"',
      stack:
        'Error: Transform failed with 1 error:\n/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx:7:20: ERROR: Unexpected "}"\n    at failureErrorWithLog (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:1636:15)\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:837:29\n    at responseCallbacks.<computed> (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:697:9)\n    at handleIncomingPacket (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:752:9)\n    at Socket.readFromStdout (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/esbuild@0.17.18/node_modules/esbuild/lib/main.js:673:7)\n    at Socket.emit (node:events:513:28)\n    at addChunk (node:internal/streams/readable:324:12)\n    at readableAddChunk (node:internal/streams/readable:297:9)\n    at Socket.Readable.push (node:internal/streams/readable:234:10)\n    at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)'
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /renderer/PageShell.tsx because:
      Unexpected \\"}\\"
      5  |  import type { PageContext } from './types'
      6  |  
      7  |  export { PageShell }}
         |                      ^
      8  |  
      9  |  function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {"
    `)
  })

  it('real use case - @vitejs/plugin-react - JavaScript Babel', () => {
    const err = {
      code: 'BABEL_PARSE_ERROR',
      reasonCode: 'UnexpectedToken',
      loc: { line: 7, column: 20, index: 208 },
      pos: 208,
      plugin: 'vite:react-babel',
      id: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx',
      pluginCode:
        "import React from 'react'\nimport logoUrl from './logo.svg'\nimport { PageContextProvider } from './usePageContext'\nimport { Link } from './Link'\nimport type { PageContext } from './types'\n\nexport { PageShell }}\n\nfunction PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {\n  return (\n    <React.StrictMode>\n      <PageContextProvider pageContext={pageContext}>\n        <Layout>\n          <Sidebar>\n            <Logo />\n            <Link href=\"/\">Welcome</Link>\n            <Link href=\"/markdown\">Markdown</Link>\n            <Link href=\"/star-wars\">Data Fetching</Link>\n            <Link href=\"/hello\">Routing</Link>\n          </Sidebar>\n          <Content>{children}</Content>\n        </Layout>\n      </PageContextProvider>\n    </React.StrictMode>\n  )\n}\n\nfunction Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      style={{\n        display: 'flex',\n        maxWidth: 900,\n        margin: 'auto'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Sidebar({ children }: { children: React.ReactNode }) {\n  return (\n    <div\n      id=\"sidebar\"\n      style={{\n        padding: 20,\n        flexShrink: 0,\n        display: 'flex',\n        flexDirection: 'column',\n        lineHeight: '1.8em',\n        borderRight: '2px solid #eee'\n      }}\n    >\n      {children}\n    </div>\n  )\n}\n\nfunction Content({ children }: { children: React.ReactNode }) {\n  return (\n    <div id=\"page-container\">\n      <div\n        id=\"page-content\"\n        style={{\n          padding: 20,\n          paddingBottom: 50,\n          minHeight: '100vh'\n        }}\n      >\n        {children}\n      </div>\n    </div>\n  )\n}\n\nfunction Logo() {\n  return (\n    <div\n      style={{\n        marginTop: 20,\n        marginBottom: 10\n      }}\n    >\n      <a href=\"/\">\n        <img src={logoUrl} height={64} width={64} />\n      </a>\n    </div>\n  )\n}\n",
      frame:
        "5  |  import type { PageContext } from './types'\n6  |  \n7  |  export { PageShell }}\n   |                      ^\n8  |  \n9  |  function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {",
      message:
        "/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx: Unexpected token (7:20)\n\n\u001b[0m \u001b[90m  5 |\u001b[39m \u001b[36mimport\u001b[39m type { \u001b[33mPageContext\u001b[39m } \u001b[36mfrom\u001b[39m \u001b[32m'./types'\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  6 |\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m  7 |\u001b[39m \u001b[36mexport\u001b[39m { \u001b[33mPageShell\u001b[39m }}\u001b[0m\n\u001b[0m \u001b[90m    |\u001b[39m                     \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  8 |\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  9 |\u001b[39m \u001b[36mfunction\u001b[39m \u001b[33mPageShell\u001b[39m({ pageContext\u001b[33m,\u001b[39m children }\u001b[33m:\u001b[39m { pageContext\u001b[33m:\u001b[39m \u001b[33mPageContext\u001b[39m\u001b[33m;\u001b[39m children\u001b[33m:\u001b[39m \u001b[33mReact\u001b[39m\u001b[33m.\u001b[39m\u001b[33mReactNode\u001b[39m }) {\u001b[0m\n\u001b[0m \u001b[90m 10 |\u001b[39m   \u001b[36mreturn\u001b[39m (\u001b[0m",
      stack:
        "SyntaxError: /home/rom/code/vite-plugin-ssr/examples/react-full/renderer/PageShell.tsx: Unexpected token (7:20)\n\n\u001b[0m \u001b[90m  5 |\u001b[39m \u001b[36mimport\u001b[39m type { \u001b[33mPageContext\u001b[39m } \u001b[36mfrom\u001b[39m \u001b[32m'./types'\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  6 |\u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m  7 |\u001b[39m \u001b[36mexport\u001b[39m { \u001b[33mPageShell\u001b[39m }}\u001b[0m\n\u001b[0m \u001b[90m    |\u001b[39m                     \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  8 |\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  9 |\u001b[39m \u001b[36mfunction\u001b[39m \u001b[33mPageShell\u001b[39m({ pageContext\u001b[33m,\u001b[39m children }\u001b[33m:\u001b[39m { pageContext\u001b[33m:\u001b[39m \u001b[33mPageContext\u001b[39m\u001b[33m;\u001b[39m children\u001b[33m:\u001b[39m \u001b[33mReact\u001b[39m\u001b[33m.\u001b[39m\u001b[33mReactNode\u001b[39m }) {\u001b[0m\n\u001b[0m \u001b[90m 10 |\u001b[39m   \u001b[36mreturn\u001b[39m (\u001b[0m\n    at instantiate (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parse-error/credentials.ts:62:21)\n    at toParseError (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parse-error.ts:60:12)\n    at TypeScriptParserMixin.raise (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/tokenizer/index.ts:1490:19)\n    at TypeScriptParserMixin.unexpected (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/tokenizer/index.ts:1531:16)\n    at TypeScriptParserMixin.parseExprAtom (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:1347:16)\n    at TypeScriptParserMixin.parseExprAtom (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/jsx/index.ts:574:22)\n    at TypeScriptParserMixin.parseExprSubscripts (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:718:23)\n    at TypeScriptParserMixin.parseUpdate (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:695:21)\n    at TypeScriptParserMixin.parseMaybeUnary (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:657:23)\n    at TypeScriptParserMixin.parseMaybeUnary (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:3552:20)\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:395:14)\n    at TypeScriptParserMixin.parseExprOps (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:407:23)\n    at TypeScriptParserMixin.parseMaybeConditional (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:362:23)\n    at TypeScriptParserMixin.parseMaybeAssign (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:302:21)\n    at TypeScriptParserMixin.parseMaybeAssign (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:3429:22)\n    at TypeScriptParserMixin.parseExpressionBase (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:225:23)\n    at callback (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:216:39)\n    at TypeScriptParserMixin.allowInAnd (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:3072:16)\n    at TypeScriptParserMixin.parseExpression (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/expression.ts:216:17)\n    at TypeScriptParserMixin.parseStatementContent (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:628:23)\n    at TypeScriptParserMixin.parseStatementContent (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:2887:20)\n    at TypeScriptParserMixin.parseStatementLike (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:417:17)\n    at TypeScriptParserMixin.parseModuleItem (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:354:17)\n    at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:1359:16)\n    at TypeScriptParserMixin.parseBlockBody (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:1333:10)\n    at TypeScriptParserMixin.parseProgram (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:226:10)\n    at TypeScriptParserMixin.parseTopLevel (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/statement.ts:208:25)\n    at TypeScriptParserMixin.parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/parser/index.ts:45:10)\n    at TypeScriptParserMixin.parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/plugins/typescript/index.ts:3997:20)\n    at parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+parser@7.21.8/node_modules/@babel/parser/src/index.ts:67:38)\n    at parser (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+core@7.21.8/node_modules/@babel/core/src/parser/index.ts:28:19)\n    at parser.next (<anonymous>)\n    at normalizeFile (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+core@7.21.8/node_modules/@babel/core/src/transformation/normalize-file.ts:51:24)\n    at normalizeFile.next (<anonymous>)\n    at run (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+core@7.21.8/node_modules/@babel/core/src/transformation/index.ts:38:36)\n    at run.next (<anonymous>)\n    at transform (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+core@7.21.8/node_modules/@babel/core/src/transform.ts:29:20)\n    at transform.next (<anonymous>)\n    at step (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:261:32)\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:223:11)\n    at cb (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:189:28)\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/@babel+core@7.21.8/node_modules/@babel/core/src/gensync-utils/async.ts:90:7\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:113:33\n    at step (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:287:14)\n    at /home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:273:13\n    at async.call.result.err.err (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/gensync@1.0.0-beta.2/node_modules/gensync/index.js:223:11)"
    }
    /* } */
    /* } */
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /renderer/PageShell.tsx because:
      Unexpected token 
         5 | import type { PageContext } from './types'
         6 |
      >  7 | export { PageShell }}
           |                     ^
         8 |
         9 | function PageShell({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
        10 |   return ("
    `)
  })
})

describe('getPrettyErrorWithCodeSnippet() - failure', () => {
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

  it('real use case - @vitejs/plugin-react - CSS with PostCSS', () => {
    const err = {
      name: 'CssSyntaxError',
      reason: 'Unexpected }',
      file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css',
      source:
        'a {\n  text-decoration: none;\n}}\n#sidebar a {\n  padding: 2px 10px;\n  margin-left: -10px;\n}\n#sidebar a.is-active {\n  background-color: #eee;\n}\n',
      line: 3,
      column: 2,
      endLine: 3,
      endColumn: 3,
      input: {
        line: 3,
        column: 2,
        endLine: 3,
        endColumn: 3,
        source:
          'a {\n  text-decoration: none;\n}}\n#sidebar a {\n  padding: 2px 10px;\n  margin-left: -10px;\n}\n#sidebar a.is-active {\n  background-color: #eee;\n}\n',
        url: 'file:///home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css',
        file: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css'
      },
      plugin: 'vite:css',
      code: "@import './reset.css';\n@import './links.css';\n@import './code.css';\n@import './page-transition-loading-animation.css';\n",
      loc: { column: 2, line: 3 },
      id: '/home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css',
      pluginCode:
        "@import './reset.css';\n@import './links.css';\n@import './code.css';\n@import './page-transition-loading-animation.css';\n",
      frame:
        "1  |  @import './reset.css';\n2  |  @import './links.css';\n3  |  @import './code.css';\n   |    ^\n4  |  @import './page-transition-loading-animation.css';\n5  |  ",
      message:
        '[postcss] postcss-import: /home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css:3:2: Unexpected }',
      stack:
        'CssSyntaxError: [postcss] postcss-import: /home/rom/code/vite-plugin-ssr/examples/react-full/renderer/css/links.css:3:2: Unexpected }\n    at Input.error (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/input.js:148:16)\n    at Parser.unexpectedClose (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:548:22)\n    at Parser.end (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:379:12)\n    at Parser.parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parser.js:56:16)\n    at parse (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/parse.js:11:12)\n    at new LazyResult (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:133:16)\n    at Processor.process (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/processor.js:28:14)\n    at runPostcss (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:287:6)\n    at processContent (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:281:10)\n    at file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-5673ffe5.js:867:20\n    at async Promise.all (index 0)\n    at LazyResult.runAsync (/home/rom/code/vite-plugin-ssr/node_modules/.pnpm/postcss@8.4.23/node_modules/postcss/lib/lazy-result.js:396:11)\n    at compileCSS (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:38483:25)\n    at TransformContext.transform (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:37919:56)\n    at Object.transform (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:42884:30)\n    at loadAndTransform (file:///home/rom/code/vite-plugin-ssr/node_modules/.pnpm/vite@4.3.5_@types+node@17.0.45/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:53350:29)'
    }
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full')
    // This is wrong, the code snippet should be (note the erroneous double }} at line 3):
    // ```css
    // a {
    //  text-decoration: none;
    // }}
    // #sidebar a {
    //   padding: 2px 10px;
    //   margin-left: -10px;
    // }
    // #sidebar a.is-active {
    //   background-color: #eee;
    // }
    // ```
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /renderer/css/links.css because:
      [postcss] postcss-import: Unexpected }
      1  |  @import './reset.css';
      2  |  @import './links.css';
      3  |  @import './code.css';
         |    ^
      4  |  @import './page-transition-loading-animation.css';
      5  |"
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
