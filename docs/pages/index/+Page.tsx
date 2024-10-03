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
      <Block>
        <Sponsors />
      </Block>
      <a id="team"></a>
      <Block>
        <Contributors />
        <div style={{ height: 50 }} />
      </Block>
    </>
  )
}

function Block({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </div>
  )
}
