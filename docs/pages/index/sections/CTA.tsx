import React from 'react'
import { Grid } from '../+Page'
import { SectionTextCollection } from '../components/SectionTextCollection'
import { Button } from '../components/Button/Button'
import { TextBox } from '../components/TextBox'

export const CTA = () => {
  return (
    <div
      style={{
        backgroundColor: '#F5F5F7'
      }}
    >
      <Grid>
        <TextBox>
          <div
            style={{
              paddingTop: '80px',
              paddingBottom: '80px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end'
            }}
          >
            <SectionTextCollection caption="Get ready" title="Start building" />
            <div
              style={{
                display: 'flex',
                gap: '8px',
                margin: '20px 0'
              }}
            >
              <Button type="ghost">Read FAQs</Button>
              <Button type="default">Get started</Button>
            </div>
          </div>
        </TextBox>
      </Grid>
    </div>
  )
}
