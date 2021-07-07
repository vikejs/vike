import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import iconGithub from './icons/github.svg'
import iconTwitter from './icons/twitter.svg'
import iconDiscord from './icons/discord.svg'
import iconChangelog from './icons/changelog.svg'

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
        id="navigation-header-logo"
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
      <SocialLink className="decolorize-4" icon={iconGithub} href="https://github.com/brillout/vite-plugin-ssr" />
      <SocialLink className="decolorize-6" icon={iconDiscord} href="https://discord.gg/qTq92FQzKb" />
      <SocialLink className="decolorize-7" icon={iconTwitter} href="https://twitter.com/brillout" />
      <ChangelogButton />
    </div>
  )
}

function ChangelogButton() {
  return (
    <a
      href="https://github.com/brillout/vite-plugin-ssr/blob/master/CHANGELOG.md"
      className="button colorize-on-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1px 7px',
        marginLeft: 2,
        fontSize: '0.97em',
        color: 'inherit',
      }}
    >
      <span className="decolorize-7">v0.1.3</span>
      <img className="decolorize-6" src={iconChangelog} height={16} style={{ marginLeft: 5 }} />
    </a>
  )
}

function SocialLink({ className, icon, href }: { className: string; icon: string; href: string }) {
  return (
    <>
      <a
        className={"colorize-on-hover "+className}
        href={href}
        style={{ padding: 3, display: 'inline-block', lineHeight: 0 }}
      >
        <img src={icon} height="20" style={{}} />
      </a>
    </>
  )
}
