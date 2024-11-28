import React from 'react'
import './button.css'

export const Button = ({ children, type }: { children: React.ReactNode; type: 'default' | 'secondary' | 'ghost' }) => {
  const getStyles = (type: 'default' | 'secondary' | 'ghost'): string => {
    return ' ' + 'landingpage-button-' + type
  }

  return (
    <div
      style={{
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        width: 'fit-content'
      }}
      className={'landingpage-button' + getStyles(type)}
    >
      {children}
    </div>
  )
}
