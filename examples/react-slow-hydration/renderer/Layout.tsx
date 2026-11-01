export { Layout }

import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <a href="/">Home</a> <a href="/about">About</a>
      </nav>
      {children}
    </>
  )
}
