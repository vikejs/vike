export default Page
export const frontmatter = {
  title: 'Some title set in mdx'
}

import { createElement as h, Fragment } from 'react'
import { Counter } from './Counter'

function Page() {
  const h1 = h('h1', null, 'Test side export of .md file')
  const p = h('p', null, 'Some text')
  const counter = h(Counter)
  return h(Fragment, null, h1, p, counter)
}
