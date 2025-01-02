export { UsedBy }

import React from 'react'

import usedByBild from './UsedBy/usedby-bild.svg'
import usedBySpline from './UsedBy/usedby-spline.webp'
import usedByEcosia from './UsedBy/usedby-ecosia.svg'
import usedByContra from './UsedBy/usedby-contra.svg'
import usedByName from './UsedBy/usedby-name.svg'
import usedByChip from './UsedBy/usedby-chip.svg'
import { IllustrationNote } from '../../components/IllustrationNote'

const data: { website: `https://${string}`; logo: string; shrink?: number; offset?: number }[] = [
  {
    website: 'https://contra.com',
    logo: usedByContra,
    shrink: 40,
    offset: 4
  },
  {
    website: 'https://name.com',
    logo: usedByName,
    offset: 4
  },
  {
    website: 'https://app.spline.design',
    logo: usedBySpline
  },
  {
    website: 'https://ecosia.org',
    logo: usedByEcosia,
    shrink: 55,
    offset: -1
  },
  {
    website: 'https://bild.de',
    logo: usedByBild
  },
  {
    website: 'https://chip.de',
    logo: usedByChip,
    shrink: 10
  }
]

function UsedBy() {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.map((e, i) => (
          <a
            href={e.website}
            target="_blank"
            key={i}
            style={{
              height: 70,
              boxSizing: 'border-box',
              padding: 10,
              marginLeft: i === 0 ? 0 : 30
            }}
            className="hero-usedby colorize-on-hover"
          >
            <img
              className="decolorize-4"
              src={e.logo}
              style={{
                maxWidth: 180 - (e.shrink ?? 0),
                height: '100%',
                display: 'block',
                position: 'relative',
                top: e.offset,
                objectFit: 'contain'
              }}
            />
          </a>
        ))}
      </div>
      <IllustrationNote>
        Used by large companies to build advanced applications.
        <br />
        (Proof: search for <code style={{ fontSize: '0.85em' }}>vike_pageContext</code> in HTML.)
      </IllustrationNote>
    </div>
  )
}
