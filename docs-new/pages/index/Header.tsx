import React from 'react'
import './Header.css'
import iconPlugin from '../_default/icons/vite-plugin-ssr.svg'
import iconReact from '../_default/icons/react.svg'
import iconVue from '../_default/icons/vue.svg'
import 'balloon-css'

export { Header }
export { MobileCallToAction }

function Header() {
  return (
    <>
      <div id="header">
        <LeftSide />
        <RightSide />
      </div>
      <HorizontalLine />
    </>
  )
}

function LeftSide() {
  return (
    <div id="header-left-side">
      <div
        id="header-logo"
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <img src={iconPlugin} />
        <h1>
          <code style={{ display: 'inline-block', padding: '0.2em 0.7em', borderRadius: 5 }}>vite-plugin-ssr</code>
        </h1>
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

function TourCallToAction({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <CallToActionDescription>
        Explore how it's like to use <code>vite-plugin-ssr</code>
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
    </div>
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
        Scaffold a Vite + <code>vite-plugin-ssr</code> app
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
          fontSize: '1.2em',
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

function MobileCallToAction() {
  return (
    <div id="mobile-call-to-action" style={{ marginTop: -50, marginBottom: 60 }}>
      <HorizontalLine />
      <TourCallToAction style={{ maxWidth: 400, padding: '0 10px', margin: 'auto', textAlign: 'center' }} />
    </div>
  )
}

function HorizontalLine() {
  return (
    <div className="header-separator-line" style={{ textAlign: 'center' }}>
      <hr
        style={{
          display: 'inline-block',
          margin: 0,
          border: 0,
          borderTop: '1px solid #eee',
          maxWidth: 500,
          width: '80%'
        }}
      />
    </div>
  )
}
