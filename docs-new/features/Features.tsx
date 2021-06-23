import React from 'react'
import './Features.css'
import iconChevron from '../icons/chevron.svg'
import { assert } from '../utils'
import Control from './Control.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'

export { Features }

function Features(props: {
  style: React.CSSProperties
  styleLineTop: React.CSSProperties
  styleLineBottom: React.CSSProperties
}) {
  return (
    <div id="features" style={props.style}>
      <HorizontalLine style={props.styleLineTop} />
      <div id="features-row-1">
        <Feature name="control">
          <h2>{String.fromCodePoint(0x1f527)} Control</h2>
          <p>
            You control how your pages are rendered; you can use <b>any view framework</b> (React, Vue, ...) and{' '}
            <b>any tool</b> (Vuex/Redux, GraphQL, Service Workers, ...) you want.
          </p>
          <p>
            Integrating tools is <b>simple & natural</b>.
          </p>
        </Feature>
        <Feature name="full-fledged">
          <h2>{String.fromCodePoint(0x1f9be)} Full-fledged</h2>
          <p>
            <b>Filesystem Routing</b>, <b>Data fetching</b>, <b>pre-rendering</b> (<b>SSG</b>), <b>HMR</b>,{' '}
            <b>Client-side Routing</b> (faster/animated page transitions) or <b>Server-side Routing</b> (simple
            architecture).
          </p>
          <p>
            Render pages as <b>SPA</b>, <b>SSR</b>, or <b>Zero-JS HTML</b>.
          </p>
        </Feature>
        <Feature name="rock-solid">
          <h2>{String.fromCodePoint(0x1faa8)} Rock-solid</h2>
          Our source code has <b>no known bug</b> (new found ones are fixed promp&shy;tly).
          <p></p>
          <p>
            Every release is assailed against a heavy suite of <b>automated tests</b>.
          </p>
          <p>
            <b>Used in production</b> by many comp&shy;anies.
          </p>
          <p></p>
        </Feature>
      </div>
      <LearnMore name="control">
        <Control/>
      </LearnMore>
      <LearnMore name="full-fledged">Blu</LearnMore>
      <LearnMore name="rock-solid">Blo</LearnMore>
      <div id="features-row-2">
        <Feature name="deploy-anywhere">
          <h2>{String.fromCodePoint(0x1f30d)} Deploy Anywhere</h2>
          <p>
            Use <b>any server environement</b> you want (Cloudflare Workers, EC2 instance, AWS lambda, Firebase,
            Express.js, Fastify, Hapi, ...).
          </p>
          <p>
            <b>Pre-render</b> your app and deploy to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare Pages,
            ...).
          </p>
        </Feature>
        <Feature name="fast">
          <h2>{String.fromCodePoint(0x26a1)} Fast</h2>
          <p>
            <b>Browser-side code splitting</b>: each page loads only the code it needs. Lighthouse score of 100%.
          </p>
          <p>
            <b>Fast Node.js cold start</b>: your pages are lazy-loaded so that adding pages doesn't increase the cold
            start of your serverless functions.
          </p>
        </Feature>
        <Feature name="scalable">
          <h2>{String.fromCodePoint(0x1f680)} Scalable</h2>
          <p>
            Scale to <b>thousands of files</b> with no hit on dev speed.
          </p>
          <p>
            <b>SSR architecture that scales</b> from small hobby projects to large-scale enterprise projects with highly{' '}
            <b>custom precise needs</b>.
          </p>
          <p>At (very large) scale, you can progressively start using Vite's native SSR API directly.</p>
        </Feature>
        <Feature name="craftmanship">
          <h2>
            <span style={{ fontFamily: 'reset' }}>{String.fromCodePoint(0x2764)}</span> Craftmanship
          </h2>
          <p>
            Crafted with <b>attention to details</b> and <b>care for simplicity</b>.
          </p>
          <p>
            <b>Upsteam contributions</b> to Vite and others.
          </p>
          <p>
            GitHub and Discord <b>conversations are welcome</b>.
          </p>
          <p>
            Our unique goal: using <code>vite-plugin-ssr</code> should be fun.
          </p>
        </Feature>
      </div>
      <LearnMore name="deploy-anywhere">
        <DeployAnywhere/>
      </LearnMore>
      <HorizontalLine style={props.styleLineBottom} />
    </div>
  )
}

function Feature({ children, name }: { name: string; children: any }) {
  return (
    <div className="feature" id={`feature-${name}`} onClick={onClick}>
      {children}
      <div style={{ textAlign: 'center' }}>
        <img src={iconChevron} height="12" style={{ marginRight: 20 }} />
      </div>
    </div>
  )

  function onClick() {
    const selected = 'selected'
    const learnId = 'learn-more-' + name
    const featureId = 'feature-' + name
    const learnEl = document.getElementById(learnId)
    assert(learnEl)
    const learnEls: HTMLElement[] = [
      ...(document.querySelectorAll('.learn-more') as any),
      ...(document.querySelectorAll('.feature') as any)
    ]
    learnEls.forEach((el) => {
      if (el.id === learnId || el.id === featureId) {
        el.classList.toggle(selected)
      } else {
        el.classList.remove(selected)
      }
    })
  }
}
function LearnMore({ children, name }: { name: string; children: any }) {
  return (
    <div style={{}} className="learn-more" id={`learn-more-${name}`}>
      {children}
    </div>
  )
}

function HorizontalLine(props: { style?: React.CSSProperties }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <hr
        style={{
          display: 'inline-block',
          margin: 0,
          border: 0,
          borderTop: '1px solid #eee',
          width: 500,
          ...props.style
        }}
      />
    </div>
  )
}
