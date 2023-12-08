export { Github }

import React from 'react'
import { assert } from '@brillout/docpress'

function Github({ children }: { children: `${string}/${string}` }) {
  const repo = children
  assert(repo)
  assert(repo.split('/').length === 2)
  return (
    <a href={'https://github.com/' + repo}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
