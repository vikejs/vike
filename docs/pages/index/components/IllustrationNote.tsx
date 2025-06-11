export { IllustrationNote }

import React from 'react'

function IllustrationNote({
  className,
  click,
  children,
  style,
}: { className?: string; click?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const iconMouse = click && (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11 21L4 4l17 7l-6.265 2.685a2 2 0 0 0-1.05 1.05z"
      />
    </svg>
  )
  return (
    <div
      className={className}
      style={{
        opacity: 0.6,
        textAlign: 'center',
        ...style,
      }}
    >
      {iconMouse}
      <p
        style={{
          fontSize: '14px',
        }}
      >
        {children}
      </p>
    </div>
  )
}
