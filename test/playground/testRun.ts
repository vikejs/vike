export { testRun }

import path from 'path'
import { fileURLToPath } from 'url'
import { testRun as testRunClassic } from '../../examples/react-minimal/.testRun'
import aboutTests from './pages/about/about.e2e-test'
import effectTests from './pages/config-meta/effect/effects.e2e-test'
import inheritanceTests from './pages/config-meta/cumulative/cumulative.e2e-test'
import envTests from './pages/config-meta/env/env.e2e-test'
import dynamicImportFileEnvTests from './pages/dynamic-import-file-env/dynamicImportFileEnv.e2e-test'
import sideExportTests from './pages/markdown-page/sideExports.e2e-test'
import navigateEarlyTests from './pages/navigate-early/navigateEarly.e2e-test'
import nestedLayoutTest from './pages/nested-layout/nestedLayout.e2e-test'
import prerenderTests from './pages/prerender.e2e-test'
import historyTests from './pages/pushState/history.e2e-test'
import redirectTests from './pages/redirects.e2e-tests'
const rootDir = path.dirname(fileURLToPath(import.meta.url))

function testRun(cmd: 'npm run dev' | 'npm run preview' | 'npm run prod') {
  const isDev = cmd === 'npm run dev'
  testRunClassic(cmd)
  const tests: ((args: {
    isDev: boolean
    rootDir: string
  }) => void)[] = [
    ...aboutTests,
    ...envTests,
    ...inheritanceTests,
    ...effectTests,
    ...sideExportTests,
    ...prerenderTests,
    ...redirectTests,
    ...navigateEarlyTests,
    ...dynamicImportFileEnvTests,
    ...nestedLayoutTest,
    ...historyTests
  ]
  tests.forEach((t) => t({ isDev, rootDir }))
}
