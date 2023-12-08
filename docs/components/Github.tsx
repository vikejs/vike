export { Github }

import React from 'react'
import { assert } from '@brillout/docpress'

function Github({ repo }: { repo: `${string}/${string}` }) {
  assert(repo)
  assert(repo.split('/').length === 2)
  return (
    <a href={'https://github.com/' + repo}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
