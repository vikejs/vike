export { UsedBy }
export { UsedByList }

import React from 'react'

import usedByBild from './UsedBy/usedby-bild.svg'
import usedBySpline from './UsedBy/usedby-spline.webp'
import usedByEcosia from './UsedBy/usedby-ecosia.svg'
import usedByContra from './UsedBy/usedby-contra.svg'
import usedByName from './UsedBy/usedby-name.svg'
import usedByChip from './UsedBy/usedby-chip.svg'
import { IllustrationNote } from '../../components/IllustrationNote'
import { Link } from '@brillout/docpress'

const data: {
  website: `https://${string}`
  logo: string
  shrink?: number
  offset?: number
  desc: string
  name: string
  note?: React.JSX.Element
  order: number
}[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'One of the leading domain registrar',
    logo: usedByName,
    offset: 5,
    order: 0
  },
  {
    website: 'https://contra.com',
    desc: 'Disruptive Upwork alternative',
    note: (
      <>
        Contra doesn't use Vike for their landing page but for its main app, see for example{' '}
        <a href="https://contra.com/brillout">contra.com/brillout</a>.
      </>
    ),
    name: 'Contra',
    logo: usedByContra,
    shrink: 40,
    offset: 4,
    order: 200
  },
  {
    website: 'https://app.spline.design',
    desc: 'Most advanced 3D design web app',
    note: (
      <>
        Spline doesn't use Vike for their landing page but for its main app, see{' '}
        <a href="https://app.spline.design">app.spline.design</a>.
      </>
    ),
    name: 'Spline',
    logo: usedBySpline,
    order: -200
  },
  {
    website: 'https://ecosia.org',
    desc: 'Popular Google aternative',
    name: 'Ecosia',
    logo: usedByEcosia,
    shrink: 55,
    offset: -1,
    order: 50
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read news",
    name: 'Bild.de',
    logo: usedByBild,
    order: -100
  },
  {
    website: 'https://chip.de',
    desc: "Germany's most read consumer news",
    name: 'Chip.de',
    logo: usedByChip,
    shrink: 60,
    order: -99
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
      <IllustrationNote style={{ marginTop: 1 }}>
        Used by large companies to build mission-critical applications, see <Link href="/use-cases">Use Cases</Link>
        <br />
      </IllustrationNote>
    </div>
  )
}

function UsedByList() {
  return (
    <ul>
      {data
        .sort((e1, e2) => e1.order - e2.order)
        .map((e, i) => (
          <li>
            <a href={e.website} target="_blank" key={i}>
              {e.name}
            </a>{' '}
            - {e.desc}.
            {e.note && (
              <blockquote>
                <p>{e.note}</p>
              </blockquote>
            )}
          </li>
        ))}
    </ul>
  )
}
