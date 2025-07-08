import React from 'react'
import { TextBox } from '../../components/TextBox'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Chip } from './chip/Chip'
import './Features.css'

export const Features = () => {
  return (
    <div className="landingpage-features-container">
      <div className="landingpage-features-textContainer">
        <TextBox>
          <SectionTextCollection
            caption="Full-fledged"
            title="Core. All-included."
            descriptions={[
              <>
                Vike is a general-purpose core that includes everything you can expect from a modern framework and more.
              </>,
            ]}
          />
        </TextBox>
      </div>
      <Chip />
    </div>
  )
}
