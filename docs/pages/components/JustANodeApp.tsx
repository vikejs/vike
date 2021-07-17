import React from 'react'

export { JustANodeApp1 }
export { JustANodeApp2 }

function JustANodeApp1() {
  return (
    <p>
      From an architectural point of view, a <code>vite-plugin-ssr</code> app is simply a Node.js application.
    </p>
  )
}

function JustANodeApp2() {
  return (
    <>
      In production, a <code>vite-plugin-ssr</code> app is simply two server middlewares:{' '}
      <a href="https://github.com/brillout/vite-plugin-ssr/blob/37ca8cc0c7dfef55c0b816812b14cec384fa6a4b/boilerplates/boilerplate-react/server/index.js#L15">
        one middleware
      </a>{' '}
      that serves the static files living at <code>dist/client/</code>, and a{' '}
      <a href="https://github.com/brillout/vite-plugin-ssr/blob/37ca8cc0c7dfef55c0b816812b14cec384fa6a4b/boilerplates/boilerplate-react/server/index.js#L24-L31">
        second middleware
      </a>{' '}
      that server-side renders our pages.
    </>
  )
}
