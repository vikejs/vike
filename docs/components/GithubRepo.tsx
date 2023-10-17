export { GithubRepo }

import React from 'react'
import { assert } from '@brillout/docpress'

function GithubRepo({ repo }: { repo: `${string}/${string}` }) {
  assert(repo)
  assert(repo.split('/').length === 1)
  return (
    <a href={'https://github.com/' + repo}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
