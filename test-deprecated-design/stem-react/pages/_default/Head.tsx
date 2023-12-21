export { Head }

import React from 'react'
import logoUrl from './logo.svg'

const description = 'My first Vite/Stem app'

function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <meta name="description" content={description} />
    </>
  )
}
