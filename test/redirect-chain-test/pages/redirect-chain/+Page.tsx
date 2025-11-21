export default Page

import React from 'react'

function Page({ isRedirect, urlOriginal }: { isRedirect: string[], urlOriginal: string }) {
  return (
    <div>
      <h1>Redirect Chain Test</h1>
      <p>Current URL: {urlOriginal}</p>
      <p>Redirect Chain Length: {isRedirect.length}</p>
      <div>
        <h2>Redirect Chain:</h2>
        {isRedirect.length === 0 ? (
          <p id="no-redirects">No redirects - this page was accessed directly</p>
        ) : (
          <ol id="redirect-chain">
            {isRedirect.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ol>
        )}
      </div>
      <div>
        <h2>Test Links:</h2>
        <ul>
          <li><a href="/redirect-to-chain">Single redirect to this page</a></li>
          <li><a href="/redirect-to-redirect-to-chain">Double redirect to this page</a></li>
          <li><a href="/redirect-chain">Direct access (no redirects)</a></li>
        </ul>
      </div>
    </div>
  )
}
