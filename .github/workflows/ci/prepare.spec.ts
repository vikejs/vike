import { prepare } from './prepare'
import { expect, describe, it } from 'vitest'

describe('prepare()', () => {
  it('fixture', async () => {
    const jobs = await prepare()
    expect(jobs).toMatchInlineSnapshot(`
      [
        {
          "jobCmd": "pnpm exec vitest run --project unit",
          "jobName": "Vitest (unit tests)",
          "jobSetups": [
            {
              "node_version": "18",
              "os": "ubuntu-latest",
            },
          ],
          "jobTests": null,
        },
        {
          "jobCmd": "pnpm exec vitest run --project e2e",
          "jobName": "Vitest (E2E tests)",
          "jobSetups": [
            {
              "node_version": "18",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "18",
              "os": "windows-latest",
            },
          ],
          "jobTests": null,
        },
        {
          "jobCmd": "pnpm exec test-types",
          "jobName": "TypeScript",
          "jobSetups": [
            {
              "node_version": "18",
              "os": "ubuntu-latest",
            },
          ],
          "jobTests": null,
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Boilerplates",
          "jobSetups": [
            {
              "node_version": "20",
              "os": "ubuntu-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-react-ts/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-react-ts/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-react/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-react/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-vue-ts/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-vue-ts/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-vue/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Boilerplates",
                },
              },
              "testFilePath": "packages/create-vike-core/boilerplate-vue/.test-prod.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Examples React",
          "jobSetups": [
            {
              "node_version": "22",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "20",
              "os": "windows-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/file-structure-domain-driven/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/file-structure-domain-driven/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/i18n/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/i18n/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/path-aliases/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/path-aliases/.test-prod-static.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/path-aliases/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-full/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-full/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-minimal/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-minimal/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-streaming/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/react-streaming/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/render-modes/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "examples/render-modes/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/file-structure-domain-driven/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/file-structure-domain-driven/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/i18n/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/i18n/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/path-aliases/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/path-aliases/.test-prod-static.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/path-aliases/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/react-streaming/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/react-streaming/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/react/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/react/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/render-modes/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples React",
                },
              },
              "testFilePath": "test-deprecated-design/render-modes/.test-preview.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Examples Vue/Others",
          "jobSetups": [
            {
              "node_version": "22",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "20",
              "os": "windows-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/html-fragments/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/html-fragments/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/telefunc/.dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/telefunc/.prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/vue-full/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/vue-full/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/vue-minimal/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "examples/vue-minimal/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/html-fragments/.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/telefunc/.dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/telefunc/.prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/vue-full/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/vue-full/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/vue/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Vue/Others",
                },
              },
              "testFilePath": "test-deprecated-design/vue/.test-preview.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Examples Misc",
          "jobSetups": [
            {
              "node_version": "20",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "20",
              "os": "windows-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/auth/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/auth/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/base-url-cdn/.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/base-url-server/.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/base-url/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/base-url/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "examples/custom-preload/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "test-deprecated-design/base-url-cdn/.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "test-deprecated-design/base-url-server/.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "test-deprecated-design/base-url/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Examples Misc",
                },
              },
              "testFilePath": "test-deprecated-design/base-url/.test-preview.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Unit Tests E2E",
          "jobSetups": [
            {
              "node_version": "22",
              "os": "ubuntu-latest",
            },
            {
              "node_version": "20",
              "os": "windows-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/abort/test-dev-server.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/abort/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/abort/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/abort/test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/assertFileEnv/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/cjs/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/cjs/test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/disableAutoImporter/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/disableAutoImporter/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/env/.test-build.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/env/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/environment-api/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/environment-api/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/hook-override/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/hook-override/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/includeAssetsImportedByServer/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/includeAssetsImportedByServer/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/playground/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/playground/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/require-shim/test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/stream-vue-onServerPrefetch/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/stream-vue-onServerPrefetch/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/universal-middleware/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/universal-middleware/test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-cloudflare/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-cloudflare/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-react/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-react/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-server/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-server/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-solid/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-solid/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-vercel/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-vercel/.test-prod.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-vue/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/vike-vue/.test-preview.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/webpack/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Unit Tests E2E",
                },
              },
              "testFilePath": "test/webpack/.test-preview.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "Cloudflare",
          "jobSetups": [
            {
              "node_version": "22",
              "os": "ubuntu-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-react-full/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-react-full/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-react/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-react/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-vue/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "examples/cloudflare-workers-vue/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-react-full/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-react-full/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-react/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-react/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-vue/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test-deprecated-design/cloudflare-workers-vue/.test-wrangler.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test/@cloudflare_vite-plugin/test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "Cloudflare",
                },
              },
              "testFilePath": "test/@cloudflare_vite-plugin/test-preview.test.ts",
            },
          ],
        },
        {
          "jobCmd": "pnpm exec test-e2e",
          "jobName": "https://vike.dev",
          "jobSetups": [
            {
              "node_version": "22",
              "os": "ubuntu-latest",
            },
          ],
          "jobTests": [
            {
              "localConfig": {
                "ci": {
                  "job": "https://vike.dev",
                },
              },
              "testFilePath": "docs/.test-dev.test.ts",
            },
            {
              "localConfig": {
                "ci": {
                  "job": "https://vike.dev",
                },
              },
              "testFilePath": "docs/.test-preview.test.ts",
            },
          ],
        },
      ]
    `)
  })
})
