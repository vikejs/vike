import { prepare } from './prepare'
import { expect, describe, it } from 'vitest'

/*/
// We only use this `prepare()` test for developing the prepare() function. (Because, otherwise, the fixture down below would need to be updated everytime there is a new/(re)moved test file.)
const SKIP = true
/*/
const SKIP = false
//*/

describe('prepare()', () => {
  if (SKIP) {
    const msg = 'SKIPPED prepare() test'
    it(msg, () => {})
    return
  }

  it('basics', async () => {
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
          "jobTests": [
            {
              "testFilePath": ".github/workflows/ci/prepare.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/html/injectAssets/injectHtmlTags.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/html/propKeys.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/createHttpResponse/assertNoInfiniteHttpRedirect.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.snapshot-1",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.snapshot-2",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/logErrorHint/getErrorHint.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/resolveRedirects.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/loggerNotProd/errorWithCodeSnippet/getPrettyErrMessage.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/loggerNotProd/errorWithCodeSnippet/getPrettyErrorWithCodeSnippet.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/crawlPlusFiles/crawlPlusFiles.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/filesystemRouting.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/pointerImports.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/modifyUrl.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/page-configs/getExportPath.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/deduceRouteStringFromFilesystemPath.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolvePrecedence/resolvePrecedence_overall.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolvePrecedence/resolvePrecedence_route-strings.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolveRouteString.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolveUrlPathname.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/freezePartial.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/getValuePrintable.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/isHtml.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/normalizeHeaders.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseNpmPackage.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseUrl-extras.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseUrl.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/preservePropertyGetters.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/trimWithAnsi.spec.ts",
            },
            {
              "testFilePath": "test/assertFileEnv/test-build.spec.ts",
            },
            {
              "testFilePath": "test/preload/__snapshots__/dev.spec.ts.snap",
            },
            {
              "testFilePath": "test/preload/__snapshots__/prod.spec.ts.snap",
            },
            {
              "testFilePath": "test/preload/dev.spec.ts",
            },
            {
              "testFilePath": "test/preload/prod.spec.ts",
            },
            {
              "testFilePath": "test/preload/utils/stabilizeHashes.spec.ts",
            },
            {
              "testFilePath": "test/vitest/dev.spec.ts",
            },
            {
              "testFilePath": "test/vitest/preview.spec.ts",
            },
          ],
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
          "jobTests": [
            {
              "testFilePath": ".github/workflows/ci/prepare.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/html/injectAssets/injectHtmlTags.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/html/propKeys.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/createHttpResponse/assertNoInfiniteHttpRedirect.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.snapshot-1",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.snapshot-2",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/log404/index.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/logErrorHint/getErrorHint.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/runtime/renderPage/resolveRedirects.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/loggerNotProd/errorWithCodeSnippet/getPrettyErrMessage.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/loggerNotProd/errorWithCodeSnippet/getPrettyErrorWithCodeSnippet.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/crawlPlusFiles/crawlPlusFiles.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/filesystemRouting.spec.ts",
            },
            {
              "testFilePath": "packages/vike/node/vite/shared/resolveVikeConfigInternal/pointerImports.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/modifyUrl.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/page-configs/getExportPath.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/deduceRouteStringFromFilesystemPath.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolvePrecedence/resolvePrecedence_overall.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolvePrecedence/resolvePrecedence_route-strings.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolveRouteString.spec.ts",
            },
            {
              "testFilePath": "packages/vike/shared/route/resolveUrlPathname.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/freezePartial.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/getValuePrintable.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/isHtml.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/normalizeHeaders.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseNpmPackage.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseUrl-extras.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/parseUrl.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/preservePropertyGetters.spec.ts",
            },
            {
              "testFilePath": "packages/vike/utils/trimWithAnsi.spec.ts",
            },
            {
              "testFilePath": "test/assertFileEnv/test-build.spec.ts",
            },
            {
              "testFilePath": "test/preload/__snapshots__/dev.spec.ts.snap",
            },
            {
              "testFilePath": "test/preload/__snapshots__/prod.spec.ts.snap",
            },
            {
              "testFilePath": "test/preload/dev.spec.ts",
            },
            {
              "testFilePath": "test/preload/prod.spec.ts",
            },
            {
              "testFilePath": "test/preload/utils/stabilizeHashes.spec.ts",
            },
            {
              "testFilePath": "test/vitest/dev.spec.ts",
            },
            {
              "testFilePath": "test/vitest/preview.spec.ts",
            },
          ],
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
              "testFilePath": "packages/create-vike-core/boilerplate-react-ts/.test-dev.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-react-ts/.test-prod.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-react/.test-dev.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-react/.test-prod.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-vue-ts/.test-dev.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-vue-ts/.test-prod.test.ts",
            },
            {
              "testFilePath": "packages/create-vike-core/boilerplate-vue/.test-dev.test.ts",
            },
            {
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
              "testFilePath": "examples/file-structure-domain-driven/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/file-structure-domain-driven/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/i18n/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/i18n/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/path-aliases/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/path-aliases/.test-prod-static.test.ts",
            },
            {
              "testFilePath": "examples/path-aliases/.test-prod.test.ts",
            },
            {
              "testFilePath": "examples/react-full/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/react-full/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/react-minimal/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/react-minimal/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/react-streaming/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/react-streaming/.test-prod.test.ts",
            },
            {
              "testFilePath": "examples/render-modes/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/render-modes/.test-prod.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/file-structure-domain-driven/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/file-structure-domain-driven/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/i18n/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/i18n/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/path-aliases/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/path-aliases/.test-prod-static.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/path-aliases/.test-prod.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/react-streaming/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/react-streaming/.test-prod.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/react/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/react/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/render-modes/.test-dev.test.ts",
            },
            {
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
              "testFilePath": "examples/html-fragments/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/html-fragments/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/telefunc/.dev.test.ts",
            },
            {
              "testFilePath": "examples/telefunc/.prod.test.ts",
            },
            {
              "testFilePath": "examples/vue-full/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/vue-full/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/vue-minimal/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/vue-minimal/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/html-fragments/.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/telefunc/.dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/telefunc/.prod.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/vue-full/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/vue-full/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/vue/.test-dev.test.ts",
            },
            {
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
              "testFilePath": "examples/auth/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/auth/.test-prod.test.ts",
            },
            {
              "testFilePath": "examples/base-url-cdn/.test.ts",
            },
            {
              "testFilePath": "examples/base-url-server/.test.ts",
            },
            {
              "testFilePath": "examples/base-url/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/base-url/.test-preview.test.ts",
            },
            {
              "testFilePath": "examples/custom-preload/.test-preview.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/base-url-cdn/.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/base-url-server/.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/base-url/.test-dev.test.ts",
            },
            {
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
              "testFilePath": "test/abort/test-dev-server.test.ts",
            },
            {
              "testFilePath": "test/abort/test-dev.test.ts",
            },
            {
              "testFilePath": "test/abort/test-preview.test.ts",
            },
            {
              "testFilePath": "test/abort/test-prod.test.ts",
            },
            {
              "testFilePath": "test/assertFileEnv/test-dev.test.ts",
            },
            {
              "testFilePath": "test/cjs/test-dev.test.ts",
            },
            {
              "testFilePath": "test/cjs/test-prod.test.ts",
            },
            {
              "testFilePath": "test/disableAutoImporter/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/disableAutoImporter/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/env/.test-build.test.ts",
            },
            {
              "testFilePath": "test/env/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/environment-api/test-dev.test.ts",
            },
            {
              "testFilePath": "test/environment-api/test-preview.test.ts",
            },
            {
              "testFilePath": "test/hook-override/test-dev.test.ts",
            },
            {
              "testFilePath": "test/hook-override/test-preview.test.ts",
            },
            {
              "testFilePath": "test/includeAssetsImportedByServer/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/includeAssetsImportedByServer/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/playground/test-dev.test.ts",
            },
            {
              "testFilePath": "test/playground/test-preview.test.ts",
            },
            {
              "testFilePath": "test/require-shim/test-prod.test.ts",
            },
            {
              "testFilePath": "test/stream-vue-onServerPrefetch/test-dev.test.ts",
            },
            {
              "testFilePath": "test/stream-vue-onServerPrefetch/test-preview.test.ts",
            },
            {
              "testFilePath": "test/universal-middleware/test-dev.test.ts",
            },
            {
              "testFilePath": "test/universal-middleware/test-preview.test.ts",
            },
            {
              "testFilePath": "test/vike-cloudflare/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-cloudflare/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/vike-react/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-react/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/vike-server/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-server/.test-prod.test.ts",
            },
            {
              "testFilePath": "test/vike-solid/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-solid/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/vike-vercel/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-vercel/.test-prod.test.ts",
            },
            {
              "testFilePath": "test/vike-vue/.test-dev.test.ts",
            },
            {
              "testFilePath": "test/vike-vue/.test-preview.test.ts",
            },
            {
              "testFilePath": "test/webpack/.test-dev.test.ts",
            },
            {
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
              "testFilePath": "examples/cloudflare-workers-react-full/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/cloudflare-workers-react-full/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "examples/cloudflare-workers-react/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/cloudflare-workers-react/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "examples/cloudflare-workers-vue/.test-dev.test.ts",
            },
            {
              "testFilePath": "examples/cloudflare-workers-vue/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-react-full/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-react-full/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-react/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-react/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-vue/.test-dev.test.ts",
            },
            {
              "testFilePath": "test-deprecated-design/cloudflare-workers-vue/.test-wrangler.test.ts",
            },
            {
              "testFilePath": "test/@cloudflare_vite-plugin/test-dev.test.ts",
            },
            {
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
              "testFilePath": "docs/.test-dev.test.ts",
            },
            {
              "testFilePath": "docs/.test-preview.test.ts",
            },
          ],
        },
      ]
    `)
  })
})
