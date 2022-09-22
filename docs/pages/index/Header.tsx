import React from 'react'
import './Header.css'
import iconPlugin from '../../images/icons/vite-plugin-ssr.svg'
import iconReact from '../../images/icons/react.svg'
import iconVue from '../../images/icons/vue.svg'
import { HorizontalLine } from '@brillout/docpress'
import { CallToActionDescription, ScaffoldCallToAction } from './ScaffoldCallToAction'

export { Header }
export { MobileCallToAction }

// For `/banner`
export { Logo }
export { Title }
//export { Tagline }

function Header() {
  return (
    <>
      <div id="header">
        <LeftSide />
        <RightSide />
      </div>
    </>
  )
}

function Logo() {
  return <img src={iconPlugin} />
}
function Title() {
  return <code style={{ display: 'inline-block', padding: '0.17em 0.6em', borderRadius: 5 }}>vite-plugin-ssr</code>
}
function Tagline() {
  return <p id="header-tagline">Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin.</p>
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
        <Logo />
        <h1>
          <Title />
        </h1>
      </div>
      <Tagline />
    </div>
  )
}

function RightSide() {
  return (
    <div id="header-right-side" style={{ marginLeft: 40 }}>
      <CallToActionDescription style={{ marginTop: 0 }}>
        Scaffold a new Vite + <code>vite-plugin-ssr</code> app
      </CallToActionDescription>
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
        Explore how it's like to use <code style={{ whiteSpace: 'nowrap' }}>vite-plugin-ssr</code>
      </CallToActionDescription>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginTop: 0,
          gridGap: 10,
          height: 50
        }}
      >
        <CallToAction href="/vue-tour" text="Vue Tour" icon={iconVue} />
        <CallToAction href="/react-tour" text="React Tour" icon={iconReact} />
      </div>
    </div>
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
    <div id="mobile-call-to-action">
      <HorizontalLine />
      <div style={{ height: 10 }} />
      <TourCallToAction style={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }} />
    </div>
  )
}
