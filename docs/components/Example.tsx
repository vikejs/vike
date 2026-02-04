export { Example }
export { ExampleTimestamp }
export { GithubLink }

import React from 'react'
import { assert } from '@brillout/docpress'

type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

function Example({ repo, timestamp, href }: { repo: Repo; timestamp: TimestampType; href?: string }) {
  return (
    <>
      <ExampleTimestamp>{timestamp}</ExampleTimestamp> <GithubLink href={href} repo={repo} />
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

function GithubLink({ repo, href }: { repo: Repo; href?: string }) {
  assert(repo.split('/').length >= 2)
  href ??= 'https://github.com/' + repo
  return (
    <a href={href}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
