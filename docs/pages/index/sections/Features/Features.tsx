import React from 'react'
import { TextBox } from '../../components/TextBox'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Chip } from '../../components/Chip/Chip'
import './features.css'

const data = {
  caption: 'Features',
  title: 'Core. All-included.'
}

export const Features = () => {
  return (
    <div className="landingpage-features-container">
      <div className="landingpage-features-textContainer">
        <TextBox>
          <SectionTextCollection
            caption={data.caption}
            title={data.title}
            descriptions={[
              <>
                Vike is a general-purpose core that includes everything you can expect from a modern framework and more.
              </>
            ]}
          />
        </TextBox>
      </div>
      <Chip />
    </div>
  )
}
