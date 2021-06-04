import React from 'react'
import './Features.css'

export { Features }

function Features() {
  return (
    <div id="features">
      <div id="features-row-1">
        <div>
          <h2>🔧 Composable</h2>
          <p>
            You <b>control how pages are rendered</b> and you can not only use <b>any view framework</b> (React, Vue,
            ...) but really <b>any tool you want</b> (Vuex/Redux, GraphQL, Service Workers, ...).
          </p>
          <p>
            This render control enables you to <b>easily</b> and <b>naturally integrate tools</b>.
          </p>
        </div>
        <div>
          <h2>✨ Full-fledged</h2>
          <p>
            <b>Server-side Routing</b> (for a simple architecture) or <b>Client-side Routing</b> (for faster/animated
            page transitions), <b>data fetching</b>, <b>pre-rendering</b>.
          </p>
          <p>
            Render some pages as <b>SPA</b>, some with <b>SSR</b>, and some to <b>HTML-only</b>.
          </p>
        </div>
        <div>
          <h2>⛰️ Rock-solid</h2>
          <p>
            <b>Used in production</b> by many comp&shy;anies.
          </p>
          <b>No known bug</b> (bugs are fixed promp&shy;tly).
          <p></p>
          <p>
            Every release is assailed against a heavy suite of <b>automated tests</b>.
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
            You can <b>pre-render</b> your app and deploy to <b>any static host</b> (Netlify, GitHub Pages, Cloudflare
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
            SSR <b>architecture that scales</b> from small hobby projects to large-scale enterprise projects with highly{' '}
            <b>custom and precise needs</b>.
          </p>
        </div>
        <div>
          <h2>
            <span style={{ fontFamily: 'reset' }}>❤️</span> Craft
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
        </div>
      </div>
    </div>
  )
}
