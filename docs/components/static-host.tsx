export { StaticHostDocIntro }
export { StaticHostDocStrategies }
export { StaticHostDocOutro }

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
          Static hosts expect one <code>.html</code> file per URL. Consequently, you must pre-render <em>all</em> your
          pages, including SPA pages (the generated <code>.html</code> files of SPA pages have an empty{' '}
          <code>&lt;body&gt;</code>).
        </p>
      </blockquote>
    </>
  )
}
function StaticHostDocStrategies({ name = 'the static host' }: { name?: string }) {
  return (
    <>
      <p>In general, you can choose between the following strategies to build and deploy:</p>
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
          The <code>$ vike build</code> command generates a directory <code>dist/client/</code> which contains all
          static assets.
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
        You can try out your production build locally using{' '}
        <a href="https://vitejs.dev/guide/cli.html#vite-preview">
          <code>$ vike preview</code>
        </a>
        . (You can also use a local static host, for example{' '}
        <a href="https://www.npmjs.com/package/serve">
          <code>$ serve dist/client/</code>
        </a>
        ).
      </p>
      <blockquote>
        <p>
          If you want your app's URLs to start at <code>https://my-domain.com/some/path/**/*</code> (instead of the
          domain root <code>https://my-domain.com/**/*</code>),{' '}
          <a href="/base-url">
            change the Base URL to <code>/some/path/</code>
          </a>
          .
        </p>
        {baseUrlAddendum}
      </blockquote>
    </>
  )
}
