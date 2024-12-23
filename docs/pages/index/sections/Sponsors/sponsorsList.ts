export { sponsorsList }

import type { Sponsor } from './Sponsors'
import contraLogo from './sponsorsLogo/contra.svg'
import optimizersLogo from './sponsorsLogo/optimizers.svg'
import sourcegraphLogo from './sponsorsLogo/sourcegraph.svg'
import burdaforwardLogo from './sponsorsLogo/burdaforward.png'
import ecosiaLogo from './sponsorsLogo/ecosia.svg'
import inlangLogo from './sponsorsLogo/inlang.png'
import bluefinLogo from './sponsorsLogo/bluefin.svg'
import alignableLogo from './sponsorsLogo/alignable.svg'

const sponsorsList: Sponsor[] = [
  {
    companyName: 'Contra',
    companyLogo: contraLogo,
    website: 'https://contra.com',
    github: 'contra'
  },
  {
    companyName: 'Inlang',
    companyLogo: inlangLogo,
    website: 'https://inlang.com/',
    github: 'opral'
  },
  {
    companyName: 'Alignable',
    companyLogo: alignableLogo,
    website: 'https://www.alignable.com/',
    github: 'AlignableUser'
  },
  {
    companyName: 'Sourcegraph',
    companyLogo: sourcegraphLogo,
    website: 'https://sourcegraph.com',
    github: 'sourcegraph'
  },
  {
    companyName: 'Optimizers',
    companyLogo: optimizersLogo,
    website: 'https://www.optimizers.nl/',
    divSize: {
      padding: 20
    },
    github: 'OptimizersGroup'
  },
  {
    companyName: 'BurdaForward',
    companyLogo: burdaforwardLogo,
    website: 'https://www.burda-forward.de',
    github: 'BurdaForward'
  },
  {
    companyName: 'Ecosia',
    companyLogo: ecosiaLogo,
    website: 'https://ecosia.org',
    github: 'ecosia'
  },
  {
    companyName: 'Bluefin',
    companyLogo: bluefinLogo,
    website: 'https://www.bluefin.one',
    github: 'bluefin-clinical'
  }
]
