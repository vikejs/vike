import React from 'react'
import { assert } from '../utils'

export { RepoLink }

function RepoLink({ path, text }: { path: string; text?: string }) {
  assert(path.startsWith('/'))
  text = text || path
  const href = 'https://github.com/brillout/vite-plugin-ssr/tree/master' + path
  return <a href={href}>{text}</a>
}
