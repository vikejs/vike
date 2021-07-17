import React from 'react'
import { assert } from '../../utils'

export { RepoLink }

function RepoLink({ path, text }: { path: string; text?: string }) {
  assert(path.startsWith('/') || path.startsWith('.github/'))
  text = text || path
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  const viewMode = path.endsWith('/') ? 'tree' : 'blob'
  const href = `https://github.com/brillout/vite-plugin-ssr/${viewMode}/master${path}`
  return <a href={href}>{text}</a>
}
