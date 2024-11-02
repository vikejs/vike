export { TopNavigation }

import React from 'react'

function TopNavigation() {
  return (
    <a
      className="colorize-on-hover"
      href="/new"
      style={{
        color: 'inherit',
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '0 var(--padding-side)'
      }}
    >
      <span
        className="decolorize-7"
        style={{ height: 23, marginRight: 8, fontFamily: 'emoji', position: 'relative', top: -2 }}
      >
        🌱
      </span>{' '}
      Get Started
    </a>
  )
}
