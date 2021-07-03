import React from 'react'
import './Header.css'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import iconGithub from './icons/github.svg'
import iconTwitter from './icons/twitter.svg'
import iconDiscord from './icons/discord.svg'
import 'balloon-css'

export { Header }

function Header() {
  return (
    <div id="header">
      <LeftSide />
      <RightSide />
    </div>
  )
}

function LeftSide() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 20,
          marginBottom: 10
        }}
      >
        <img src={iconPlugin} height="90" style={{ marginRight: 20 }} />
        <h1 style={{ margin: 0, marginTop: 0, fontSize: '1em' }}>
          <code style={{ fontSize: '3em', padding: '10px 14px', borderRadius: 5 }}>vite-plugin-ssr</code>
        </h1>
        {/*
          <h1 style={{ fontSize: '1em', margin: 0 }}>
            <code style={{ fontSize: '3.5em', padding: '10px 14px', borderRadius: 5 }}>vite-plugin-ssr</code>
          </h1>
         */}
      </div>
      <p style={{ fontSize: '2em', padding: 0, margin: 0 }}>
        Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin.
      </p>
    </div>
  )
}

function RightSide() {
  return (
    <div style={{ marginLeft: 20 }}>
      <div
        style={{
          whiteSpace: 'nowrap',
          //textAlign: 'right',
          textAlign: 'center',
          marginTop: 30
        }}
      >
        <SocialLink id="github-link" icon={iconGithub} href="https://github.com/brillout/vite-plugin-ssr" />
        <SocialLink id="discord-link" icon={iconDiscord} href="https://discord.gg/qTq92FQzKb" />
        <SocialLink id="twitter-link" icon={iconTwitter} href="https://twitter.com/brillout" />
      </div>
      <div style={{ marginTop: 10 }}>
        <code
          id="npm-init-code-snippet"
          aria-label="Click to copy"
          data-balloon-pos="left"
          style={{
            fontSize: '1.55em',
            padding: '10px 20px',
            whiteSpace: 'nowrap',
            borderRadius: 5,
            display: 'block',
            color: 'black',
            cursor: 'pointer'
          }}
          onClick={async () => {
            if (window.navigator.clipboard) {
              await window.navigator.clipboard.writeText('npm init vite-plugin-ssr@latest')
            }
            const el = document.getElementById('npm-init-code-snippet')!
            const attr = 'aria-label'
            const orignalText = el.getAttribute(attr)!
            el.setAttribute(attr, 'Copied')
            setTimeout(() => {
              el.setAttribute(attr, orignalText)
            }, 1200)
          }}
        >
          <div style={{ color: '#888' }}>
            <span style={{ color: '#bbb' }}>#</span> Scaffold a Vite SSR app
          </div>
          <div>
            <span style={{ color: '#bbb' }}>$</span> npm init vite-plugin-ssr
          </div>
        </code>
      </div>
      <Center>
        <a
          style={{ fontSize: '1.2em', textDecoration: 'underline', color: 'inherit', marginTop: 7 }}
          href="https://github.com/brillout/vite-plugin-ssr/blob/master/CHANGELOG.md"
        >
          Version 0.1.2
        </a>
      </Center>
    </div>
  )
}

function SocialLink({ id, icon, href }: { id: string; icon: string; href: string }) {
  return (
    <>
      <a
        id={id}
        className="social-link"
        href={href}
        style={{ padding: '5px 10px', display: 'inline-block', lineHeight: 0 }}
      >
        <img src={icon} height="28" style={{}} />
      </a>
    </>
  )
}

function Center({ children }: { children: any }) {
  return (
    <div
      style={{
        display: 'flex',
        //justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  )
}
