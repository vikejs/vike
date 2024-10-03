import React from 'react'
import './Header.css'
import iconVike from '../../images/icons/vike-nitedani_169x230.png'

export { Header }

function Header() {
  return (
    <div id="header-logo">
      <img src={iconVike} />
      <div>
        <h1>
          Next Generation
          <br />
          Frontend Framework
        </h1>
        <p id="header-tagline">
          {/* &#8288; for non-breaking hyphen */}
          Next.js/Nuxt alternative. Flexible, reliable, fast, clutter&#8288;-&#8288;free,
          community&#8288;-&#8288;driven.
        </p>
      </div>
    </div>
  )
}
