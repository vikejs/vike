export { ParagraphTextCollection }

import React from 'react'
import { ButtonLearnMore } from './button/Button'

const ParagraphTextCollection = ({
  title,
  description,
  icon,
  buttonLable,
}: {
  title: string
  description: string | React.JSX.Element
  buttonLable?: string
  icon: React.JSX.Element
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          color: '#000000',
          paddingBottom: 22,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          color: '#000000',
          fontWeight: '500',
          width: '100%',
          margin: 0,
          lineHeight: 1.5,
          minWidth: '240px',
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
          paddingBottom: '4px',
        }}
      >
        {description}
      </p>
      {buttonLable && (
        <div
          style={{
            paddingTop: '18px',
          }}
        >
          <ButtonLearnMore />
        </div>
      )}
    </div>
  )
}
