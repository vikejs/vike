export { UsedBy }

import React from 'react'

import usedByBild from './UsedBy/usedby-bild.svg'
import usedBySpline from './UsedBy/usedby-spline.webp'
import usedByEcosia from './UsedBy/usedby-ecosia.svg'
import usedByContra from './UsedBy/usedby-contra.svg'
import usedByName from './UsedBy/usedby-name.svg'
import usedByChip from './UsedBy/usedby-chip.svg'
import { IllustrationNote } from '../../components/IllustrationNote'

const data: { website: `https://${string}`; logo: string; shrink?: number; offset?: number; desc: string }[] = [
  {
    website: 'https://name.com',
    desc: 'One of the leading domain registrar',
    logo: usedByName,
    offset: 5
  },
  {
    website: 'https://contra.com',
    desc: 'Disruptive Upwork alternative',
    logo: usedByContra,
    shrink: 40,
    offset: 4
  },
  {
    website: 'https://app.spline.design',
    desc: 'Most advanced 3D design web app',
    logo: usedBySpline
  },
  {
    website: 'https://ecosia.org',
    desc: 'Popular Google aternative',
    logo: usedByEcosia,
    shrink: 55,
    offset: -1
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read news",
    logo: usedByBild
  },
  {
    website: 'https://chip.de',
    desc: "Germany's most read consumer news",
    logo: usedByChip,
    shrink: 60
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
            aria-label={e.desc}
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
      <IllustrationNote style={{ marginTop: -2 }}>
        Used by large companies to build mission-critical applications.
        <br />
        <span style={{ opacity: 0.5 }}>
          (Proof: search for <code style={{ fontSize: '0.85em' }}>vike_pageContext</code> in HTML.)
        </span>
      </IllustrationNote>
    </div>
  )
}
