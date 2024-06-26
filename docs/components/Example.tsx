export { Example }
export { ExampleTimestamp }

import React from 'react'
import { assert } from '@brillout/docpress'

type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

function Example({ repo, timestamp }: { repo: Repo; timestamp: TimestampType }) {
  return (
    <>
      <ExampleTimestamp>{timestamp}</ExampleTimestamp> <Github>{repo}</Github>
    </>
  )
}

function ExampleTimestamp({ children }: { children: TimestampType }) {
  return (
    <span
      style={{
        background: 'white',
        fontSize: '1.13em',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        marginRight: 2
      }}
    >
      {children}
    </span>
  )
}

function Github({ children }: { children: Repo }) {
  const repo = children
  assert(repo)
  assert(repo.split('/').length >= 2)
  return (
    <a href={'https://github.com/' + repo}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
