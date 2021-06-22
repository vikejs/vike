import React from 'react'
import './Features.css'

export { Features }

function Features(props: { style: React.CSSProperties; styleLine: React.CSSProperties }) {
  return (
    <div id="features" style={props.style}>
      <HorizontalLine style={props.styleLine} />
      <div id="features-row-1">
        <div>
          <h2>🔧 Control</h2>
          <p>
            You control how pages are rendered and can use <b>any view framework</b> (React, Vue, ...) and{' '}
            <b>any tool</b> (Vuex/Redux, GraphQL, Service Workers, ...).
          </p>
          <p>
            Integrating tools is <b>simple & natural</b>.
          </p>
          <p>
            <a onClick={() => {}}>Tell me more...</a>
          </p>
        </div>
        <div>
          <h2>🦾 Full-fledged</h2>
          <p>
            <b>Filesystem Routing</b>,
            <b>Data fetching</b>, <b>pre-rendering</b> (<b>SSG</b>), <b>HMR</b>, <b>Server-side Routing</b> (for simple
            architecture) or <b>Client-side Routing</b> (for faster/animated page transitions).
          </p>
          <p>
            Render pages as <b>SPA</b>, <b>SSR</b>, or <b>Zero-JS HTML</b>.
          </p>
        </div>
        <div>
          <h2>🪨 Rock-solid</h2>
          Our source code has <b>no known bug</b> (new found ones are fixed promp&shy;tly).
          <p></p>
          <p>
            Every release is assailed against a heavy suite of <b>automated tests</b>.
          </p>
          <p>
            <b>Used in production</b> by many comp&shy;anies.
          </p>
          <p></p>
        </div>
      </div>
      <div id="features-row-2">
        <div>
          <h2>🌍 Deploy Anywhere</h2>
          <p>
            Use <b>any server environement</b> you want (Cloudflare Workers, EC2 instance, AWS lambda, Firebase,
            Express.js, Fastify, Hapi, ...).
          </p>
          <p>
            By <b>pre-rendering</b> your app you can deploy to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare
            Pages, ...).
          </p>
        </div>
        <div>
          <h2>⚡ Fast</h2>
          <p>
            <b>Browser-side code splitting</b>: each page loads only the code it needs. Lighthouse score of 100%.
          </p>
          <p>
            <b>Fast Node.js cold start</b>: your pages are lazy-loaded so that adding pages doesn't increase the cold
            start of your serverless functions.
          </p>
        </div>
        <div>
          <h2>🚀 Scalable</h2>
          <p>
            Scale to <b>thousands of files</b> with no hit on dev speed.
          </p>
          <p>
            <b>SSR architecture that scales</b> from small hobby projects to large-scale enterprise projects with highly{' '}
            <b>custom precise needs</b>.
          </p>
          <p>At (very large) scale, you can progressively start using Vite's native SSR API directly.</p>
        </div>
        <div>
          <h2>
            <span style={{ fontFamily: 'reset' }}>❤️</span> Craftmanship
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
        </div>
      </div>
      <HorizontalLine style={{ marginTop: 40, marginBottom: -40 }} />
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
