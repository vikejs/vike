export { sponsorsList }

import type { Sponsor } from './Sponsors'
import contraLogo from './sponsorsLogo/contra.svg'
import optimizersLogo from './sponsorsLogo/optimizers.svg'
import sourcegraphLogo from './sponsorsLogo/sourcegraph.svg'
import axelspringerLogo from './sponsorsLogo/axelspringer.svg'
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
    github: 'AlignableUser'
  },
  {
    companyName: 'Sourcegraph',
    companyLogo: sourcegraphLogo,
    website: 'https://sourcegraph.com',
    github: 'sourcegraph'
  },
  {
    companyName: 'Axel Springer',
    companyLogo: axelspringerLogo,
    landpageStyle: {
      height: '32%'
    },
    website: 'https://www.axelspringer.com',
    github: 'BurdaForward'
  },
  {
    companyName: 'Optimizers',
    companyLogo: optimizersLogo,
    landpageStyle: {
      height: '60%'
    },
    website: 'https://www.optimizers.nl',
    github: 'OptimizersGroup'
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
  },
  {
    isPast: true,
    companyName: 'CREPE',
    companyLogo: crepeLogo,
    website: 'https://crepe.cm',
    github: 'cookieplace'
  },
  {
    isPast: true,
    companyName: 'Contra',
    companyLogo: contraLogo,
    website: 'https://contra.com',
    github: 'contra'
  },
  {
    isPast: true,
    companyName: 'Inlang',
    companyLogo: inlangLogo,
    website: 'https://inlang.com',
    github: 'opral'
  },
  {
    isPast: true,
    companyName: 'Repora',
    companyLogo: reporaLogo,
    website: 'https://www.repora.com',
    github: 'DannyZB'
  },
  {
    isPast: true,
    companyName: 'My Favorite Quilt Store',
    companyLogo: mfqsLogo,
    website: 'https://myfavoritequiltstore.com',
    github: 'pieperz'
  }
]
