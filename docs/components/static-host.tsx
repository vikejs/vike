import React from 'react'

export { StaticHostDocIntro }
export { StaticHostDocOutro }

function StaticHostDocIntro({ staticHostLink }: { staticHostLink?: JSX.Element }) {
  return (
    <p>
      By <a href="/pre-rendering">pre-rendering</a> our pages, we can remove the need for a Node.js server. We can then
      deploy our app to any static host
      {staticHostLink}.
    </p>
  )
}
function StaticHostDocOutro({ baseUrlAddendum }: { baseUrlAddendum?: JSX.Element }) {
  return (
    <div>
      <p>
        If we don't deploy our app at the URL root <code>/</code>, we can{' '}
        <a href="/base-url">change our app's Base URL</a>.{baseUrlAddendum}
      </p>
      <p>In general, we can choose between following deploy strategies:</p>
      <ul>
        <li>
          We build locally and upload <code>dist/client/</code> to the static host.
        </li>
        <li>
          We let a <a href="https://github.com/features/actions">GitHub action</a> build and upload{' '}
          <code>dist/client/</code> to the static host.
        </li>
        <li>We let the static host run the build for us.</li>
      </ul>
      <blockquote>
        <p>
          The <code>$ vite build</code> command generates a directory <code>dist/client/</code> that contains all our
          static assets.
        </p>
        <p>
          {' '}
          We can locally try our deploy with <a href="https://www.npmjs.com/package/serve">serve</a> by running{' '}
          <code>$ serve dist/client/</code>.
        </p>
      </blockquote>
    </div>
  )
  /*
  return <>


    </>
    */
}
