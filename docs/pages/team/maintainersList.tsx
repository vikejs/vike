export { maintainersList }
export { getMaintainerAvatar }
export { getMaintainer }
export type { MaintainerUsername }
export type { Maintainer }

import React from 'react'
import { teamData } from './teamData'

type MaintainerUsername = (typeof teamData)[number]['username']
type Maintainer = (typeof teamData)[number] & { roles: React.ReactNode[] }

const rolesByUsername: Record<MaintainerUsername, React.ReactNode[]> = {
  brillout: [
    <>Vike (Lead Maintainer, Creator)</>,
    <>
      <code>vike-react</code> (Lead Maintainer, Creator)
    </>,
    <>
      <code>vike-vue</code> (Contributor)
    </>,
  ],
  magne4000: [
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
  nitedani: [
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
  'richard-unterberg': [
    <>
      🚧 <a href="https://github.com/richard-unterberg/nivel">Nivel</a> — Vike's new docs website
    </>,
    <>Vike's landing page</>,
  ],
  ambergristle: [
    <>
      <a href="https://github.com/telefunc/telefunc/pull/240">Telefunc docs overhaul</a>
    </>,
  ],
  phonzammi: [
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
  NilsJacobsen: [<>Vike's landing page</>],
  lourot: [
    <>
      <code>vike-vue</code> (Contributor)
    </>,
    <>
      <code>vike-react</code> (Contributor)
    </>,
    <>Vike Core (Contributor)</>,
  ],
  '4350pChris': [
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
  Blankeos: [
    <>
      <code>vike-solid</code> (Contributor)
    </>,
  ],
  louwers: [
    <>
      <a href="https://github.com/telefunc/telefunc/pull/25">Telefunc's runtime validation</a>
    </>,
  ],
}

const maintainersList: Maintainer[] = teamData.map((m) => ({
  ...m,
  roles: rolesByUsername[m.username],
}))

function getMaintainer(maintainerUsername: MaintainerUsername): Maintainer {
  return maintainersList.find((maintainer) => maintainer.username === maintainerUsername)!
}

function getMaintainerAvatar(maintainer: Maintainer, imgSize: number): string {
  const scale = 4 // slightly better on desktop, massively bebter on mobile
  return `https://github.com/${maintainer.username}.png?size=${imgSize * scale}`
}
