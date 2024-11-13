// supporters = sponsors + contributors

export { Supporter, SupporterSection, SectionDescription, Individuals, SupporterImg, CallToAction }

import React from 'react'

type Children = (string | JSX.Element) | (string | JSX.Element)[]

function SupporterSection({ children }: { children?: Children }) {
  return (
    <div
      style={{
        textAlign: 'center'
      }}
    >
      {children}
    </div>
  )
}

function SectionDescription({ children }: { children?: Children }) {
  return (
    <div
      style={{
        maxWidth: 400,
        display: 'inline-block',
        marginTop: 12,
        marginBottom: 12,
        fontSize: '1.05em'
      }}
    >
      {children}
    </div>
  )
}

function Individuals({ children }: { children?: Children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'end',
        margin: '17px auto',
        maxWidth: 700
      }}
    >
      {children}
    </div>
  )
}

// Individual sponsor or small contributor
function Supporter({ username, avatarUrl }: { username: string; avatarUrl?: string }) {
  const website = `https://github.com/${username}`
  const width = 30
  const height = 30
  const marginWidth = 5
  const marginHeight = 5
  return (
    <a
      href={website}
      style={{
        margin: `${marginHeight}px ${marginWidth}px`
      }}
    >
      <div
        style={{
          borderRadius: 7,
          overflow: 'hidden',
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <SupporterImg {...{ username, avatarUrl, width, height }} />
      </div>
    </a>
  )
}

function SupporterImg({
  imgSrc, // has precedence over avatarUrl
  avatarUrl, // has precedence over username
  username,
  imgAlt,
  width,
  height,
  padding = 0
}: {
  imgSrc?: string
  avatarUrl?: string
  username?: string
  imgAlt?: string
  width: number
  height: number
  padding?: number
}) {
  const size = Math.max(width, height)
  if (avatarUrl) {
    imgSrc = imgSrc || `${avatarUrl}&size=${size}`
  }
  if (username) {
    imgSrc = imgSrc || `https://github.com/${username}.png?size=${size}`
    imgAlt = imgAlt || username
  }
  return (
    <img
      style={{ width: `calc(100% - ${padding}px)`, height: height - padding, zIndex: 2, objectFit: 'contain' }}
      src={imgSrc}
      alt={imgAlt}
    />
  )
}

function CallToAction({ iconUrl, text, href }: { iconUrl: string; text: string; href: string }) {
  return (
    <a
      className="button"
      style={{
        color: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 10px',
        marginBottom: 10
      }}
      href={href}
    >
      <img src={iconUrl} height={22} /> <span style={{ marginLeft: 7, fontSize: '1.07em' }}>{text}</span>
    </a>
  )
}
