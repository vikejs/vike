export { BlogHeader }

import { getMaintainer, getMaintainerAvatar, type Maintainer, type MaintainerUsername } from '../team/maintainersList'
import React from 'react'

function BlogHeader({ authors, date }: { authors: MaintainerUsername[]; date: Date }) {
  const maintainers = authors.map(getMaintainer)
  return (
    <div>
      <div>{date.toLocaleDateString()}</div>
      {maintainers.map((m) => {
        return <Author maintainer={m} />
      })}
    </div>
  )
}

function Author({ maintainer }: { maintainer: Maintainer }) {
  /*
  return <div>
    {m.firstName}
    {m.firstName}
  </div>
  */
  const marginHeight = 20
  const imgSize = 50
  const githubUrl = `https://github.com/${maintainer.username}`
  return (
    <div
      id="team"
      style={{
        borderRadius: 7,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        width: 500,
        margin: `${marginHeight}px 0`,
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20,
        gap: 20,
        textAlign: 'left',
      }}
    >
      <a href={githubUrl}>
        <div style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 2, overflow: 'hidden' }}>
          <img
            style={{ width: imgSize, height: imgSize }}
            src={getMaintainerAvatar(maintainer, imgSize)}
            alt={maintainer.username}
          />
        </div>
      </a>
      <div>
        <b>{maintainer.firstName}</b> ·{' '}
        <a href={githubUrl}>
          <i style={{ fontSize: '.9em', color: '#505050' }}>{maintainer.username}</i>
        </a>
      </div>
    </div>
  )
}
