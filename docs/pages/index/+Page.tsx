export { Page }

import React from 'react'
import { Header } from './Header'
import { Features } from './features/Features'
import { Contributors, HorizontalLine, Link, Sponsors } from '@brillout/docpress'

function Page() {
  return (
    <>
      <GlobalNote>
        The <i>V1 design</i> is released, see <Link text="migration guide" href="/migration/v1-design" />.
      </GlobalNote>
      <GlobalNote>
        Vite-plugin-ssr has been renamed Vike, see <a href="https://vite-plugin-ssr.com/vike">migration guide</a>.
      </GlobalNote>
      <Header />
      <HorizontalLine primary={true} />
      <Features />
      <HorizontalLine />
      <Sponsors />
      <HorizontalLine />
      <a id="team"></a>
      <Contributors />
      <div style={{ height: 50 }} />
    </>
  )
}

function GlobalNote({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <blockquote style={{ marginTop: 0 }}>
          <p style={{ margin: 0 }}>{children}</p>
        </blockquote>
      </div>
    </>
  )
}
