export { Contributors, Maintainer }

import React from 'react'
import { SupporterImg } from './Supporters'
import { maintainers } from './maintainersList'

function Contributors() {
  return (
    <div
      style={{
        textAlign: 'center'
      }}
    >
      <p
        style={{
          maxWidth: 400,
          display: 'inline-block',
          fontSize: '1.2em'
        }}
      >
        Vike is built and maintained by passionate contributors.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'end' }}>
        {maintainers.map((maintainer, i) => (
          <Maintainer maintainer={maintainer} key={i} />
        ))}
      </div>
    </div>
  )
}

function Maintainer({ maintainer }: { maintainer: (typeof maintainers)[0] }) {
  const marginHeight = 20
  const marginWidth = 10
  const imgSize = 50
  const githubUrl = `https://github.com/${maintainer.username}`
  return (
    <div
      style={{
        borderRadius: 7,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        width: 430,
        maxWidth: `calc(100vw - 2 * var(--main-view-padding) - 2 * ${marginWidth}px)`,
        margin: `${marginHeight}px ${marginWidth}px`,
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20,
        gap: 20,
        textAlign: 'left'
      }}
    >
      <a href={githubUrl}>
        <div style={{ width: imgSize, height: imgSize, borderRadius: imgSize / 2, overflow: 'hidden' }}>
          <SupporterImg username={maintainer.username} imgAlt={maintainer.firstName} width={imgSize} height={imgSize} />
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
                  borderRadius: 3
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
