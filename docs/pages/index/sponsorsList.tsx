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

const individuals: Sponsor[] = [
  { username: 'arp' },
  { username: 'tlancina' },
  { username: 'shishkin17' },
  { username: 'royalswe' },
  { username: 'lebretont' },
  { username: 'xar' },
  { username: 'NicoZweifel' },
  { username: 'mariuslian' },
  { username: 'shortpoet' },
  { username: 'sqs' },
  { username: 'dylmye' },
  { username: 'isakura313' },
  { username: 'rivatove' },
  { username: 'SMKJALLAD' },
  { username: 'routinghub' },
  { username: 'LostCrew' }, // Ecosia
  { username: 'jakubfiala' }, // Ecosia
  { username: 'HarshwardhanSingh' },
  { username: 'd3x7r0' },
  { username: 'ChristophP' }, // BurdaForward
  { username: 'msiegenthaler' },
  { username: 'linkyard' },
  { username: 'AnukarOP' },
  { username: 'RoyMcCrain' },
  { username: 'chrisvander' }, // Bluefin
  { username: 'EralChen' },
  { username: '3dyuval' },
  { username: 'talzion12' },
  { username: 'felixhaeberle' },
  { username: 'apappas1129' },
  /* 404
  { username: 'agalbenus' },
  */
  { username: 'phiberber' },
  { username: 'cookieplace' },
  { username: 'JiangWeixian' },
  { username: 'harrytran998' },
  { username: 'alexturpin' },
  { username: 'gu-stav' },
  { username: 'YannBirba' },
  { username: 'fi3ework' },
  { username: 'EJM-Company' },
  { username: 'Nelie-Taylor' },
  { username: 'fortezhuo' },
  { username: 'nshelia' },
  { username: 'marcusway' },
  { username: 'edikdeisling' },
  { username: 'AurelienLourot' },
  { username: 'jahredhope' },
  { username: 'charlieforward9' },
  { username: 'leonmondria' },
  { username: 'jscottsf' },
  { username: 'micah-redwood' },
  { username: 'nicka-redwood' },
  { username: 'ser1us' },
  { username: 'nikitavoloboev' },
  { username: 'samuelstroschein' },
  { username: 'npacucci' },
  { username: 'szarapka' },
  { username: 'techniath' },
  { username: 'DannyZB' },
  { username: 'pieperz' },
  { username: 'hemengke1997' },
  { username: 'spacedawwwg' },
  { username: 'arthurgailes' },
  { username: 'stackblitz' },
  { username: 'codthing' },
  { username: 'Junaidhkn' },
  { username: 'zgfdev' }
]

const companies: Sponsor[] = [
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

const sponsorsList: Sponsor[] = [...companies, ...individuals]
