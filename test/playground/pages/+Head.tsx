export { Head }

import React from 'react'
import favicon from './logo.svg'

function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href={favicon} />
    </>
  )
}
