export { brands }

// TODO/ai move all images to components/brands/
import usedByBild from './../../assets/brands/bildde.svg'
import usedBySpline from './../../assets/brands/spline.webp'
import usedByEcosia from './../../assets/brands/ecosia.svg'
// spellcheck-ignore
import usedBySlite from './../../assets/brands/sliteapp.svg'
import usedByContra from './../../assets/brands/contra.svg'
import usedByName from './../../assets/brands/namecom.svg'
import usedByDia from './../../assets/brands/dia.svg'

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
