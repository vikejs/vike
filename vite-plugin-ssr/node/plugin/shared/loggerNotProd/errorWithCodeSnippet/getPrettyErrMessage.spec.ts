import { getPrettyErrMessage } from '../errorWithCodeSnippet.js'

import { expect, describe, it } from 'vitest'

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
14 |  iemport Counter from '../../components/Counter.vue.js'
   |         ^
15 |  import { navigate } from 'vite-plugin-ssr/client/router'
16 |  `
    const result = `SyntaxError: [@vue/compiler-sfc] Missing semicolon. 

12 |  
13 |  <script lang="ts" setup>
14 |  iemport Counter from '../../components/Counter.vue.js'
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
