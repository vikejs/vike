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
  // TODO: remove @ts-ignore once https://github.com/vikejs/libframe/pull/1 is merged
  // @ts-ignore
  algolia: {
    apiKey: '7d2798346ba008ae4902b49b097b6e6a',
    indexName: 'vite-pluginssr',
  },
  navHeaderMobile: <NavHeaderMobile />,
  navHeader: <NavHeader />,
  headings,
  headingsWithoutLink,
})
