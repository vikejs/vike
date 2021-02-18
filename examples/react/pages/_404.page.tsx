import React from 'react'

export default IndexPage

function IndexPage({ url }: { url: string }) {
  return (
    <>
      <h1>Not Found</h1>
      Nothing to be found at <code>{url}</code>.
    </>
  )
}
