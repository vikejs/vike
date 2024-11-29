import React from 'react'
import { TextBox } from '../components/TextBox'
import { SectionTextCollection } from '../components/SectionTextCollection'
import { Chip } from '../components/Chip/Chip'

const data = {
  caption: 'Features',
  title: 'Core, all-included.'
}

export const Features = () => {
  return (
    <div
      style={{
        width: '100%',
        margin: '120px 0'
      }}
    >
      <div
        style={{
          width: '50%',
          margin: '0 auto'
        }}
      >
        <TextBox>
          <SectionTextCollection caption={data.caption} title={data.title} />
        </TextBox>
      </div>
      <Chip />
    </div>
  )
}
