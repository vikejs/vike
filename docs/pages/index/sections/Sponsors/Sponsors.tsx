export { Sponsors }
export type { Sponsor }

import React from 'react'
import { sponsorLevels, sponsorsList } from './sponsorsList'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { TextBox } from '../../components/TextBox'
import { Button } from '../../components/Button/Button'
import './sponsors.css'
import { linkSponsor } from '../../links'
import handshakeIcon from './handshake.svg'

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
    <div className="landingpage-sponsors-container">
      <div className="landingpage-sponsors-textContainer">
        <div
          style={{
            gridColumn: '3 / span 8'
          }}
        >
          <TextBox>
            <div className="landingpage-sponsors-innerTextContainer">
              <SectionTextCollection
                caption="Partners"
                title={
                  <>
                    Sponsor Vike and get a tight-knit partnership&nbsp;
                    <img
                      src={handshakeIcon}
                      style={{ width: 39, verticalAlign: 'middle', position: 'relative', top: -1 }}
                    />
                  </>
                }
              />
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
          <div key={level.name} className="landingpage-sponsors-sponsorList">
            {sponsorsList
              .filter((s) => s.plan === level.name)
              .map((sponsor) => (
                <a
                  key={sponsor.companyName}
                  href={sponsor.website}
                  className={`landingpage-sponsors-sponsor ${level.name}`}
                  style={{
                    height: sponsorsList.filter((s) => s.plan === level.name).length > 0 ? level.height : 0
                  }}
                >
                  <img
                    className="landingpage-sponsors-sponsorLogo"
                    style={{
                      maxWidth: '90%'
                    }}
                    src={sponsor.companyLogo}
                    alt={sponsor.companyName}
                  />
                </a>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
