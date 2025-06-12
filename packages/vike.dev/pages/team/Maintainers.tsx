export { Maintainers }
export { Contributors }

import { getMaintainerAvatar, maintainersList } from './maintainersList'
import React from 'react'

function Maintainers() {
  return (
    <div>
      {maintainersList
        .filter((m) => m.isCoreTeam)
        .map((maintainer, i) => (
          <Maintainer maintainer={maintainer} key={i} />
        ))}
    </div>
  )
}

function Contributors() {
  return (
    <div>
      {maintainersList
        .filter((m) => !m.isCoreTeam)
        .map((maintainer, i) => (
          <Maintainer maintainer={maintainer} key={i} />
        ))}
    </div>
  )
}

function Maintainer({ maintainer }: { maintainer: (typeof maintainersList)[0] }) {
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
        {maintainer.consultingUrl ? (
          <>
            {' '}
            ·{' '}
            <a href={maintainer.consultingUrl}>
              <b
                style={{
                  fontSize: '.7em',
                  color: 'white',
                  backgroundColor: '#305090',
                  padding: '1px 5px 2px 5px',
                  verticalAlign: 'text-top',
                  borderRadius: 3,
                }}
              >
                consulting
              </b>
            </a>
          </>
        ) : null}
        <ul style={{ fontSize: '.8em', paddingLeft: 15, marginTop: 5, marginBottom: 0 }}>
          {maintainer.roles.map((role, i) => (
            <li key={i}>{role}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
