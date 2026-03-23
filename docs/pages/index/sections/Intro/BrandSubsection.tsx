import React from 'react'
import cm from '@classmatejs/react'

import usedByBild from './../../assets/brands/bildde.svg'
import usedBySpline from './../../assets/brands/spline.webp'
import usedByEcosia from './../../assets/brands/ecosia.svg'
// spellcheck-ignore
import usedBySlite from './../../assets/brands/sliteapp.svg'
import usedByContra from './../../assets/brands/contra.svg'
import usedByName from './../../assets/brands/namecom.svg'
import usedByDia from './../../assets/brands/dia.svg'
import GlassContainer from '../../components/GlassContainer'
import Blockquote from '../../components/Quote'
import { Link } from '@brillout/docpress'

type Brand = {
  website: `https://${string}`
  logo: string
  desc: string
  name: string
  shrink?: number
  offset?: number
  order: number
}

const brands: Brand[] = (
  [
    {
      website: 'https://name.com',
      name: 'Name.com',
      desc: 'Popular domain registrar',
      logo: usedByName,
      offset: 5,
      order: 0,
    },
    /*
    {
      // spellcheck-ignore
      website: 'https://slite.com',
      desc: 'AI-powered knowledge base',
      // spellcheck-ignore
      name: 'Slite',
      // spellcheck-ignore
      logo: usedBySlite,
      order: 50,
    },
    */
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
  ] satisfies Brand[]
)

const BrandsWrapper = cm.div`
  flex justify-center items-center flex-wrap mb-6 relative
`

const BrandsContent = () => {
  const height = 70
  const padding = 10
  return (
    <>
      {brands.map((e, i) => (
        <a
          href={e.website}
          target="_blank"
          key={i}
          aria-label={e.desc}
          data-label-position={i === brands.length - 1 ? 'top-left' : null}
          className="colorize-on-hover text-center p-10"
            style={{
              height, padding
            }}
        >
          <img
            className="decolorize-4"
            src={e.logo}
            style={{
              display: 'block',
              maxWidth: `${180 - (e.shrink ?? 0)}px`,
              height: height - 2 * padding,
              objectFit: 'contain',
              position: 'relative',
              top: e.offset,
            }}
          />
        </a>
      ))}
    </>
  )
}

const BrandSubsection = () => {
  return (
    <GlassContainer className="flex flex-col items-center justify-center gap-4 mx-auto py-5 md:mt-0">
      <BrandsWrapper className="hidden lg:flex gap-10 ">
        <BrandsContent />
      </BrandsWrapper>

      <BrandsWrapper className="flex lg:hidden gap-5">
        <BrandsContent />
      </BrandsWrapper>

      <div className="text-grey text-xs md:text-sm mx-auto mt-4 basis-full px-4 text-center">
        Used by large organizations to build mission-critical applications, see <Link href="/use-cases">Use Cases</Link>
      </div>
    </GlassContainer>
  )
}

const TeamQuote = () => {
  return (
    <Blockquote
      className="mt-15 mb-3 md:mt-2 md:mb-10 pb-10 md:w-4/5 mx-auto"
      authorPictures={[
        'https://github.com/phonzammi.png?size=100',
        'https://github.com/richard-unterberg.png?size=100',
        'https://github.com/nitedani.png?size=100',
        'https://github.com/magne4000.png?size=100',
        'https://github.com/brillout.png?size=100',
      ]}
    >
      We started Vike 5 years ago with a bold mission: build the last framework you'll need — a rock-solid foundation
      with powerful hooks, ready to embrace JavaScript's future.
    </Blockquote>
  )
}

export { TeamQuote }
export default BrandSubsection
