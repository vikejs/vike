import React from 'react'
import { Button } from './Button/Button'

export const ParagraphTextCollection = ({
  title,
  description,
  icon,
  buttonLable
}: {
  title: string
  description: string
  buttonLable?: string
  icon: JSX.Element
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          color: '#000000',
          paddingBottom: '32px'
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
          minWidth: '240px'
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
          minWidth: '240px',
          paddingTop: '8px',
          paddingBottom: '4px'
        }}
      >
        {description}
      </p>
      {buttonLable && (
        <div
          style={{
            paddingTop: '18px'
          }}
        >
          <Button type="text" chevron>
            {buttonLable}
          </Button>
        </div>
      )}
    </div>
  )
}
