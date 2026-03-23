export { brands }

import usedByBild from './brands/bildde.svg'
import usedBySpline from './brands/spline.webp'
import usedByEcosia from './brands/ecosia.svg'
// spellcheck-ignore
import usedBySlite from './brands/sliteapp.svg'
import usedByContra from './brands/contra.svg'
import usedByName from './brands/namecom.svg'
import usedByDia from './brands/dia.svg'

type Brand = {
  website: `https://${string}`
  logo: string
  desc: string
  name: string
  logoTop?: string
  logoScale?: number
  useCasesOrder: number
}

const brands: Brand[] = [
  {
    website: 'https://name.com',
    name: 'Name.com',
    desc: 'Popular domain registrar',
    logo: usedByName,
    logoScale: 0.54,
    logoTop: '0.2em',
    useCasesOrder: 0,
  },
  {
    // spellcheck-ignore
    website: 'https://slite.com',
    desc: 'AI-powered knowledge base',
    // spellcheck-ignore
    name: 'Slite',
    // spellcheck-ignore
    logo: usedBySlite,
    logoScale: 1.08,
    useCasesOrder: -25,
  },
  {
    website: 'https://contra.com',
    desc: 'Upwork alternative',
    name: 'Contra',
    logo: usedByContra,
    logoScale: 0.82,
    logoTop: '0.18em',
    useCasesOrder: 200,
  },
  {
    website: 'https://app.spline.design',
    desc: 'Advanced 3D design web app',
    name: 'Spline',
    logo: usedBySpline,
    logoScale: 1.4,
    useCasesOrder: -200,
  },
  {
    website: 'https://ecosia.org',
    desc: 'Google alternative',
    name: 'Ecosia',
    logo: usedByEcosia,
    logoScale: 0.9,
    logoTop: '-0.02em',
    useCasesOrder: -50,
  },
  {
    website: 'https://bild.de',
    desc: "Germany's most read newspaper",
    name: 'Bild.de',
    logo: usedByBild,
    logoScale: 1.3,
    useCasesOrder: -100,
  },
  {
    website: 'https://dia.es',
    desc: "Spain's supermarket with the most stores",
    name: 'Dia.es',
    logo: usedByDia,
    logoScale: 1.3,
    useCasesOrder: 100,
  },
  /*
  {
    website: 'https://chip.de',
    desc: "Germany's most read consumer news",
    name: 'Chip.de',
    logo: usedByChip,
    shrink: 60,
    useCasesOrder: -99
  }
  */
] satisfies Brand[]
