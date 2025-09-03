export { testRun }

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { testRunClassic } from '../../test/utils'

import {
  testGlobalContext,
  testHMRPlusValueFile,
  testHooksCalled,
  testOnCreateGlobalContext,
  testRedirectMailto,
  testHeadersResponse,
} from './pages/e2e-test'

import { testSettingsInheritance } from './pages/about-page/e2e-test'
import { testSettingEffect } from './pages/config-meta/effect/e2e-test'
import { testSettingInheritedByDescendants } from './pages/config-meta/cumulative/e2e-test'
import { testSettingOnlyAvailableInCorrectEnv } from './pages/config-meta/env/e2e-test'
import { testDynamicImportFileEnv } from './pages/dynamic-import-file-env/e2e-test'
import { testMarkdown, testMarkdownClientFile, testMarkdownSideExports } from './pages/markdown/e2e-test'
import { testNavigateEarly } from './pages/navigate-early/e2e-test'
import { testNestedLayout } from './pages/nested-layout/e2e-test'
import { testPrerenderSettings } from './pages/prerender.e2e-test'
import { testHistoryPushState } from './pages/pushState/e2e-test'
import { testStarWars } from './pages/star-wars/e2e-test'
import { testDefaultAndClearSuffixes } from './pages/config-meta/default-clear/e2e-test'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  const isDev = cmd === 'npm run dev'
  testRunClassic(cmd, { testHmr: './pages/index/Page.tsx' })
  testSettingsInheritance({ isDev })
  testMarkdown()
  testMarkdownClientFile(isDev)
  testMarkdownSideExports()
  testGlobalContext()
  testOnCreateGlobalContext(isDev)
  testHooksCalled()
  testHeadersResponse()
  testHMRPlusValueFile(isDev)
  testSettingOnlyAvailableInCorrectEnv()
  testSettingInheritedByDescendants()
  testSettingEffect()
  testPrerenderSettings({ isDev, rootDir })
  testRedirectMailto(isDev)
  testNavigateEarly()
  testDynamicImportFileEnv({ isDev })
  testNestedLayout()
  testDefaultAndClearSuffixes()
  testHistoryPushState()
  testStarWars()
}
