export default Page
export const frontmatter = {
  title: 'Some title set in mdx'
}

import { createElement as h, Fragment } from 'react'
import { Counter } from './Counter'

function Page() {
  const h1 = h('h1', null, 'Side export .md file')
  const p = h('p', null, 'Test: being able to define a config as a "side export" in a `.md` file, such as frontmatter data. (See `export { frontmatter }` in `/pages/markdown-page/+Page.md`.)')
  const counter = h(Counter)
  return h(Fragment, null, h1, p, counter)
}
