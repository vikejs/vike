import type { Config } from '@brillout/docpress'
import { headings } from './headings'
import { headingsDetached } from './headingsDetached'
import { projectInfo } from './utils'
import faviconUrl from './images/icons/vike.svg'
import React from 'react'
import { NavHeader, NavHeaderMobile } from './NavHeader'

export default {
  projectInfo,
  faviconUrl,
  navHeader: <NavHeader />,
  navHeaderMobile: <NavHeaderMobile />,
  headings,
  headingsDetached,
  tagline: 'Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin.',
  titleNormalCase: false,
  twitterHandle: '@brillout',
  websiteUrl: 'https://vike.dev',
  algolia: { PENDING_APPROVAL: true },
  bannerUrl: 'https://vike.dev/banner.png',
  i18n: true,
  globalNote: <GlobalNoteRename />
} satisfies Config

function GlobalNoteRename() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <blockquote>
          <p>
            <a href="https://vite-plugin-ssr.com"></a>
            <code>vite-plugin-ssr</code> has been renamed Vike, see <a href="https://vite-plugin-ssr.com/vike">migration guide</a>.
          </p>
        </blockquote>
      </div>
    </>
  )
}
