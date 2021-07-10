import React from 'react'
import './Features.css'
import iconChevron from '../../../frame/icons/chevron.svg'
import { assert } from '../../../utils'
import Control from './Control.mdx'
import DeployAnywhere from './DeployAnywhere.mdx'
import Scalable from './Scalable.mdx'
// import { updateSidePanelScroll } from '../SidePanel'

export { Features }

function Features() {
  return (
    <div id="features">
      <div className="features-primary-row">
        <Feature name="control" isExpandable={true} className="primary-feature">
          <h2>{String.fromCodePoint(0x1f527)} Control</h2>
          <p>
            Keep control over how your pages are rendered and use <b>any view framework</b> (React, Vue, Svelte, ...) and{' '}
            <b>any tool</b> you want (Vuex/Redux, GraphQL, Service Workers, ...).
          </p>
          <p>
            Integrating tools is <b>simple</b> and <b>natural</b>.
          </p>
        </Feature>
        <LearnMore name="control">
          <Control />
        </LearnMore>
        <Feature className="primary-feature">
          <h2>{String.fromCodePoint(0x1f9be)} Full-fledged</h2>
          <p>
            <b>Filesystem Routing</b>, <b>Data fetching</b>, <b>pre-rendering</b> (<b>SSG</b>), <b>HMR</b>.
          </p>
          <p>
            Choose between <b>Client-side Routing</b> (faster/animated page transitions) and <b>Server-side Routing</b>{' '}
            (simpler architecture).
          </p>
          <p>
            Render pages with <b>SSR</b>, as <b>SPA</b>, or to <b>HTML-only</b>.
          </p>
        </Feature>
        <Feature className="primary-feature">
          <h2>{String.fromCodePoint(0x1faa8)} Rock-solid</h2>
          <p>
            The source code of <code>vite-plugin-ssr</code> has <b>no known bug</b>.
          </p>
          <p>
            Every release is assailed against a heavy suite of <b>automated tests</b>.
          </p>
          <p>
            <b>Used in production</b> by many comp&shy;anies.
          </p>
          <p></p>
        </Feature>
      </div>
      <div className="features-secondary-row">
        <Feature name="deploy-anywhere" isExpandable={true} className="secondary-feature">
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
        <LearnMore name="deploy-anywhere">
          <DeployAnywhere />
        </LearnMore>
        <Feature className="secondary-feature">
          <h2>{String.fromCodePoint(0x26a1)} Fast</h2>
          <p>
            <b>Browser-side code splitting</b>: each page loads only the code it needs. Lighthouse score of 100%.
          </p>
          <p>
            <b>Fast Node.js cold start</b>: your pages are lazy-loaded so that adding pages doesn't increase the cold
            start of your serverless functions.
          </p>
        </Feature>
      </div>
      <div className="features-secondary-row">
        <Feature name="scalable" isExpandable={true} className="secondary-feature">
          <h2>{String.fromCodePoint(0x1f680)} Scalable</h2>
          <p>
            Scale to 100 kLOCs while keeping <b>fast HMR / dev speed</b>.
          </p>
          <p>
            <b>SSR architecture that scales</b> from small hobby projects to large-scale enterprise projects with highly{' '}
            custom needs.
          </p>
        </Feature>
        <LearnMore name="scalable">
          <Scalable />
        </LearnMore>
        <Feature className="secondary-feature">
          <h2>
            <span style={{ fontFamily: 'reset' }}>{String.fromCodePoint(0x2764)}</span> Craft
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
        </Feature>
      </div>
    </div>
  )
}

function Feature({
  children,
  name,
  isExpandable,
  className = ''
}: {
  className?: string
  name?: string
  isExpandable?: true
  children: any
}) {
  assert(!!name === !!isExpandable)
  return (
    <summary
      className={className + ' feature colorize-on-hover' + (name ? ' has-learn-more' : '')}
      id={name && `feature-${name}`}
      style={{ cursor: isExpandable && 'pointer' }}
    >
      {children}
      {isExpandable && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button
            type="button"
            style={{
              textAlign: 'center',
              padding: '0 7px',
              paddingTop: 3,
              paddingBottom: 1,
              display: 'inline-block',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}
          >
            <span className="decolorize-5">Learn more</span>
            <br />
            <img className="decolorize-4 chevron" src={iconChevron} height="7" style={{ marginTop: 2 }} />
          </button>
        </div>
      )}
    </summary>
  )
}
function LearnMore({ children, name }: { name: string; children: any }) {
  return (
    <aside style={{}} className="learn-more" id={`learn-more-${name}`}>
      {children}
    </aside>
  )
}
