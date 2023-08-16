import { getPrettyErrorWithCodeSnippet, isErrorWithCodeSnippet } from '../errorWithCodeSnippet.js'

import { expect, describe, it } from 'vitest'
import { stripAnsi } from '../../../utils.js'

import { errBabelSolid } from './fixture-errors/errBabelSolid.js'
import { errBabelReact } from './fixture-errors/errBabelReact.js'
import { errEsbuild } from './fixture-errors/errEsbuild.js'
import { errVueCss } from './fixture-errors/errVueCss.js'
import { errVueJavascript } from './fixture-errors/errVueJavascript.js'
import { errVueHtml } from './fixture-errors/errVueHtml.js'
import { errSwc } from './fixture-errors/errSwc.js'
import { errSwcBig } from './fixture-errors/errSwcBig.js'
import { errMdx } from './fixture-errors/errMdx.js'
import { errPostcss } from './fixture-errors/errPostcss.js'

// To generate new test cases:
// Uncomment the console.log() statements in ./errorWithCodeSnippet.ts

describe('getPrettyErrorWithCodeSnippet() - success', () => {
  it('real use case - @vitejs/plugin-react-swc', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errSwc, '/home/rom/code/vite-plugin-ssr/examples/react-full-v1')
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
    const formatted = getPrettyErrorWithCodeSnippet(errSwcBig, '/home/rom/code/vite-plugin-ssr/examples/react-full-v1')
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

  it('real use case - @vitejs/plugin-vue - SFC HTML', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errVueHtml, '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1')
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

  it('real use case - @vitejs/plugin-vue - SFC JavaScript', () => {
    const formatted = getPrettyErrorWithCodeSnippet(
      errVueJavascript,
      '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1'
    )
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /pages/index/+Page.vue because:
      [@vue/compiler-sfc] Missing semicolon. 
      12 |  
      13 |  <script lang=\\"ts\\" setup>
      14 |  imeport Counter from '../../components/Counter.vue'
         |         ^
      15 |  import { navigate } from 'vite-plugin-ssr/client/router.js'
      16 |"
    `)
  })

  it('real use case - @vitejs/plugin-vue - SFC CSS', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errVueCss, '/home/rom/code/vite-plugin-ssr/examples/vue-full-v1')
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

  it('real use case - @vitejs/plugin-react - JavaScript esbuild', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errEsbuild, '/home/rom/code/vite-plugin-ssr/examples/react-full')
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
    const formatted = getPrettyErrorWithCodeSnippet(errBabelReact, '/home/rom/code/vite-plugin-ssr/examples/react-full')
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

  it('real use case - vite-plugin-solid - JavaScript with Babel', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errBabelSolid, '/home/rom/code/vite-plugin-ssr/examples/solid-spa')
    expect(stripAnsi(formatted)).toMatchInlineSnapshot(`
      "Failed to transpile /renderer/_default.page.client.tsx because:
      Invalid left-hand side in assignment expression. 
        15 | async function render(pageContext: PageContextClient) {
        16 |   const { Page } = pageContext
      > 17 |   if (1 = 1) {}
           |       ^
        18 |   if (disposePreviousPage) {
        19 |     disposePreviousPage()
        20 |   }"
    `)
  })
})

describe('getPrettyErrorWithCodeSnippet() - failure', () => {
  it('real use case - @mdx-js/rollup', () => {
    // We can't prettify this error because there isn't any code snippet (errMdx.pluginCode contains the whole file without any code position)
    // That said, we could generate the code snippet ourselves since we have errMdx.position and errMdx.pluginCode
    expect(isErrorWithCodeSnippet(errMdx)).toBe(false)
  })

  it('real use case - @vitejs/plugin-react - CSS with PostCSS', () => {
    const formatted = getPrettyErrorWithCodeSnippet(errPostcss, '/home/rom/code/vite-plugin-ssr/examples/react-full')
    // The code snippet should be (note the erroneous double }} at line 3 column 2):
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
    // But the frame shows the importer instead. Seems like an upstream bug? The line and column number is correct => someone upstream is using the source code of the wrong file.
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
