import React from 'react'

const location = window.document.location

export default function ClientOnlyComponent() {
  // Will be printed only in the browser:
  console.log('Rendering the ClientOnlyComponent')

  return (
    <div style={{ background: '#eee' }}>
      <div>Only loaded in the browser</div>
      <div>window.location.href: {location.href}</div>
    </div>
  )
}
