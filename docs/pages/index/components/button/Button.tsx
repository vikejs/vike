export { Button }
export { ButtonLearnMore }

import React from 'react'
import './Button.css'

function Button({
  children,
  type,
  readingRecommendation,
  fullWidth,
  big
}: {
  children: React.ReactNode
  type: 'default' | 'secondary' | 'ghost'
  readingRecommendation?: boolean
  fullWidth?: boolean
  big?: boolean
}) {
  if (readingRecommendation) {
    children = (
      <>
        <span style={{ opacity: 0.6 }}>Read Why Vike: </span>
        <span style={{ fontWeight: 500 }}>{children}</span>
      </>
    )
  }
  return (
    <div
      className={[
        'landingpage-button',
        'landingpage-button-' + type,
        fullWidth && 'landingpage-button-fullWidth',
        big && 'landingpage-button-big'
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

function ButtonLearnMore() {
  return (
    <div className="landingpage-button-learnmore">
      Learn More
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
        <path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </div>
  )
}
