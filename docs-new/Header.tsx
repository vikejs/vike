import React from 'react'
import './Header.css'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import iconReact from './icons/react.svg'
import iconVue from './icons/vue.svg'
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
        id="header-logo"
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <img src={iconPlugin} />
        <h1>
          <code style={{ display: 'inline-block', fontSize: '3em', padding: '10px 14px', borderRadius: 5 }}>
            vite-plugin-ssr
          </code>
        </h1>
        {/*
          <h1 style={{ fontSize: '1em', margin: 0 }}>
            <code style={{ fontSize: '3.5em', padding: '10px 14px', borderRadius: 5 }}>vite-plugin-ssr</code>
          </h1>
         */}
      </div>
      <p id="header-tagline">Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin.</p>
    </div>
  )
}

function RightSide() {
  return (
    <div id="header-right-side" style={{ marginLeft: 40 }}>
      <ScaffoldCallToAction />
      <div style={{ width: 1, height: 1, margin: 12 }} />
      <TourCallToAction />
    </div>
  )
}

function TourCallToAction() {
  return (
    <>
      <CallToActionDescription>
        Explore how it's like to use <code>vite-plugin-ssr</code>.
      </CallToActionDescription>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginTop: 0,
          gridGap: 20,
          height: 50
        }}
      >
        <CallToAction href="/vue-tour" text="Vue Tour" icon={iconVue} />
        <CallToAction href="/react-tour" text="React Tour" icon={iconReact} />
      </div>
    </>
  )
}

function CallToActionDescription({
  children,
  style
}: {
  style?: React.CSSProperties
  children: (string | JSX.Element)[]
}) {
  return <p style={{ marginBottom: 5, color: 'inherit', opacity: 0.7, fontSize: '0.92em', ...style }}>{children}</p>
}

function ScaffoldCallToAction() {
  return (
    <>
      <CallToActionDescription style={{ marginTop: 0 }}>
        Scaffold a Vite + <code>vite-plugin-ssr</code> app.
      </CallToActionDescription>
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
      >
        {/*
          <div style={{ color: '#888' }}>
            <span style={{ color: '#bbb' }}>#</span> Scaffold a Vite SSR app
          </div>
          */}
        <div>
          <span style={{ color: '#bbb' }}>$</span> npm init vite-plugin-ssr
        </div>
      </code>
    </>
  )
}

function CallToAction({ href, text, icon }: { href: string; text: string; icon: string }) {
  return (
    <a href={href}>
      <button
        type="button"
        style={{
          width: '100%',
          height: '100%',
          fontSize: '1.3em',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img src={icon} style={{ height: 30, marginRight: 5 }} />
        {text}
      </button>
    </a>
  )
}

/*
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
*/
