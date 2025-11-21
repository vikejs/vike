export default Page

import React from 'react'
import type { PreviousPageContext } from 'vike/types'

function Page({
  previousPageContexts,
  urlOriginal
}: {
  previousPageContexts: PreviousPageContext[],
  urlOriginal: string
}) {
  return (
    <div>
      <h1>Previous Page Contexts Test</h1>
      <p>Current URL: {urlOriginal}</p>
      <p>Previous Page Contexts Length: {previousPageContexts.length}</p>
      <div>
        <h2>Previous Page Contexts:</h2>
        {previousPageContexts.length === 0 ? (
          <p id="no-previous-contexts">No previous contexts - this page was accessed directly</p>
        ) : (
          <ol id="previous-contexts">
            {previousPageContexts.map((pageContext, index) => (
              <li key={index}>
                {pageContext.urlOriginal} ({pageContext._abortType || 'unknown'})
              </li>
            ))}
          </ol>
        )}
      </div>
      <div>
        <h2>Test Links:</h2>
        <ul>
          <li><a href="/redirect-to-chain">Single redirect to this page</a></li>
          <li><a href="/redirect-to-redirect-to-chain">Double redirect to this page</a></li>
          <li><a href="/rewrite-to-chain">Single rewrite to this page</a></li>
          <li><a href="/redirect-chain">Direct access (no redirects/rewrites)</a></li>
        </ul>
      </div>
    </div>
  )
}
