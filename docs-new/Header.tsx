import React from 'react'
import './Header.css'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import iconGithub from './icons/github.svg'
import iconTwitter from './icons/twitter.svg'
import iconDiscord from './icons/discord.svg'

export { Header }

function Header(props: {style: React.CSSProperties}) {
  return (
    <div
      style={{
        display: 'flex',
        ...props.style
      }}
    >
      <div style={{}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingBottom: 20,
            marginBottom: 10
          }}
        >
          {/*
        <img src={iconPlugin} height="128" style={{ marginRight: 20 }} />
            <h1 style={{ margin: 0, marginTop: 0, fontSize: '3.2em' }}>
              <code>vite-plugin-ssr</code>
            </h1>
         */}
            <h1 style={{fontSize: '1em', margin: 0}}>
              <code style={{ fontSize: '3.5em', padding: '10px 14px', borderRadius: 5 }}>vite-plugin-ssr</code>
            </h1>
        </div>
        <p style={{ fontSize: '2em', padding: 0, margin: 0 }}>
          Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin.
        </p>
      </div>
      <div>
        <div
          style={{
            whiteSpace: 'nowrap',
            //textAlign: 'right',
            textAlign: 'center',
              marginTop: 30
          }}
        >
          <SocialLink icon={iconGithub} href="https://github.com/brillout/vite-plugin-ssr" />
          <SocialLink icon={iconDiscord} href="https://discord.gg/qTq92FQzKb" />
          <SocialLink icon={iconTwitter} href="https://twitter.com/brillout" />
        </div>
        <div style={{marginTop: 10}}>
          <code
            style={{ fontSize: '1.55em', padding: '10px 20px', whiteSpace: 'nowrap', borderRight: 7, display: 'block' }}
          >
            $ npm init vite-plugin-ssr
          </code>
        </div>
        <Center><a style={{fontSize: '1.2em', textDecoration: 'underline', color: 'inherit', marginTop: 7}} href="https://github.com/brillout/vite-plugin-ssr/blob/master/CHANGELOG.md">Version 0.1.2</a></Center>
      </div>
    </div>
  )
}

function SocialLink({ icon, href }: { icon: string; href: string }) {
  return (
    <>
      <a className="social-link" href={href} style={{ padding: '5px 10px', display: 'inline-block', lineHeight: 0 }}>
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
