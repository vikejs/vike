import React from 'react'
import './Header.css'
import iconVike from '../../images/icons/vike-vertical.svg'
import iconReact from '../../images/icons/react.svg'
import iconVue from '../../images/icons/vue.svg'
import { HorizontalLine } from '@brillout/docpress'
import { CallToActionDescription, ScaffoldCallToAction } from './ScaffoldCallToAction'

export { Header }
export { MobileCallToAction }

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

function LeftSide() {
  return (
    <div id="header-left-side">
      <div id="header-logo">
        <img src={iconVike} />
        <div>
          <h1>Vike</h1>
          <p id="header-tagline">
            Next.js/Nuxtの様で、
            <br />
            一つのことをうまくやるViteプラグイン
          </p>
        </div>
      </div>
    </div>
  )
}

function RightSide() {
  return (
    <div id="header-right-side" style={{ marginLeft: 40, flexShrink: 0 }}>
      <CallToActionDescription style={{ marginTop: 0 }}>Vikeでappを立ち上げる</CallToActionDescription>
      <ScaffoldCallToAction />
      <div style={{ width: 1, height: 1, margin: 12 }} />
      <TourCallToAction />
    </div>
  )
}

function TourCallToAction({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <CallToActionDescription>Vikeの使い心地を体感する</CallToActionDescription>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginTop: 0,
          gridGap: 10,
          height: 50
        }}
      >
        <CallToAction href="/vue-tour" text="Vue ツアー" icon={iconVue} />
        <CallToAction href="/react-tour" text="React ツアー" icon={iconReact} />
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
