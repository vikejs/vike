export default {
  ci: {
    jobs: getCiJobs()
  },
  tolerateError
}

function getCiJobs() {
  const ubuntu16 = {
    os: 'ubuntu-latest',
    node_version: '16'
  }
  const ubuntu20 = {
    os: 'ubuntu-latest',
    // Pin until fix for the following is released
    //   - https://github.com/nodejs/node/issues/49497
    //   - https://github.com/vitejs/vite/issues/14299
    node_version: '20'
  }
  const win16 = {
    os: 'windows-latest',
    node_version: '16'
  }
  const win18 = {
    os: 'windows-latest',
    node_version: '18'
  }
  const mac17 = {
    os: 'macos-latest',
    node_version: '16'
  }

  const setupsExamples = [ubuntu20, win16]

  return [
    {
      name: 'Boilerplates',
      setups: [ubuntu16]
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
      setups: [ubuntu16, mac17, win16]
    },
    {
      name: 'Unit Tests E2E',
      setups: [ubuntu20, win18]
    },
    {
      name: 'Cloudflare',
      setups: [ubuntu16]
    },
    {
      name: 'https://vike.dev',
      setups: [ubuntu20]
    }
  ]
}

function tolerateError({ logSource, logText }) {
  return (
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
    isNotV1Design()
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
  // [08:35:12.487][/examples/preact-client-routing-v1][npm run preview][stderr] The service is no longer running: write EPIPE
  // ```
  function isServiceExit() {
    return (
      logSource === 'stderr' &&
      (logText.includes('The service is no longer running') || logText.includes('The service was stopped'))
    )
  }

  // [vike@0.4.51][Warning] pageContext._getPageAssets() deprecated, see https://vike.dev/preload
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
    return logSource === 'stderr' && logText.includes('Crawling your user files took an unexpected long time')
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
        'You are using the old deprecated design, update to the new V1 design, see https://vike.dev/migration/v1-design'
      )
    )
  }
}
