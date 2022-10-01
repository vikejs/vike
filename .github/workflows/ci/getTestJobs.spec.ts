import { getTestJobs } from './getTestJobs.mjs'
import { expect, describe, it } from 'vitest'

//*/
// We only use this `getTestJobs()` test for developing the getTestJobs() function. (Because, otherwise, the fixture down below would need to be updated everytime there is a new/(re)moved test file.)
const SKIP = true
/*/
const SKIP = false
//*/

describe('getTestJobs()', () => {
  if (SKIP) {
    const msg = 'SKIPPED getTestJobs() test'
    it(msg, () => {})
    return
  }

  it('basics', () => {
    const jobs = getTestJobs()
    expect(jobs).toMatchInlineSnapshot(`
      [
        {
          "jobCmd": "pnpm run test:units",
          "jobName": "Unit Tests",
          "jobSetups": [
            {
              "node_version": "14",
              "os": "windows-latest",
            },
          ],
          "jobTestFiles": [
            ".github/workflows/ci/getTestJobs.spec.ts",
            "test/renderPage.spec.ts",
            "vite-plugin-ssr/shared/route/deduceRouteStringFromFilesystemPath.spec.ts",
            "vite-plugin-ssr/shared/route/resolvePrecedence/overall.spec.ts",
            "vite-plugin-ssr/shared/route/resolvePrecedence/route-strings.spec.ts",
            "vite-plugin-ssr/shared/route/resolveRouteString.spec.ts",
            "vite-plugin-ssr/utils/parseUrl.spec.ts",
          ],
        },
        {
          "jobCmd": "pnpm run test:types",
          "jobName": "TypeScript",
          "jobSetups": [
            {
              "node_version": "18",
              "os": "ubuntu-latest",
            },
          ],
        },
        {
          "jobCmd": "pnpm run test:e2e",
          "jobName": "Examples React",
          "jobSetups": [
            {
              "node_version": "16",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "14",
              "os": "windows-latest",
            },
          ],
          "jobTestFiles": [
            "examples/base-url-cdn/.test.ts",
            "examples/base-url/.test-dev.test.ts",
            "examples/base-url/.test-preview.test.ts",
            "examples/custom-server-render-integration/.test-dev.test.ts",
            "examples/custom-server-render-integration/.test-prod.test.ts",
            "examples/file-structure-domain-driven/.test-dev.test.ts",
            "examples/file-structure-domain-driven/.test-preview.test.ts",
            "examples/graphql-apollo-react/.test-dev.test.ts",
            "examples/graphql-apollo-react/.test-prod.test.ts",
            "examples/i18n/.test-dev.test.ts",
            "examples/i18n/.test-preview.test.ts",
            "examples/layouts-react/.test-dev.test.ts",
            "examples/layouts-react/.test-preview.test.ts",
            "examples/path-aliases/.test-dev.test.ts",
            "examples/path-aliases/.test-prod-static.test.ts",
            "examples/path-aliases/.test-prod.test.ts",
            "examples/react-17/.test-dev.test.ts",
            "examples/react-17/.test-preview.test.ts",
            "examples/react-full/.test-dev.test.ts",
            "examples/react-full/.test-preview.test.ts",
            "examples/react-router/.test.ts",
            "examples/react/.test-dev.test.ts",
            "examples/react/.test-preview.test.ts",
            "examples/redux/.test.ts",
            "examples/render-modes/.test-dev.test.ts",
            "examples/render-modes/.test-preview.test.ts",
            "examples/urql/.test-dev.test.ts",
            "examples/urql/.test-preview.test.ts",
          ],
        },
        {
          "jobCmd": "pnpm run test:e2e",
          "jobName": "Examples Vue/Others",
          "jobSetups": [
            {
              "node_version": "16",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "14",
              "os": "windows-latest",
            },
          ],
          "jobTestFiles": [
            "examples/graphql-apollo-vue/.test-dev.test.ts",
            "examples/graphql-apollo-vue/.test-prod.test.ts",
            "examples/html-fragments/.test.ts",
            "examples/layouts-vue/.test-dev.test.ts",
            "examples/layouts-vue/.test-preview.test.ts",
            "examples/preact-client-routing/.test-dev.test.ts",
            "examples/preact-client-routing/.test-preview.test.ts",
            "examples/preact-server-routing/.test-dev.test.ts",
            "examples/preact-server-routing/.test-preview.test.ts",
            "examples/vue-full/.test-dev.test.ts",
            "examples/vue-full/.test-preview.test.ts",
            "examples/vue-pinia/.test.ts",
            "examples/vue-router/.test.ts",
            "examples/vue/.test-dev.test.ts",
            "examples/vue/.test-preview.test.ts",
            "examples/vuex/.test.ts",
          ],
        },
        {
          "jobCmd": "pnpm run test:e2e",
          "jobName": "Boilerplates",
          "jobSetups": [
            {
              "node_version": "17",
              "os": "macos-latest",
            },
          ],
          "jobTestFiles": [
            "boilerplates/boilerplate-react-ts/.test-dev.test.ts",
            "boilerplates/boilerplate-react-ts/.test-prod.test.ts",
            "boilerplates/boilerplate-react/.test-dev.test.ts",
            "boilerplates/boilerplate-react/.test-prod.test.ts",
            "boilerplates/boilerplate-vue-ts/.test-dev.test.ts",
            "boilerplates/boilerplate-vue-ts/.test-prod.test.ts",
            "boilerplates/boilerplate-vue/.test-dev.test.ts",
            "boilerplates/boilerplate-vue/.test-prod.test.ts",
          ],
        },
        {
          "jobCmd": "pnpm run test:e2e",
          "jobName": "Cloudflare",
          "jobSetups": [
            {
              "node_version": "16",
              "os": "ubuntu-latest",
            },
          ],
          "jobTestFiles": [
            "examples/cloudflare-workers-react-full/.test-dev.test.ts",
            "examples/cloudflare-workers-react-full/.test-wrangler.test.ts",
            "examples/cloudflare-workers-react/.test-dev.test.ts",
            "examples/cloudflare-workers-react/.test-preview.test.ts",
            "examples/cloudflare-workers-vue/.test-dev.test.ts",
            "examples/cloudflare-workers-vue/.test-wrangler.test.ts",
          ],
        },
        {
          "jobCmd": "pnpm run test:e2e",
          "jobName": "https://vite-plugin-ssr.com",
          "jobSetups": [
            {
              "node_version": "17",
              "os": "ubuntu-latest",
            },
          ],
          "jobTestFiles": [
            "docs/.test-dev.test.ts",
            "docs/.test-preview.test.ts",
          ],
        },
      ]
    `)
  })
})
