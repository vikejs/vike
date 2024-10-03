export { Features }

import React from 'react'
import './Features.css'

function Features() {
  return (
    <div id="feature-list">
      <h2>Flexible</h2>
      <h3>Any tool</h3>
      <p>
        Use:
        <ul>
          <li>any UI framework (React/Vue/Solid/...)</li>
          <li>any rendering strategy (SPA, SSR, SSG, ...)</li>
          <li>any data fetching (RPC, REST, GraphQL, ...)</li>
          <li>any server (Express.js/Hono/Fastify/...) </li>
          <li>any deployment (VPS, Serverless, Static, ...)</li>
        </ul>
      </p>
      <h3>Any integration</h3>
      <h3>Less blockers</h3>
    </div>
  )
}
