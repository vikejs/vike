import React from 'react'
import { TextBox } from '../components/TextBox'
import { SectionTextCollection } from '../components/SectionTextCollection'

const data = {
  caption: 'Features',
  title: 'A Core with all the Essentials.',
  descriptions: [
    'With Vike you have architectural freedom and you can choose any deployment strategy, any backend, any data-fetching tool, any UI library, and any render mode.'
  ]
}

export const Features = () => {
  return (
    <div
      style={{
        width: '50%',
        margin: '64px auto'
      }}
    >
      <TextBox>
        <SectionTextCollection caption={data.caption} title={data.title} descriptions={data.descriptions} />
      </TextBox>
    </div>
  )
}
