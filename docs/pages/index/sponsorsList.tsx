export { sponsorsList }

import type { Sponsor } from './Sponsors'
import contraLogo from './sponsorsList/companyLogos/contra.svg'
import optimizersLogo from './sponsorsList/companyLogos/optimizers.svg'
import sourcegraphLogo from './sponsorsList/companyLogos/sourcegraph.svg'
import burdaforwardLogo from './sponsorsList/companyLogos/burdaforward.png'
import ecosiaLogo from './sponsorsList/companyLogos/ecosia.svg'
import inlangLogo from './sponsorsList/companyLogos/inlang.png'
import bluefinLogo from './sponsorsList/companyLogos/bluefin.svg'
import alignableLogo from './sponsorsList/companyLogos/alignable.svg'

const sponsorsList: Sponsor[] = [
  {
    companyName: 'Contra',
    companyLogo: contraLogo,
    plan: 'silver',
    website: 'https://contra.com',
    github: 'contra'
  },
  {
    companyName: 'Inlang',
    companyLogo: inlangLogo,
    plan: 'silver',
    website: 'https://inlang.com/',
    github: 'opral'
  },
  {
    companyName: 'Alignable',
    companyLogo: alignableLogo,
    plan: 'silver',
    website: 'https://www.alignable.com/',
    github: 'AlignableUser'
  },
  {
    companyName: 'Sourcegraph',
    companyLogo: sourcegraphLogo,
    plan: 'bronze',
    website: 'https://sourcegraph.com',
    github: 'sourcegraph'
  },
  {
    companyName: 'Optimizers',
    companyLogo: optimizersLogo,
    plan: 'bronze',
    website: 'https://www.optimizers.nl/',
    divSize: {
      padding: 20
    },
    github: 'OptimizersGroup'
  },
  {
    companyName: 'BurdaFoward',
    companyLogo: burdaforwardLogo,
    plan: 'bronze',
    website: 'https://www.burda-forward.de',
    github: 'BurdaForward'
  },
  {
    companyName: 'Ecosia',
    companyLogo: ecosiaLogo,
    plan: 'bronze',
    website: 'https://ecosia.org',
    github: 'ecosia'
  },
  {
    companyName: 'Bluefin',
    companyLogo: bluefinLogo,
    plan: 'indie',
    website: 'https://www.bluefin.one',
    github: 'bluefin-clinical'
  }
]
