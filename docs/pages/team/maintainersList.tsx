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
      <>Vike Core (Lead Maintainer, Creator)</>,
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
      <>Bati (Lead Maintainer, Creator)</>,
      <>
        <code>universal-middleware</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>photon</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-photon</code> (Lead Maintainer, Creator)
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
        <code>vike-react-query</code> (Creator)
      </>,
      <>
        <code>vike-react-apollo</code> (Creator)
      </>,
      <>
        <code>vike-server</code> (Creator)
      </>,
      <>Vike Core (Contributor)</>,
    ],
  },
  {
    username: 'phonzammi',
    firstName: 'Muhammad',
    isCoreTeam: true,
    roles: [
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
  return `https://github.com/${maintainer.username}.png?size=${imgSize}`
}
