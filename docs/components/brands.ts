export { brands }

import usedByMoonshot from './brands/moonshotai.svg'
import usedBySurrealDB from './brands/surrealdb.svg'
import usedByEcosia from './brands/ecosia.svg'
// spellcheck-ignore
import usedBySlite from './brands/sliteapp.svg'
import usedByContra from './brands/contra.svg'
import usedByAlignable from './brands/alignable.svg'
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
    website: 'https://www.moonshot.ai',
    name: 'Moonshot AI',
    desc: 'Top-tier AI lab behind Kimi',
    logo: usedByMoonshot,
    logoScale: 0.75,
    useCasesOrder: -200,
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
    website: 'https://surrealdb.com',
    name: 'SurrealDB',
    desc: 'Database trusted by Fortune 500 companies',
    logo: usedBySurrealDB,
    logoScale: 0.95,
    useCasesOrder: -100,
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
    website: 'https://www.alignable.com',
    name: 'Alignable',
    desc: 'Social network used by 12M+ business owners',
    logo: usedByAlignable,
    logoScale: 0.9,
    useCasesOrder: 0,
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
    useCasesOrder: -99
  }
  */
] satisfies Brand[]
