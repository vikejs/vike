import React from 'react'

export const ParagraphTextCollection = ({
  title,
  description,
  icon
}: {
  title: string
  description: string
  icon: JSX.Element
}) => {
  return (
    <div>
      <div
        style={{
          color: '#000000',
          paddingBottom: '16px'
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: '16px',
          color: '#000000',
          fontWeight: '500',
          width: '100%',
          margin: 0,
          lineHeight: 1.5,
          maxWidth: '240px'
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: '#000000A0',
          fontWeight: '400',
          width: '100%',
          margin: 0,
          lineHeight: 1.5,
          maxWidth: '240px',
          paddingTop: '8px',
          paddingBottom: '4px'
        }}
      >
        {description}
      </p>
    </div>
  )
}
