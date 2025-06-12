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
import crepeLogo from './sponsorsLogo/crepe.svg'
import reporaLogo from './sponsorsLogo/repora.svg'
import mfqsLogo from './sponsorsLogo/mfqs.svg'

const sponsorsList: Sponsor[] = [
  {
    companyName: 'Alignable',
    companyLogo: alignableLogo,
    website: 'https://www.alignable.com',
    github: 'AlignableUser',
  },
  {
    companyName: 'Sourcegraph',
    companyLogo: sourcegraphLogo,
    website: 'https://sourcegraph.com',
    github: 'sourcegraph',
  },
  {
    companyName: 'BurdaForward',
    companyLogo: burdaforwardLogo,
    website: 'https://www.burda-forward.de',
    github: 'BurdaForward',
  },
  {
    companyName: 'Optimizers',
    companyLogo: optimizersLogo,
    companyLogoStyle: {
      height: '60%',
    },
    website: 'https://www.optimizers.nl',
    github: 'OptimizersGroup',
  },
  {
    companyName: 'Ecosia',
    companyLogo: ecosiaLogo,
    website: 'https://ecosia.org',
    github: 'ecosia',
  },
  {
    companyName: 'Bluefin',
    companyLogo: bluefinLogo,
    website: 'https://www.bluefin.one',
    github: 'bluefin-clinical',
  },
  {
    isPast: true,
    companyName: 'CREPE',
    companyLogo: crepeLogo,
    website: 'https://crepe.cm',
    github: 'cookieplace',
  },
  {
    isPast: true,
    companyName: 'Contra',
    companyLogo: contraLogo,
    website: 'https://contra.com',
    github: 'contra',
  },
  {
    isPast: true,
    companyName: 'Inlang',
    companyLogo: inlangLogo,
    website: 'https://inlang.com',
    github: 'opral',
  },
  {
    isPast: true,
    companyName: 'Repora',
    companyLogo: reporaLogo,
    /* 404
    website: 'https://www.repora.com',
    */
    website: 'https://github.com/DannyZB?tab=sponsoring',
    github: 'DannyZB',
  },
  {
    isPast: true,
    companyName: 'My Favorite Quilt Store',
    companyLogo: mfqsLogo,
    website: 'https://myfavoritequiltstore.com',
    github: 'pieperz',
  },
]
