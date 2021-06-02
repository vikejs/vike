import React from 'react'
import iconPlugin from './icons/vite-plugin-ssr.svg'
import './SidePanel.css'

export { SidePanel }

function SidePanel() {
  return (
    <>
      <SideHeader />
      <Navigation />
    </>
  )
}

function SideHeader() {
  const SIZE = 50
  return (
    <a style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', padding: 20 }} href="/">
      <img src={iconPlugin} height={SIZE} width={SIZE} />
      <code
        style={{ backgroundColor: '#f4f4f4', borderRadius: 4, fontSize: '1.35em', padding: '2px 5px', marginLeft: 10 }}
      >
        vite-plugin-ssr
      </code>
    </a>
  )
}

function Navigation() {
  return (
    <div style={{marginTop: 0}}>
      <NavItem>Introduction</NavItem>
      <NavItem>Table of Contents</NavItem>
      <NavItem>Get Started</NavItem>
      <NavItem>Guides</NavItem>
      <NavItem>API</NavItem>
  </div>
  )
}

function NavItem({ children }) {
  return (
    <a
      style={{
        fontSize: '14.4px',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.15ch',
        color: '#323d48',
        padding: '15px 4px 15px 40px',
        display: 'block',
        textDecoration: 'none'
      }}
      href="/"
    >
      {children}
    </a>
  )
}
