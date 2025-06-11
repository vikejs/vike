export default {
  ci: {
    jobs: getCiJobs()
  },
  tolerateError
}

function getCiJobs() {
  const linux_nodeOld = {
    os: 'ubuntu-latest',
    node_version: '18'
  }
  const linux_nodeNew = {
    os: 'ubuntu-latest',
    node_version: '22'
  }
  const windows_nodeOld = {
    os: 'windows-latest',
    node_version: '18'
  }

  const setupsExamples = [linux_nodeNew, windows_nodeOld]

  return [
    {
      name: 'Boilerplates',
      setups: [linux_nodeOld]
    },
    {
      name: 'Examples React',
      setups: setupsExamples
    },
    {
      name: 'Examples Vue/Others',
      setups: setupsExamples
    },
    {
      name: 'Examples Misc',
      setups: [linux_nodeOld, windows_nodeOld]
    },
    {
      name: 'Unit Tests E2E',
      setups: [linux_nodeNew, windows_nodeOld]
    },
    {
      name: 'Cloudflare',
      setups: [linux_nodeNew]
    },
    {
      name: 'https://vike.dev',
      setups: [linux_nodeNew]
    }
  ]
}

function tolerateError({ logSource, logText, testInfo }) {
  return (
    [
      // [23:54:58.279][/test-preview.test.ts][npm run preview][stderr] 11:54:58 PM [vike][Warning] getGlobalContextSync() is going to be deprecated in the next major release, see https://vike.dev/getGlobalContext
      'getGlobalContextSync() is going to be deprecated',

      // Required for Cloudflare tests
      // [14:00:34.879][/][npm run preview][stderr] [vike][Warning] process.env.NODE_ENV==="undefined" which is unexpected: process.env.NODE_ENV is allowed to be the *value* undefined (i.e. process.env.NODE_ENV===undefined) but it shouldn't be the *string* "undefined" https://vike.dev/NODE_ENV
      'process.env.NODE_ENV==="undefined" which is unexpected',

      // Required for test-deprecated-design/*
      'Define Vike settings in +config.js instead of vite.config.js',

      // Required for test-deprecated-design/*
      'vite.createServer() is deprecated',

      // Required for test-deprecated-design/*
      "Vite's CLI is deprecated",

      // Error: [DocPress][Warning] prop `text` is deprecated
      'prop `text` is deprecated',

      // [11:00:51.986][/test/cjs/test-dev.test.ts][npm run dev][stderr] (node:3061) ExperimentalWarning: CommonJS module /home/runner/work/vike/vike/vike/dist/cjs/node/plugin/index.js is loading ES Module /home/runner/work/vike/vike/node_modules/.pnpm/vite@6.0.5_@types+node@20.13.0_terser@5.31.0_tsx@4.19.2/node_modules/vite/dist/node/index.js using require().
      // Support for loading ES Module in require() is an experimental feature and might change at any time
      'loading ES Module in require() is an experimental feature',

      // (node:4188) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
      'The `punycode` module is deprecated.',

      // (node:4117) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
      'fs.Stats constructor is deprecated.',

      'The glob option "as" has been deprecated in favour of "query"',

      // [vike][request(1)][Warning] The onBeforeRender() hook defined by /renderer/+onBeforeRender.js is slow: it's taking more than 4 seconds (https://vike.dev/hooksTimeout)
      "is slow: it's taking more than"
    ].some((t) => logText.includes(t)) ||
    // [11:27:09.496][/test/playground/test-preview.test.ts][npm run preview][stderr] 11:27:09 AM [vike][Warning] Dynamic redirect /product/@id -> /buy/@id cannot be pre-rendered
    (logText.includes('Dynamic redirect') && logText.includes('cannot be pre-rendered')) ||
    //
    // TO-DO/eventually: move everything to the array above
    isViteCjsWarning() ||
    isRenderErrorPageDeprecationWarning() ||
    isSlowHookWarning() ||
    isServiceExit() ||
    isGetPageAssetsDeprecationWarning() ||
    isDocpressAssetWarning() ||
    isSourceMapWarning() ||
    isCloudflareFalseError1() ||
    isCloudflareFalseError2() ||
    isCloudflareVueWarning() ||
    isCloudflarePrewarmWarning() ||
    isTwitterEmbedsError() ||
    isGithubImageError() ||
    isSlowCrawlWarning() ||
    isNodeExperimentalEsmLoader() ||
    isNodeExperimentalLoader() ||
    isNotV1Design() ||
    isVitePluginVercelWarning()
  )

  function isViteCjsWarning() {
    return logSource === 'stderr' && logText.includes("The CJS build of Vite's Node API is deprecated")
  }

  function isRenderErrorPageDeprecationWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('[Warning]') &&
      logText.includes('throw RenderErrorPage()') &&
      logText.includes(
        'is deprecated and will be removed in the next major release. Use throw render() or throw redirect() instead'
      )
    )
  }

  // [vike@0.4.42][Warning] The onBeforeRender() hook of /pages/star-wars/index/index.page.server.ts is taking more than 4 seconds
  function isSlowHookWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('[Warning]') &&
      logText.includes('hook') &&
      logText.includes('is taking more than 4 seconds')
    )
  }

  // These seems to come from esbuild
  // ```
  // [16:41:56.607][\examples\preact-server-routing][npm run preview][stderr] 4:41:56 PM [vite] Internal server error: The service was stopped
  //   Plugin: vite:esbuild
  //   File: D:/a/vike/vike/examples/preact-server-routing/renderer/_error.page.jsx
  //       at D:\a\vike\vike\node_modules\.pnpm\esbuild@0.14.47\node_modules\esbuild\lib\main.js:1381:29
  // ```
  // [16:10:29.456][\examples\preact-client-routing][npm run preview][stderr] 4:10:29 PM [vite] Internal server error: The service is no longer running
  // ```
  // [16:38:26.428][\examples\i18n][npm run dev][stderr] Error: The service was stopped
  //     at D:\a\vike\vike\node_modules\.pnpm\esbuild@0.14.47\node_modules\esbuild\lib\main.js:1381:29
  // ```
  // [08:35:12.487][/examples/preact-client-routing][npm run preview][stderr] The service is no longer running: write EPIPE
  // ```
  function isServiceExit() {
    return (
      logSource === 'stderr' &&
      (logText.includes('The service is no longer running') || logText.includes('The service was stopped'))
    )
  }

  // [vike@0.4.51][Warning] pageContext._getPageAssets() deprecated, see https://vike.dev/preloading
  function isGetPageAssetsDeprecationWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('[vike@') &&
      logText.includes('[Warning]') &&
      logText.includes('pageContext._getPageAssets() deprecated')
    )
  }

  // /assets/Inter-Var-IOAEQULN.ttf referenced in /home/runner/work/vike/vike/node_modules/.pnpm/@brillout+docpress@0.1.12_6bdbsu2yzpeczxw5qylih75b3i/node_modules/@brillout/docpress/dist/renderer/_default.page.client.css?used didn't resolve at build time, it will remain unchanged to be resolved at runtime
  function isDocpressAssetWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes("didn't resolve at build time, it will remain unchanged to be resolved at runtime") &&
      logText.includes('node_modules/@brillout/docpress')
    )
  }

  function isSourceMapWarning() {
    return logSource === 'stderr' && logText.includes('Sourcemap for "/@react-refresh" points to missing source files')
  }

  function isCloudflareFalseError1() {
    return (
      logSource === 'stderr' &&
      logText.includes(
        'Enabling node.js compatibility mode for built-ins and globals. This is experimental and has serious tradeoffs.'
      )
    )
  }
  function isCloudflareFalseError2() {
    return logSource === 'stderr' && logText.includes('Script modified; context reset.')
  }
  function isCloudflareVueWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ are not explicitly defined.')
    )
  }
  function isCloudflarePrewarmWarning() {
    return logSource === 'stderr' && logText.includes('worker failed to prewarm')
  }
  function isTwitterEmbedsError() {
    return (
      logSource === 'Browser Error' &&
      logText.includes('https://syndication.twitter.com') &&
      logText.includes('the server responded with a status of 403')
    )
  }
  function isGithubImageError() {
    return (
      logSource === 'Browser Error' &&
      logText.includes('https://github.com/') &&
      logText.includes('.png') &&
      logText.includes('the server responded with a status of 429')
    )
  }
  function isSlowCrawlWarning() {
    return logSource === 'stderr' && logText.includes('Crawling your + files took an unexpected long time')
  }

  function isNodeExperimentalEsmLoader() {
    return (
      logSource === 'stderr' && logText.includes('ExperimentalWarning: Custom ESM Loaders is an experimental feature')
    )
  }
  function isNodeExperimentalLoader() {
    return logSource === 'stderr' && logText.includes('ExperimentalWarning: `--experimental-loader` may be removed')
  }
  function isNotV1Design() {
    return (
      logSource === 'stderr' &&
      logText.includes(
        "You are using Vike's deprecated design. Update to the new V1 design, see https://vike.dev/migration/v1-design for how to migrate."
      )
    )
  }

  // [19:47:42.746][\test\vike-vercel\.test-prod.test.ts][npm run prod][stderr] .vercel\output\functions\ssr_.func\index.mjs  2.4mb
  // [19:47:42.746][\test\vike-vercel\.test-prod.test.ts][npm run prod][stderr] Done in 181ms
  function isVitePluginVercelWarning() {
    return (
      logText.replaceAll('\\', '/').includes('.vercel/output/functions') ||
      (testInfo?.testFile?.includes('vike-vercel') && logText.includes('Done in')) ||
      // Let's skip all test/vike-vercel/ warnings for now: https://github.com/magne4000/vite-plugin-vercel/issues/134#issuecomment-2596842125
      testInfo?.testFile?.includes('vike-vercel')
    )
  }
}
