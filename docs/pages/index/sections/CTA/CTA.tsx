import React from 'react'
import { Grid } from '../../Grid'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/Button/Button'
import { TextBox } from '../../components/TextBox'
import './cta.css'
import { linkGetStarted } from '../../links'
import { Link } from '@brillout/docpress'

const stylePrefix = 'landingpage-cta'

export const CTA = () => {
  return (
    <div
      style={{
        paddingBottom: 30
      }}
    >
      <Grid>
        <TextBox>
          <div className={`${stylePrefix}-textContainer`}>
            <SectionTextCollection caption="A new fresh start" title="Start building" />
            <div
              style={{
                display: 'flex',
                gap: '8px',
                margin: '20px 0'
              }}
            >
              <Link href="/faq">
                <Button type="ghost">Read FAQ</Button>
              </Link>
              <Link href={linkGetStarted}>
                <Button type="default">Get Started</Button>
              </Link>
            </div>
          </div>
        </TextBox>
      </Grid>
    </div>
  )
}
