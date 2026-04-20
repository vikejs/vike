export { maintainersList }
export { getMaintainerAvatar }
export { getMaintainer }
export type { MaintainerUsername }
export type { Maintainer }

import React from 'react'

type MaintainerList = typeof maintainersList
type Maintainer = MaintainerList[number]
type MaintainerUsername = Maintainer['username']

const maintainersList = [
  {
    username: 'brillout',
    firstName: 'Rom',
    isCoreTeam: true,
    roles: [
      <>Vike (Lead Maintainer, Creator)</>,
      <>
        <code>vike-react</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-vue</code> (Contributor)
      </>,
    ],
  },
  {
    username: 'magne4000',
    firstName: 'Joël',
    isCoreTeam: true,
    roles: [
      <>
        <a href="https://github.com/universal-deploy/universal-deploy">Universal Deploy</a> (Lead Maintainer, Creator)
      </>,
      <>
        <a href="https://github.com/magne4000/universal-middleware">Universal Middleware</a> (Lead Maintainer, Creator)
      </>,
      <>
        <a href="https://github.com/vikejs/bati">Bati</a> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-solid</code> (Lead Maintainer, Creator)
      </>,
      <>Vike Core (Contributor)</>,
    ],
  },
  {
    username: 'nitedani',
    firstName: 'Dániel',
    isCoreTeam: true,
    roles: [
      <>
        🚧 <a href="https://github.com/telefunc/telefunc/pull/236">Telefunc streaming</a>
      </>,
      <>
        <code>vike-react-query</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-react-apollo</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-react-zustand</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-react-sentry</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-server</code> (Creator)
      </>,
      <>Vike Core (Contributor)</>,
    ],
  },
  {
    username: 'richard-unterberg',
    firstName: 'Richard',
    isCoreTeam: true,
    roles: [
      <>Vike's landing page</>,
      <>
        🚧 <a href="https://github.com/richard-unterberg/nivel">Nivel</a> — Vike's new documentation website
      </>,
    ],
  },
  {
    username: 'ambergristle',
    firstName: 'Aristo',
    isCoreTeam: true,
    roles: [
      <>
        🚧 <a href="https://github.com/telefunc/telefunc/pull/240">Telefunc docs rehaul</a>
      </>,
    ],
  },
  {
    username: 'phonzammi',
    firstName: 'Muhammad',
    isCoreTeam: true,
    roles: [
      <>
        <a href="https://github.com/brillout/docpress">DocPress</a> (Major Contributor)
      </>,
      <>
        <code>vike-vue</code> (Contributor)
      </>,
      <>
        <code>vike-solid</code> (Contributor)
      </>,
      <>
        <code>vike-react</code> (Contributor)
      </>,
      <>Bati (Contributor)</>,
    ],
  },
  {
    username: 'NilsJacobsen',
    firstName: 'Nils',
    isCoreTeam: false,
    roles: [<>Vike's landing page</>],
  },
  {
    username: 'AurelienLourot',
    firstName: 'Aurélien',
    isCoreTeam: false,
    roles: [
      <>
        <code>vike-vue</code> (Contributor)
      </>,
      <>
        <code>vike-react</code> (Contributor)
      </>,
      <>Vike Core (Contributor)</>,
    ],
  },
  {
    username: '4350pChris',
    firstName: 'Chris',
    isCoreTeam: false,
    roles: [
      <>
        <code>vike-vue</code> (Creator)
      </>,
      <>
        <code>vike-pinia</code> (Creator)
      </>,
      <>
        <code>vike-vue-query</code> (Creator)
      </>,
    ],
  },
  {
    username: 'Blankeos',
    firstName: 'Carlo',
    isCoreTeam: false,
    roles: [
      <>
        <code>vike-solid</code> (Contributor)
      </>,
    ],
  },
] as const satisfies {
  username: string
  firstName: string
  roles: React.ReactNode[]
  isCoreTeam: boolean
}[]

function getMaintainer(maintainerUsername: MaintainerUsername) {
  return maintainersList.find((maintainer) => maintainer.username === maintainerUsername)!
}

function getMaintainerAvatar(maintainer: Maintainer, imgSize: number) {
  const scale = 4 // slightly better on desktop, massively bebter on mobile
  return `https://github.com/${maintainer.username}.png?size=${imgSize * scale}`
}
