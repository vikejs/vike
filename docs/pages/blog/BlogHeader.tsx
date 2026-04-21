export { BlogHeader }

import { getMaintainer, getMaintainerAvatar, type Maintainer, type MaintainerUsername } from '../team/maintainersList'
import React from 'react'
import { iconBluesky, iconTwitter, iconLinkedin } from '@brillout/docpress'

type Social = {
  bluesky?: string
  twitter?: string
  linkedin?: string
}

function BlogHeader({
  authors,
  date,
  social,
}: {
  authors: MaintainerUsername[]
  date: Date
  social?: Social
}) {
  const maintainers = authors.map(getMaintainer)
  return (
    <div
      style={{
        marginTop: -2,
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: social ? 'center' : 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {maintainers.map((maintainer) => (
          <Author key={maintainer.username} maintainer={maintainer} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: '#999',
            fontWeight: 400,
            fontSize: 15,
            fontStyle: 'italic',
          }}
        >
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        {social && <SocialLinks social={social} />}
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
        gap: 10,
        padding: '8px 10px',
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
        <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{maintainer.firstName}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{maintainer.username}</div>
      </div>
    </a>
  )
}

function SocialLinks({ social }: { social: Social }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {social.bluesky && <SocialLink href={social.bluesky} label="Bluesky" icon={iconBluesky} />}
      {social.twitter && <SocialLink href={social.twitter} label="Twitter / X" icon={iconTwitter} />}
      {social.linkedin && <SocialLink href={social.linkedin} label="LinkedIn" icon={iconLinkedin} />}
    </div>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const size = 18
  const padding = 2
  const sizeOuter = size + padding * 2
  return (
    <a
      className="colorize-on-hover"
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img className="decolorize-4" src={icon} style={{ height: sizeOuter, width: sizeOuter, padding }} alt={label} />
    </a>
  )
}
