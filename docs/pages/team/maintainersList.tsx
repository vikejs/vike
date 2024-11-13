export { maintainerList }

import React from 'react'

type Maintainer = {
  username: string
  firstName: string
  roles: React.ReactNode[]
  consultingUrl?: string
}

const maintainerList: Maintainer[] = [
  {
    username: 'brillout',
    firstName: 'Rom',
    roles: [
      <>Vike Core (Lead Maintainer, Creator)</>,
      <>
        <code>vike-react</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-vue</code> (Contributor)
      </>
    ]
  },
  {
    username: 'magne4000',
    firstName: 'Joël',
    roles: [
      <>Bati (Lead Maintainer, Creator)</>,
      <>
        <code>universal-middleware</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-solid</code> (Lead Maintainer, Creator)
      </>,
      <>Vike Core (Contributor)</>
    ]
  },
  {
    username: 'nitedani',
    firstName: 'Dániel',
    roles: [
      <>
        <code>vike-react-query</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-react-apollo</code> (Lead Maintainer, Creator)
      </>,
      <>
        <code>vike-node</code> (Lead Maintainer, Creator)
      </>,
      <>Vike Core (Contributor)</>
    ]
  },
  {
    username: 'phonzammi',
    firstName: 'Muhammad',
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
      <>Bati (Contributor)</>
    ]
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
      <>Vike Core (Contributor)</>
    ]
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
      </>
    ]
  }
]
