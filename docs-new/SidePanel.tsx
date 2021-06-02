import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'

export { SidePanel }

function SidePanel() {
  return (
    <>
      <Header />
      <Navigation />
    </>
  )
}

function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={iconPlugin} height="64" width="64" />
      <code style={{ backgroundColor: '#eee', borderRadius: 5, fontSize: '1.5em', padding: '7px 5px', marginLeft: 10 }}>
        vite-plugin-ssr
      </code>
    </div>
  )
}

function Navigation() {
  return (
    <>
      <NavItem>Introduction</NavItem>
      <NavItem>Get Started</NavItem>
      <NavItem>Guides</NavItem>
      <NavItem>API</NavItem>
    </>
  )
}

function NavItem({ children }) {
  return (
    <div>
      <a>{children}</a>
    </div>
  )
}
