import React from 'react'
import './Features.css'

export { Features }

function Features() {
  return (
    <div id="features">
      <div>
        <h2>🔧 Composable</h2>
        <p>
          You <b>control how pages are rendered</b> and you can use not only <b>any view framework</b> (React, Vue, ...) but really <b>any tool</b> you want (Vuex/Redux, Apollo GraphQL, Service Workers, ...).
        </p>
        <p>Say goodbye to framework lock-in.</p>
      </div>
      <div>
        <h2>✨ Simple</h2>
        <p>Simple design resulting in a tool that is a joy to use.</p>
        <p>
          Render some pages as SPA, some with SSR, and some to HTML-only (zero/minimal browser-side JavaScript).
        </p>
      </div>
      <div>
        <h2>⛰️ Rock-solid</h2>
        <p>
          Used in production at many companies with <b>no known bug</b>.
          Any bug you may encounter will be <b>promptly fixed</b>.
        </p>
        <p>
          Every release is assailed against a <b>heavy suite of automated tests</b>.
        </p>
      </div>
      <div>
        <h2>🌍 Deploy Anywhere</h2>
        <p>
          <b>Use any server environement</b> you want (Cloudflare Workers, EC2 instance, AWS lambda, Firebase,
          Express.js, Fastify, Koa, ...).
        </p>
        <p>
          Thanks to <b>pre-rendering</b> deploy to <b>any static host</b> you want (Netlify, GitHub Pages, Cloudflare
          Pages, ...).
        </p>
      </div>
      <div>
        <h2>🚀 Scalable</h2>
        <p>Scale to <b>thousands of files</b> with no hit on dev speed (thanks to Vite's lazy transpiling)</p>
        <p>SSR <b>architecture that scales</b> from small hobby projects to large-scale enterprise projects with highly <b>custom and precise needs</b>.</p>
      </div>
      <div>
        <h2>⚡ Fast</h2>
      </div>
      <div>
        <h2>🔥 HMR</h2>
      </div>
      <div>
        <h2>
          <span style={{ fontFamily: 'reset' }}>❤️</span> Craftmanship
        </h2>
        <p>
          Crafted with <b>attention to details</b> and a <b>care for simplicity</b>.
        </p>
        <p>
          <b>Regular upsteam contributions</b> to Vite and others.
        </p>
        <p>
          GitHub and Discord <b>conversations are welcome</b>.
        </p>
      </div>
    </div>
  )
}
