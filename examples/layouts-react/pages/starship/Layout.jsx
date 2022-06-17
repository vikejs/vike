export { Layout }

import { LayoutDefault } from '../../renderer/LayoutDefault'
import { PageOuter } from './PageOuter'

function Layout({ children }) {
  return (
    <>
      <LayoutDefault>
        <PageOuter>{children}</PageOuter>
      </LayoutDefault>
    </>
  )
}
