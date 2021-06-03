import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'

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
    <Center>
      <a
        style={{ display: 'flex', alignItems: 'center', paddingTop: 20, textDecoration: 'none', color: 'inherit' }}
        href="/"
      >
        <img src={iconPlugin} height="128" style={{ marginRight: 20 }} />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h1 style={{ margin: 0, marginTop: 0, fontSize: '2.7em' }}>
            <code>vite-plugin-ssr</code>
          </h1>
          <p style={{ fontSize: '1.45em', margin: 0, marginTop: '0.4em', opacity: 0.9, fontWeight: 500 }}>
            Add SSR to your Vite app
          </p>
          {/*
          <div>Simple. Full-fledged. Do-One-Thing-Do-It-Well.</div>
          <div>Simple.</div>
          <div>Full-fledged.</div>
          <div>Do-One-Thing-Do-It-Well.</div>
          */}
        </div>
      </a>
    </Center>
  )
}

function Center({ children }) {
  return <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
}
