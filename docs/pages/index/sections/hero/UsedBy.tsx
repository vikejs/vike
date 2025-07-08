export { UsedBy }
export { UsedByList }

import React from 'react'

import usedByBild from './UsedBy/usedby-bild.svg'
import usedBySpline from './UsedBy/usedby-spline.webp'
import usedByEcosia from './UsedBy/usedby-ecosia.svg'
import usedByContra from './UsedBy/usedby-contra.svg'
import usedByName from './UsedBy/usedby-name.svg'
import usedByChip from './UsedBy/usedby-chip.svg'
import usedByDia from './UsedBy/usedby-dia.svg'
import { IllustrationNote } from '../../components/IllustrationNote'
import { Link } from '@brillout/docpress'

const data: {
  website: `https://${string}`
  logo: string
  shrink?: number
  offset?: number
  desc: string
  name: string
  order: number
}[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'Popular domain registrar',
    logo: usedByName,
    offset: 5,
    order: 0,
  },
  {
    website: 'https://contra.com',
    desc: 'Upwork alternative',
    name: 'Contra',
    logo: usedByContra,
    shrink: 40,
    offset: 4,
    order: 200,
  },
  {
    website: 'https://app.spline.design',
    desc: 'Advanced 3D design web app',
    name: 'Spline',
    logo: usedBySpline,
    order: -200,
  },
  {
    website: 'https://ecosia.org',
    desc: 'Google alternative',
    name: 'Ecosia',
    logo: usedByEcosia,
    shrink: 55,
    offset: -1,
    order: -50,
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read newspaper",
    name: 'Bild.de',
    logo: usedByBild,
    order: -100,
  },
  {
    website: 'https://dia.es',
    desc: "Spain's supermarket with the most stores",
    name: 'Dia.es',
    logo: usedByDia,
    order: 100,
  },
  /*
  {
    website: 'https://chip.de',
    desc: "Germany's most read consumer news",
    name: 'Chip.de',
    logo: usedByChip,
    shrink: 60,
    order: -99
  }
  */
]

function UsedBy() {
  const height = 70
  const padding = 10
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        {data.map((e, i) => (
          <a
            href={e.website}
            target="_blank"
            key={i}
            style={{
              display: 'inline-block',
              height,
              padding,
              marginLeft: i === 0 ? 0 : 30,
            }}
            aria-label={e.desc}
            className="hero-usedby colorize-on-hover"
          >
            <img
              className="decolorize-4"
              src={e.logo}
              style={{
                maxWidth: 180 - (e.shrink ?? 0),
                height: height - 2 * padding,
                position: 'relative',
                top: e.offset,
                objectFit: 'contain',
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
        .slice()
        .sort((e1, e2) => e1.order - e2.order)
        .map((e, i) => (
          <li>
            <a href={e.website} target="_blank" key={i}>
              {e.name}
            </a>{' '}
            - {e.desc}
          </li>
        ))}
    </ul>
  )
}
