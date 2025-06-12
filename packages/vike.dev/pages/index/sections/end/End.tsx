export { End }

import React from 'react'
import { Grid } from '../../components/Grid'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { Button } from '../../components/button/Button'
import { TextBox } from '../../components/TextBox'
import './End.css'
import { linkGetStarted } from '../../links'
import { Link } from '@brillout/docpress'

const End = () => {
  return (
    <div
      style={{
        paddingBottom: 30,
      }}
    >
      <Grid>
        <TextBox>
          <div className="landingpage-cta-textContainer">
            <SectionTextCollection caption="A fresh new start" title="Start Building" />
            <div
              style={{
                display: 'flex',
                gap: '8px',
                margin: '20px 0',
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
