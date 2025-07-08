export { Example }
export { ExampleTimestamp }

import React from 'react'
import { assert } from '@brillout/docpress'

type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

function Example({ repo, timestamp, href }: { repo: Repo; timestamp: TimestampType; href?: string }) {
  return (
    <>
      <ExampleTimestamp>{timestamp}</ExampleTimestamp> <Github href={href}>{repo}</Github>
    </>
  )
}

function ExampleTimestamp({
  children,
  timestamp,
}: { children: TimestampType; timestamp?: undefined } | { children?: undefined; timestamp: TimestampType }) {
  return (
    <span
      style={{
        background: 'white',
        fontSize: '1.13em',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        marginRight: 2,
      }}
    >
      {timestamp ?? children}
    </span>
  )
}

function Github({ children, href }: { children: Repo; href?: string }) {
  const repo = children
  assert(repo)
  assert(repo.split('/').length >= 2)
  href ??= 'https://github.com/' + repo
  return (
    <a href={href}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
