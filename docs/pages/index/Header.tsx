import React from 'react'
import './HeaderLayout.css'
import iconVike from '../../images/icons/vike-nitedani_169x230.png'
import { navigate } from 'vike/client/router'
import { getFeatureId } from './getFeatureId'

export { Header }

function Header() {
  return (
    <div
      id="header-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'var(--bg-color)'
      }}
    >
      <a
        href="/"
        style={{
          height: 230,
          marginRight: 16,
          marginTop: -11
        }}
      >
        <img
          src={iconVike}
          onContextMenu={(ev) => {
            navigate('/press#logo')
            ev.preventDefault()
          }}
        />
      </a>
      <div>
        <h1
          style={{
            margin: 0,
            lineHeight: '1.1em',
            marginBottom: 8
          }}
        >
          Next Generation
          <br />
          Frontend Framework
        </h1>
        <p
          id="header-tagline"
          style={{
            padding: 0,
            margin: 0,
            marginTop: 14,
            maxWidth: 550
          }}
        >
          {/* &#8288; for non-breaking hyphen */}
          Next.js/Nuxt alternative. <FeatureName>Flexible</FeatureName>, <FeatureName>reliable</FeatureName>,{' '}
          <FeatureName>fast</FeatureName>, <FeatureName>clutter&#8288;-&#8288;free</FeatureName>,{' '}
          <FeatureName>community&#8288;-&#8288;driven</FeatureName>.
        </p>
      </div>
    </div>
  )
}

function FeatureName({ children }: { children: string }) {
  const featureId = getFeatureId(
    children
      // Remove &#8288;
      .replace(/\u2060/g, '')
  )
  return (
    <a
      style={{
        color: 'inherit',
        textDecoration: 'underline',
        textUnderlineOffset: '0.14em',
        textDecorationThickness: 2,
        textDecorationColor: `var(--color-${featureId}`
      }}
      href={`#${featureId}`}
    >
      {children}
    </a>
  )
}
