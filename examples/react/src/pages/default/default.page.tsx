import React from 'react'

export default Wrapper

function Wrapper(Page: () => JSX.Element, initialProps: Record<string, any>) {
  return (
    <>
      <div>Wrapped</div>
      <Page {...initialProps} />
    </>
  )
}
