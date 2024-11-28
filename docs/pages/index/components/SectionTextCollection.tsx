import React from 'react'
import { primaryColor } from '../+Page'

export const SectionTextCollection = ({
  caption,
  title,
  descriptions,
  actions
}: {
  caption: string
  title: string
  descriptions?: string[]
  actions?: JSX.Element[]
}) => {
  return (
    <div
      style={{
        maxWidth: '400px'
      }}
    >
      <p
        style={{
          color: primaryColor,
          fontSize: '18px'
        }}
      >
        {caption}
      </p>
      <h2
        style={{
          fontSize: '38px',
          color: '#000000',
          fontWeight: '400',
          width: '100%',
          margin: 0,
          lineHeight: 1.3,
          maxWidth: '240px',
          paddingBottom: '16px'
        }}
      >
        {title}
      </h2>
      {descriptions &&
        descriptions.map((text, i) => (
          <p
            key={i}
            style={{
              fontSize: '16px'
            }}
          >
            {text}
          </p>
        ))}
    </div>
  )
}
