import React from 'react'
export { Page }

import './index.css'

const Loading = () => <div>Loading</div>
function Page() {
  return (
    <>
      <h1>SSR</h1>
      <p>This page is:</p>
      <ul>
        <li>Rendered to HTML and hydrated in the browser.</li>
        <li>
          Interactive - only loaded on client: <ClientSideComponent />
        </li>
      </ul>
      <p className="colored ssr">Blue text.</p>
    </>
  )
}

function ClientSideComponent() {
  // We lazily load the client-side component
  const Counter = React.lazy(() => import('./Counter'))
  return (
    <React.Suspense fallback={<Loading />}>
      <Counter />
    </React.Suspense>
  )
}
