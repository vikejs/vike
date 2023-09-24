import React from 'react'
import { Header, MobileCallToAction } from './Header'
import { Features } from './features/Features'
import { HorizontalLine, Sponsors } from '@brillout/docpress'

export { Page }

function Page() {
  return (
    <>
      <GlobalNoteRename />
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <MobileCallToAction />
      <HorizontalLine />
      <Sponsors />
      <div style={{ height: 50 }} />
    </>
  )
}

function GlobalNoteRename() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <blockquote>
          <p>
            <a href="https://vite-plugin-ssr.com"></a>
            <code>vite-plugin-ssr</code> has been renamed Vike, see{' '}
            <a href="https://vite-plugin-ssr.com/vike">migration guide</a>.
          </p>
        </blockquote>
      </div>
    </>
  )
}
