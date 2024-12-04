import React from 'react'
import './button.css'

export const Button = ({
  children,
  type,
  chevron,
  fullWidth,
  big
}: {
  children: React.ReactNode
  type: 'default' | 'secondary' | 'ghost' | 'text'
  chevron?: boolean
  fullWidth?: boolean
  big?: boolean
}) => {
  return (
    <div
      className={[
        type !== 'text' && 'landingpage-button',
        'landingpage-button-' + type,
        fullWidth && 'landingpage-button-fullWidth',
        big && 'landingpage-button-big'
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {chevron && (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      )}
    </div>
  )
}
