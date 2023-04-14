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
  const ubuntu17 = {
    os: 'ubuntu-latest',
    node_version: '17'
  }
  const ubuntu18 = {
    os: 'ubuntu-latest',
    node_version: '18'
  }
  const win14 = {
    os: 'windows-latest',
    node_version: '14'
  }
  const win18 = {
    os: 'windows-latest',
    node_version: '18'
  }
  const mac17 = {
    os: 'macos-latest',
    node_version: '17'
  }

  const setupsExamples = [ubuntu16, win14]

  return [
    {
      name: 'Boilerplates',
      setups: [ubuntu18]
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
      setups: [ubuntu16, win14, mac17]
    },
    {
      name: 'Unit Tests E2E',
      setups: [win18, ubuntu16]
    },
    {
      name: 'Cloudflare',
      setups: [ubuntu16]
    },
    {
      name: 'https://vite-plugin-ssr.com',
      setups: [ubuntu17]
    },
    {
      name: 'pageFilesSrc',
      setups: [ubuntu17]
    }
  ]
}

function tolerateError({ logSource, logText }) {
  return (
    isSlowHookWarning() ||
    isNoErrorPageWarning() ||
    isViteEsbuildBug() ||
    isGetPageAssetsDeprecationWarning() ||
    isDocpressAssetWarning() ||
    isSourceMapWarning() ||
    isCloudflareFalseError1() ||
    isCloudflareFalseError2() ||
    isCloudflareVueWarning() ||
    isTwitterEmbedsError() ||
    isGithubImageError()
  )

  // [vite-plugin-ssr@0.4.42][Warning] The onBeforeRender() hook of /pages/star-wars/index/index.page.server.ts is taking more than 4 seconds
  function isSlowHookWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('[Warning]') &&
      logText.includes('hook') &&
      logText.includes('is taking more than 4 seconds')
    )
  }

  // [vite-plugin-ssr@0.4.42][Warning] No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)
  function isNoErrorPageWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes(
        'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)'
      )
    )
  }

  // ```bash
  // [16:10:29.456][\examples\preact-client-routing][npm run preview][stderr] 4:10:29 PM [vite] Internal server error: The service is no longer running
  // ```
  // ```bash
  // [16:38:26.428][\examples\i18n][npm run dev][stderr] Error: The service was stopped
  //     at D:\a\vite-plugin-ssr\vite-plugin-ssr\node_modules\.pnpm\esbuild@0.14.47\node_modules\esbuild\lib\main.js:1381:29
  // ```
  // ```bash
  // [16:41:56.607][\examples\preact-server-routing][npm run preview][stderr] 4:41:56 PM [vite] Internal server error: The service was stopped
  //   Plugin: vite:esbuild
  //   File: D:/a/vite-plugin-ssr/vite-plugin-ssr/examples/preact-server-routing/renderer/_error.page.jsx
  //       at D:\a\vite-plugin-ssr\vite-plugin-ssr\node_modules\.pnpm\esbuild@0.14.47\node_modules\esbuild\lib\main.js:1381:29
  // ```
  function isViteEsbuildBug() {
    return (
      process.platform === 'win32' &&
      logSource === 'stderr' &&
      (logText.includes('The service is no longer running') || logText.includes('The service was stopped'))
    )
  }

  // [vite-plugin-ssr@0.4.51][Warning] pageContext._getPageAssets() deprecated, see https://vite-plugin-ssr.com/preload
  function isGetPageAssetsDeprecationWarning() {
    return (
      logSource === 'stderr' &&
      logText.includes('[vite-plugin-ssr@') &&
      logText.includes('[Warning]') &&
      logText.includes('pageContext._getPageAssets() deprecated')
    )
  }

  // /assets/Inter-Var-IOAEQULN.ttf referenced in /home/runner/work/vite-plugin-ssr/vite-plugin-ssr/node_modules/.pnpm/@brillout+docpress@0.1.12_6bdbsu2yzpeczxw5qylih75b3i/node_modules/@brillout/docpress/dist/renderer/_default.page.client.css?used didn't resolve at build time, it will remain unchanged to be resolved at runtime
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
}
