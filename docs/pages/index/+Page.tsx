export { Page }

import React from 'react'
import { Header } from './Header'
import { Features } from './Features'
import { Contributors, Sponsors } from '@brillout/docpress'

function Page() {
  return (
    <>
      <Header />
      <Features />
      <BlockWrapper>
        <Sponsors />
      </BlockWrapper>
      <a id="team"></a>
      <BlockWrapper>
        <Contributors />
        <div style={{ height: 50 }} />
      </BlockWrapper>
    </>
  )
}

function BlockWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 20,
        marginTop: 'var(--block-margin)'
      }}
    >
      <div style={{ maxWidth: 1000 }}>
        {/* TODO/refactor: remove this margin buster */}
        <span>&nbsp;</span>
        {children}
      </div>
    </div>
  )
}
