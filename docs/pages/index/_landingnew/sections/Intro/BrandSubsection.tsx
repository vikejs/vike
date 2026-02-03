import React from 'react'
import { cmMerge } from '@classmatejs/react'

import usedByBild from './../../assets/brands/bildde.svg'
import usedBySpline from './../../assets/brands/spline.webp'
import usedByEcosia from './../../assets/brands/ecosia.svg'
import usedByContra from './../../assets/brands/contra.svg'
import usedByName from './../../assets/brands/namecom.svg'
import usedByDia from './../../assets/brands/dia.svg'

import GlassContainer from '../../components/GlassContainer'
import Blockquote from '../../components/Quote'

type Brand = {
  website: `https://${string}`
  logo: string
  height: string
  desc: string
  name: string
}

const heightVariant = {
  small: 'h-4.5',
  medium: 'h-6',
  large: 'h-8',
}

const brands: Brand[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'Popular domain registrar',
    logo: usedByName,
    height: heightVariant.small,
  },
  {
    website: 'https://app.spline.design',
    desc: 'Advanced 3D design web app',
    name: 'Spline',
    height: heightVariant.large,
    logo: usedBySpline,
  },
  {
    website: 'https://contra.com',
    desc: 'Upwork alternative',
    name: 'Contra',
    logo: usedByContra,
    height: heightVariant.medium,
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read newspaper",
    name: 'Bild.de',
    height: heightVariant.large,
    logo: usedByBild,
  },
  {
    website: 'https://ecosia.org',
    desc: 'Google alternative',
    name: 'Ecosia',
    logo: usedByEcosia,
    height: heightVariant.medium,
  },
  {
    website: 'https://dia.es',
    desc: "Spain's supermarket with the most stores",
    name: 'Dia.es',
    height: heightVariant.large,
    logo: usedByDia,
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

const BrandSubsection = () => {
  return (
    <GlassContainer className="flex flex-col items-center justify-center gap-4 mx-auto py-10">
      <div className="flex gap-10 justify-center items-center flex-wrap pb-10">
        {brands.map((e, i) => (
          <a
            href={e.website}
            target="_blank"
            key={i}
            aria-label={e.desc}
            data-label-position={i === brands.length - 1 ? 'top-left' : null}
            className="hero-usedby colorize-on-hover h-full flex justify-center items-center"
          >
            <img className={cmMerge('decolorize-4 w-auto', e.height)} src={e.logo} width={400} height={200} />
          </a>
        ))}
      </div>
      <div className="text-grey-100 text-sm w-fit mx-auto mb-12">
        Used by large organizations to build mission-critical applications, see{' '}
        <a href="link" className="text-secondary">
          Use Cases
        </a>
      </div>
      <Blockquote
        className="md:w-4/5 mx-auto"
        authorPictures={[
          'https://github.com/brillout.png?size=100',
          'https://github.com/magne4000.png?size=100',
          'https://github.com/nitedani.png?size=100',
          'https://github.com/phonzammi.png?size=100',
        ]}
      >
        Vike is built on a stable, rock-solid core with powerful low-level hooks — a foundation companies can trust and
        build upon with confidence.
      </Blockquote>
    </GlassContainer>
  )
}

export default BrandSubsection