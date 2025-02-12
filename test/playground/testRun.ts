export { testRun }

import path from 'path'
import { fileURLToPath } from 'url'
import { testRunClassic } from '../../test/utils'
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
import { testRedirectMailto } from './pages/redirects.e2e-tests'
import { testHMRPlusValueFile } from './pages/e2e-test'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  const isDev = cmd === 'npm run dev'
  testRunClassic(cmd)
  testSettingsInheritance({ isDev })
  testMarkdown()
  testMarkdownClientFile(isDev)
  testMarkdownSideExports()
  testHMRPlusValueFile(isDev)
  testSettingOnlyAvailableInCorrectEnv()
  testSettingInheritedByDescendants()
  testSettingEffect()
  testPrerenderSettings({ isDev, rootDir })
  testRedirectMailto()
  testNavigateEarly()
  testDynamicImportFileEnv({ isDev })
  testNestedLayout()
  testHistoryPushState()
}
