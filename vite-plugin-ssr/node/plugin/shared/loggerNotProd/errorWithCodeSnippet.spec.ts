import { expect, describe, it } from 'vitest'
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
    const formatted = getPrettyErrorWithCodeSnippet(err, '/home/rom/code/vite-plugin-ssr/examples/react-full-v1/')
    expect(formatted).toMatchInlineSnapshot(`
      "[31mFailed to transpile[39m [31m[1m/pages/hello/+Page.tsx[22m[39m [31mbecause:[39m
      [38;2;255;30;30m×[0m Expected ';', '}' or <eof>
         ╭─[[38;2;92;157;255;1;4m/home/rom/code/vite-plugin-ssr/examples/react-full-v1/pages/hello/+Page.tsx[0m:1:1]
       [2m1[0m │ export default Page
       [2m2[0m │ 
       [2m3[0m │ impeort React from 'react'
         · [38;2;246;87;248m───┬───[0m[38;2;30;201;212m ─────[0m
         ·    [38;2;246;87;248m╰── [38;2;246;87;248mThis is the expression part of an expression statement[0m[0m
       [2m4[0m │ 
       [2m5[0m │ function Page({ name }: { name: string }) {
       [2m6[0m │   return (
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
