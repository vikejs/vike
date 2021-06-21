import React from 'react'
import './Header.css'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import iconGithub from './icons/github.svg'
import iconTwitter from './icons/twitter.svg'
import iconDiscord from './icons/discord.svg'

export { Header }

function HeaderNew() {
  return (
    <>
      <h1>
        <code>vite-plugin-ssr</code>
      </h1>
      <p>Add SSR to your Vite app, with a similar </p>
    </>
  )
}

function Header() {
  return (
    <div
        style={{
      padding: '30px 70px',
          display: 'flex',
        }}
  >
    <div style={{
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 20,
          marginBottom: 10
        }}
      >
        {/*
         */}
        <img src={iconPlugin} height="128" style={{ marginRight: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ margin: 0, marginTop: 0, fontSize: '2.7em' }}>
            <code>vite-plugin-ssr</code>
          </h1>
          {/*
          <p style={{ fontSize: '1.45em', margin: 0, marginTop: '0.1em', opacity: 0.9, fontWeight: 500 }}>
            Add SSR to your Vite app
          </p>
          <div>Simple. Full-fledged. Do-One-Thing-Do-It-Well.</div>
          <div>Simple.</div>
          <div>Full-fledged.</div>
          <div>Do-One-Thing-Do-It-Well.</div>
          */}
        </div>
      </div>
      <p style={{ fontSize: '2em', padding: 0, margin: 0 }}>
        Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin.
      </p>
    </div>
    <div style={{
      'whiteSpace': 'nowrap'
    }}>
      <SocialLink icon={iconGithub} href="https://github.com/brillout/vite-plugin-ssr" />
      <SocialLink icon={iconDiscord} href="https://discord.gg/qTq92FQzKb" />
      <SocialLink icon={iconTwitter} href="https://twitter.com/brillout" />
    </div>
    </div>
  )
}

function SocialLink({icon, href}: {icon: string, href: string}) {
  return (
    <>
      <a className='social-link' href={href} style={{padding: '5px 10px', display: 'inline-block', lineHeight: 0}}>
        <img src={icon} height="24" style={{}} />
    </a>
    </>
  )
}

function Center({ children }: { children: JSX.Element }) {
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
