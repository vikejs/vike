import React from 'react'

import usedByBild from './../../assets/brands/bildde.svg'
import usedBySpline from './../../assets/brands/spline.webp'
import usedByEcosia from './../../assets/brands/ecosia.svg'
// spellcheck-ignore
import usedBySlite from './../../assets/brands/sliteapp.svg'
import usedByContra from './../../assets/brands/contra.svg'
import usedByName from './../../assets/brands/namecom.svg'
import usedByDia from './../../assets/brands/dia.svg'
import GlassContainer from '../../components/GlassContainer'
import { Link } from '@brillout/docpress'

type Brand = {
  website: `https://${string}`
  logo: string
  desc: string
  name: string
  top?: string
  scale?: number
  order: number
}

const brands: Brand[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'Popular domain registrar',
    logo: usedByName,
    scale: 0.54,
    top: '0.2em',
    order: 0,
  },
  {
    // spellcheck-ignore
    website: 'https://slite.com',
    desc: 'AI-powered knowledge base',
    // spellcheck-ignore
    name: 'Slite',
    // spellcheck-ignore
    logo: usedBySlite,
    scale: 1.08,
    order: 50,
  },
  {
    website: 'https://contra.com',
    desc: 'Upwork alternative',
    name: 'Contra',
    logo: usedByContra,
    scale: 0.82,
    top: '0.18em',
    order: 200,
  },
  {
    website: 'https://app.spline.design',
    desc: 'Advanced 3D design web app',
    name: 'Spline',
    logo: usedBySpline,
    scale: 1.4,
    order: -200,
  },
  {
    website: 'https://ecosia.org',
    desc: 'Google alternative',
    name: 'Ecosia',
    logo: usedByEcosia,
    scale: 0.9,
    top: '-0.02em',
    order: -50,
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read newspaper",
    name: 'Bild.de',
    logo: usedByBild,
    scale: 1.3,
    order: -100,
  },
  {
    website: 'https://dia.es',
    desc: "Spain's supermarket with the most stores",
    name: 'Dia.es',
    logo: usedByDia,
    scale: 1.3,
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
] satisfies Brand[]

const BrandsContent = () => {
  return (
    <>
      {brands.map((e, i) => (
        <a
          href={e.website}
          target="_blank"
          key={i}
          aria-label={e.desc}
          data-label-position={i === brands.length - 1 ? 'top-left' : null}
          className="colorize-on-hover text-center py-2 text-xs lg:text-base"
        >
          <img
            className="decolorize-4"
            src={e.logo}
            style={{
              display: 'block',
              height: `${2 * (e.scale ?? 1)}em`,
              objectFit: 'contain',
              position: 'relative',
              top: e.top,
            }}
          />
        </a>
      ))}
    </>
  )
}

const BrandSubsection = () => {
  return (
    <GlassContainer className="pt-2 pb-4 mt-1">
      <div className="flex items-center flex-wrap mb-6 gap-x-5 gap-y-2 justify-center lg:justify-between">
        <BrandsContent />
      </div>
      <div className="text-grey text-xs md:text-sm mx-auto -mt-2 basis-full px-4 text-center">
        Used by large organizations to build mission-critical applications, see <Link href="/use-cases">Use Cases</Link>
      </div>
    </GlassContainer>
  )
}

export default BrandSubsection
