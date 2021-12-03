export * from 'libframe-docs/_default.page.server'
import { setFrame } from 'libframe-docs/setFrame'
import { headings, headingsWithoutLink } from '../headings'
import { projectInfo } from '../utils'
import logoUrl from '../icons/vite-plugin-ssr.svg'
import React from 'react'
import { NavHeader, NavHeaderMobile } from './NavHeader'

setFrame({
  projectInfo,
  logoUrl,
  navHeaderMobile: <NavHeaderMobile />,
  navHeader: <NavHeader />,
  headings,
  headingsWithoutLink,
})
