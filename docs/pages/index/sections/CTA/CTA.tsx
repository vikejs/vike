import React from 'react'
import { Grid } from '../../Grid'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/Button/Button'
import { TextBox } from '../../components/TextBox'
import './cta.css'

const stylePrefix = 'landingpage-cta'

export const CTA = () => {
  return (
    <div
      style={{
        backgroundColor: '#F5F5F7'
      }}
    >
      <Grid>
        <TextBox>
          <div className={`${stylePrefix}-textContainer`}>
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
