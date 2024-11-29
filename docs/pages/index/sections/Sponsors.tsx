export { Sponsors }
export type { Sponsor }

import React from 'react'
import { assert } from '@brillout/docpress'
import { sponsorLevels, sponsorsList } from './sponsorsList'
import { SectionTextCollection } from '../components/SectionTextCollection'
import { TextBox } from '../components/TextBox'
import { Button } from '../components/Button/Button'

const data = {
  caption: 'Sponsoring',
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
    <div
      style={{
        marginTop: '120px',
        marginBottom: '120px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)'
        }}
      >
        <div
          style={{
            gridColumn: '3 / span 8'
          }}
        >
          <TextBox>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SectionTextCollection caption={data.caption} title={data.title} />
              <a
                style={{
                  marginTop: '12px'
                }}
                href="https://github.com/sponsors/vikejs"
              >
                <Button type="secondary">Become a sponsor</Button>
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
          <div
            key={level.name}
            style={{
              display: 'flex',
              gap: 4,
              justifyContent: 'space-between',
              height: sponsorsList.filter((s) => s.plan === level.name).length > 0 ? level.height : 0
            }}
          >
            {sponsorsList
              .filter((s) => s.plan === level.name)
              .map((sponsor) => (
                <a
                  key={sponsor.companyName}
                  href={sponsor.website}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={sponsor.companyLogo}
                    alt={sponsor.companyName}
                    style={{
                      height: '40%'
                    }}
                  />
                </a>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
