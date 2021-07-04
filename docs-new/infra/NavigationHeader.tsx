import React from 'react'
import iconPlugin from '../icons/vite-plugin-ssr.svg'
import iconGithub from '../icons/github.svg'
import iconTwitter from '../icons/twitter.svg'
import iconDiscord from '../icons/discord.svg'
import iconChangelog from '../icons/changelog.svg'
import './NavigationHeader.css'

export { NavigationHeader }

function NavigationHeader() {
  const SIZE = 55
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          justifyContent: 'left',
          textDecoration: 'none',
          paddingTop: 20,
          paddingBottom: 11
        }}
        href="/"
      >
        <img src={iconPlugin} height={SIZE} width={SIZE} />
        <code
          style={{
            backgroundColor: '#f4f4f4',
            borderRadius: 4,
            fontSize: '1.55em',
            padding: '2px 5px',
            marginLeft: 10
          }}
        >
          vite-plugin-ssr
        </code>
      </a>
      <Links />
    </div>
  )
}

function Links() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingTop: 0,
        justifyContent: 'left'
      }}
    >
      <SocialLink id="github-link" icon={iconGithub} href="https://github.com/brillout/vite-plugin-ssr" />
      <SocialLink id="discord-link" icon={iconDiscord} href="https://discord.gg/qTq92FQzKb" />
      <SocialLink id="twitter-link" icon={iconTwitter} href="https://twitter.com/brillout" />
      <ChangelogButton />
    </div>
  )
}

function ChangelogButton() {
  return (
    <a
      href="https://github.com/brillout/vite-plugin-ssr/blob/master/CHANGELOG.md"
      id="changelog-link"
      className="colorize-on-hover"
      style={{
        backgroundColor: '#555',
        color: 'white',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        padding: '2px 7px',
        marginLeft: 2,
        fontSize: '0.97em'
      }}
    >
      <img src={iconChangelog} height={16} style={{ marginRight: 5 }} />
      <span>
        <span style={{ textDecoration: 'unederline' }}>v0.1.2</span> changelog
      </span>
    </a>
  )
}

function SocialLink({ id, icon, href }: { id: string; icon: string; href: string }) {
  return (
    <>
      <a
        id={id}
        className="colorize-on-hover"
        href={href}
        style={{ padding: 3, display: 'inline-block', lineHeight: 0 }}
      >
        <img src={icon} height="20" style={{}} />
      </a>
    </>
  )
}
