export { Sponsors }
export type { Sponsor }

import React from 'react'
import { sponsorLevels, sponsorsList } from './sponsorsList'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { TextBox } from '../../components/TextBox'
import { Button } from '../../components/Button/Button'
import './sponsors.css'
import { linkSponsor } from '../../links'

const stylePrefix = 'landingpage-sponsors'

const data = {
  caption: 'Partners',
  title: 'Sponsor Vike and get a tight-knit partnership 🤝'
}

type Plan = 'indie' | 'bronze' | 'silver' | 'gold' | 'platinum'

type Sponsor = {
  companyName: string
  companyLogo: string
  website: string
  plan: Plan
  divSize?: Partial<DivSize>
  github: string
}

type DivSize = {
  width: number
  height: number
  padding: number
}

function Sponsors() {
  return (
    <div className={`${stylePrefix}-container`}>
      <div className={`${stylePrefix}-textContainer`}>
        <div
          style={{
            gridColumn: '3 / span 8'
          }}
        >
          <TextBox>
            <div className={`${stylePrefix}-innerTextContainer`}>
              <SectionTextCollection caption={data.caption} title={data.title} />
              <a
                style={{
                  marginTop: '12px'
                }}
                href={linkSponsor}
              >
                <Button type="secondary">Become a Partner</Button>
              </a>
            </div>
          </TextBox>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: '24px'
        }}
      >
        {sponsorLevels.map((level) => (
          <div key={level.name} className={`${stylePrefix}-sponsorList`}>
            {sponsorsList
              .filter((s) => s.plan === level.name)
              .map((sponsor) => (
                <a
                  key={sponsor.companyName}
                  href={sponsor.website}
                  className={`${stylePrefix}-sponsor ${level.name}`}
                  style={{
                    height: sponsorsList.filter((s) => s.plan === level.name).length > 0 ? level.height : 0
                  }}
                >
                  <img className={`${stylePrefix}-sponsorLogo`} src={sponsor.companyLogo} alt={sponsor.companyName} />
                </a>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
