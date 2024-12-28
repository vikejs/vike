export { Sponsors }
export type { Sponsor }

import React from 'react'
import { sponsorsList } from './sponsorsList'
import { SectionTextCollection } from '../../components/SectionTextCollection'
import { TextBox } from '../../components/TextBox'
import { Button } from '../../components/Button/Button'
import './sponsors.css'
import { linkSponsor } from '../../links'
import handshakeIcon from './handshake.svg'

type Sponsor = {
  companyName: string
  companyLogo: string
  website: string
  isPast?: true
  landpageStyle?: React.CSSProperties
  github: string
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
        className="landingpage-sponsors-wrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <div className="landingpage-sponsors-sponsorList">
          {sponsorsList
            .filter((s) => !s.isPast)
            .map((sponsor, i) => (
              <SponsorLink sponsor={sponsor} key={i} />
            ))}
        </div>
        <div className="landingpage-sponsors-sponsorList past-sponsors">
          {sponsorsList
            .filter((s) => s.isPast)
            .map((sponsor, i) => (
              <SponsorLink sponsor={sponsor} key={i} />
            ))}
        </div>
      </div>
    </div>
  )
}

function SponsorLink({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a href={sponsor.website} className={`landingpage-sponsors-sponsor`}>
      <img
        style={{
          maxWidth: '90%',
          height: '40%',
          ...sponsor.landpageStyle
        }}
        src={sponsor.companyLogo}
        alt={sponsor.companyName}
      />
    </a>
  )
}
