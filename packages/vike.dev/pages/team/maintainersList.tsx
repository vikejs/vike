export { maintainersList }
export { getMaintainerAvatar }

import React from 'react'

type Maintainer = {
  username: string
  firstName: string
  roles: React.ReactNode[]
  consultingUrl?: string
  isCoreTeam?: true
}

const maintainersList: Maintainer[] = [
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
    roles: [<>Vike's landing page</>],
  },
  {
    username: 'AurelienLourot',
    firstName: 'Aurélien',
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
    roles: [
      <>
        <code>vike-solid</code> (Contributor)
      </>,
    ],
  },
]

function getMaintainerAvatar(maintainer: Maintainer, imgSize: number) {
  return `https://github.com/${maintainer.username}.png?size=${imgSize}`
}
