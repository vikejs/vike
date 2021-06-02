import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'

export { Header }

function Header() {
  return (
    <Center>
      <a style={{ display: 'flex', paddingTop: 20, textDecoration: 'none', color: 'inherit' }} href="/">
        <img src={iconPlugin} height="128" style={{marginRight: 20}} />
        <div>
          <h1 style={{marginBottom: 10}}>
            <code>vite-plugin-ssr</code>
          </h1>
          {/*
          <div>Simple. Full-fledged. Do-One-Thing-Do-It-Well.</div>
          */}
          <div>Simple.</div>
          <div>Full-fledged.</div>
          <div>Do-One-Thing-Do-It-Well.</div>
        </div>
      </a>
    </Center>
  )
}

/*
 - Control
 - Simple
 - Rock Solid
 - Deploy Everywhere
 - Scalable
 - Fast
 - HMR
 - Made with <3
*/

function Center({children}) {
  return <div style={{display: 'flex', justifyContent: 'center'}}>
    {children}</div>
}
