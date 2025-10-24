export { BlogHeader }

import { getMaintainer, getMaintainerAvatar, type Maintainer, type MaintainerUsername } from '../team/maintainersList'
import React from 'react'

function BlogHeader({ authors, date }: { authors: MaintainerUsername[]; date: Date }) {
  const maintainers = authors.map(getMaintainer)
  return (
    <div
      style={{
        marginBottom: 40,
        paddingBottom: 24,
        borderBottom: '1px solid #e5e5e5',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        {date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {maintainers.map((maintainer, index) => (
          <Author key={maintainer.username} maintainer={maintainer} />
        ))}
      </div>
    </div>
  )
}

function Author({ maintainer }: { maintainer: Maintainer }) {
  const imgSize = 40
  const githubUrl = `https://github.com/${maintainer.username}`

  return (
    <a
      href={githubUrl}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderRadius: 7,
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: imgSize,
          height: imgSize,
          borderRadius: imgSize / 2,
          overflow: 'hidden',
          marginRight: 8,
        }}
      >
        <img
          style={{
            width: imgSize,
            height: imgSize,
            display: 'block',
          }}
          src={getMaintainerAvatar(maintainer, imgSize)}
          alt={maintainer.username}
        />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>
          {maintainer.firstName}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {maintainer.username}
        </div>
      </div>
    </a>
  )
}
