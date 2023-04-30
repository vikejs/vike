export { Page }

import type { Component } from 'solid-js'

const Page: Component<{ is404: boolean }> = ({ is404 }) => {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    )
  } else {
    return (
      <>
        <h1>500 Internal Error</h1>
        <p>Something went wrong.</p>
      </>
    )
  }
}
