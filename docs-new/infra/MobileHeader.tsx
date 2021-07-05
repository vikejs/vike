import React from 'react'
import iconPlugin from '../icons/vite-plugin-ssr.svg'

export { MobileHeader }

function MobileHeader() {
  const LOGO_SIZE = 40
  const HEADER_HIGHT = 60
  return (
    <div
      id="mobile-header"
      style={{
        height: HEADER_HIGHT,
        width: '100vw',
        position: 'relative',
      }}
    >
      <div
      style={{
        position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          zIndex: 999,
        top: 0,
        left: 0,
        height: HEADER_HIGHT,
        width: '100vw',
          borderBottom: '1px solid #ddd',
      }}
      >
    <ButtonExpandMenu />
    <a
      href="/"
      style={{
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        textDecoration: 'none',
      }}
    >
      <img src={iconPlugin} height={LOGO_SIZE} width={LOGO_SIZE} />
      <code
        style={{
          backgroundColor: '#f4f4f4',
          borderRadius: 4,
          fontSize: '1.25em',
          padding: '2px 5px',
          marginLeft: 5
        }}
      >
        vite-plugin-ssr
      </code>
    </a>
    </div>
    </div>
  )
}

function ButtonExpandMenu (){
  return (
    <div style={{padding: 20, lineHeight: 0}}>
    <svg style={{width: 20}}className="icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"></path></svg>
    </div>
  )
}
