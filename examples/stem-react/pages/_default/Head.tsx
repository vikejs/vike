export { Head }

import React from 'react'
import logoUrl from './logo.svg'

const description = 'Playing with Vite and Stem'

function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <meta name="description" content={description} />
    </>
  )
}
