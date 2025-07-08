export { StaticHostDocIntro }
export { StaticHostDocStrategies }
export { StaticHostDocOutro }

import { Link } from '@brillout/docpress'
import React from 'react'

function StaticHostDocIntro({ staticHostLink }: { staticHostLink?: React.JSX.Element }) {
  return (
    <>
      <p>
        By <a href="/pre-rendering">pre-rendering</a> your pages, you can remove the need for a production server. You
        can then deploy your app to any static host
        {staticHostLink}.
      </p>
      <blockquote>
        <p>
          Static hosts always expect one <code>.html</code> file per URL. This means you need to pre-render <em>all</em>{' '}
          your pages, regardless of <Link text="render mode" href="/render-modes" />. For example, if you have SPA
          pages, then you also need to pre-render them which will generate <code>.html</code> files with an empty{' '}
          <code>&lt;body&gt;</code>.
        </p>
      </blockquote>
    </>
  )
}
function StaticHostDocStrategies({ name = 'the static host' }: { name?: string }) {
  return (
    <>
      <p>You can choose between following deploy strategies:</p>
      <ul>
        <li>
          Build locally and upload <code>dist/client/</code> to {name}.
        </li>
        <li>
          Let a <a href="https://github.com/features/actions">GitHub action</a> build and upload{' '}
          <code>dist/client/</code> to {name}.
        </li>
        <li>Let {name} build your app.</li>
      </ul>
      <blockquote>
        <p>
          The <code>$ vike build</code> command generates <code>dist/client/</code> containing all static assets.
        </p>
      </blockquote>
    </>
  )
}
function StaticHostDocOutro({ baseUrlAddendum }: { baseUrlAddendum?: React.JSX.Element }) {
  return (
    <>
      <p>
        {' '}
        You can try out your production build locally with{' '}
        <a href="https://vitejs.dev/guide/cli.html#vite-preview">
          <code>$ vike preview</code>
        </a>
        , or any other tool such as{' '}
        <a href="https://www.npmjs.com/package/serve">
          <code>$ serve dist/client/</code>
        </a>
        .
      </p>
      <blockquote>
        <p>
          If you don't deploy your app at your domain root <code>https://my-domain.com</code>, but at{' '}
          <code>https://my-domain.com/somewhere/nested</code> instead, then{' '}
          <a href="/base-url">change your app's Base URL</a>.{baseUrlAddendum}
        </p>
      </blockquote>
    </>
  )
}
