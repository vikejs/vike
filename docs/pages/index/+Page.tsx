export { Page }

import React, { useEffect } from 'react'
import { Header } from './Header'
import { Features } from './Features'
import { Contributors, Sponsors } from '@brillout/docpress'
import './smooth-scroll.css'

function Page() {
  useEffect(() => {
    const cl = document.documentElement.classList
    const cls = 'scroll-behavior-smooth'
    cl.add(cls)
    return () => cl.remove(cls)
  })
  return (
    <>
      <Header />
      <Features />
      <Block>
        <div style={{ height: 60 }} />
        <Sponsors />
        <div style={{ height: 20 }} />
      </Block>
      <a id="team"></a>
      <Block>
        <div style={{ height: 40 }} />
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
      <div style={{ maxWidth: 1000 }}>{children}</div>
    </div>
  )
}
