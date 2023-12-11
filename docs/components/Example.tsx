export { Example }
export { Github }

import React from 'react'
import { assert } from '@brillout/docpress'

type Repo = `${string}/${string}`
type TimestampType = `${number}.${number}`

function Example({
  repo,
  timestamp,
  description
}: {
  repo: Repo
  timestamp: TimestampType
  description?: string | React.ReactNode
}) {
  let descriptionEl = !description ? null : <> - {description}</>
  return (
    <>
      <Timestamp>{timestamp}</Timestamp> <Github>{repo}</Github>
      {descriptionEl}
    </>
  )
}

function Timestamp({ children }: { children: TimestampType }) {
  return (
    <span
      style={{
        background: 'white',
        fontSize: '1.13em',
        fontWeight: 'bold',
        verticalAlign: 'middle',
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
  assert(repo.split('/').length === 2)
  return (
    <a href={'https://github.com/' + repo}>
      GitHub &gt; <code>{repo}</code>
    </a>
  )
}
