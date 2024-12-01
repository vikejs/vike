import React from 'react'
import { primaryColor } from '../+Page'

export const SectionTextCollection = ({
  caption,
  title,
  descriptions,
  actions,
  style
}: {
  caption: string
  title: string
  descriptions?: string[]
  actions?: JSX.Element[]
  style?: React.CSSProperties
}) => {
  return (
    <div
      style={{
        ...style
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
          color: '#000000',
          width: '100%',
          margin: 0,
          lineHeight: 1.3,
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
              fontSize: '16px',
              lineHeight: 1.5
            }}
          >
            {text}
          </p>
        ))}
    </div>
  )
}
