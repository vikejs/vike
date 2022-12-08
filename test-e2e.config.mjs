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
      setups: [mac17]
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
      name: 'Base URL',
      setups: [win18]
    },
    {
      name: 'Cloudflare',
      setups: [ubuntu16]
    },
    {
      name: 'Custom Preload',
      setups: [ubuntu18, win18]
    },
    {
      name: 'Unit Tests E2E',
      setups: [win18]
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

function tolerateError(log) {
  return (
    isSlowHookWarning() ||
    isNoErrorPageWarning() ||
    isFetchExperimentalWarning() ||
    isViteEsbuildBug() ||
    isGetPageAssetsDeprecationWarning() ||
    isDocpressAssetWarning() ||
    isSourceMapWarning()
  )

  // [vite-plugin-ssr@0.4.42][Warning] The onBeforeRender() hook of /pages/star-wars/index/index.page.server.ts is taking more than 4 seconds
  function isSlowHookWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes('[Warning]') &&
      log.logText.includes('hook of') &&
      log.logText.includes('is taking more than 4 seconds')
    )
  }

  // [vite-plugin-ssr@0.4.42][Warning] No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)
  function isNoErrorPageWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes(
        'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)'
      )
    )
  }

  function isFetchExperimentalWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes(
        'ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time'
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
      log.logSource === 'stderr' &&
      (log.logText.includes('The service is no longer running') || log.logText.includes('The service was stopped'))
    )
  }

  // [vite-plugin-ssr@0.4.51][Warning] pageContext._getPageAssets() deprecated, see https://vite-plugin-ssr.com/preload
  function isGetPageAssetsDeprecationWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes('[vite-plugin-ssr@') &&
      log.logText.includes('[Warning]') &&
      log.logText.includes('pageContext._getPageAssets() deprecated')
    )
  }

  // /assets/Inter-Var-IOAEQULN.ttf referenced in /home/runner/work/vite-plugin-ssr/vite-plugin-ssr/node_modules/.pnpm/@brillout+docpress@0.1.12_6bdbsu2yzpeczxw5qylih75b3i/node_modules/@brillout/docpress/dist/renderer/_default.page.client.css?used didn't resolve at build time, it will remain unchanged to be resolved at runtime
  function isDocpressAssetWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes("didn't resolve at build time, it will remain unchanged to be resolved at runtime") &&
      log.logText.includes('node_modules/@brillout/docpress')
    )
  }

  function isSourceMapWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes('Sourcemap for') &&
      log.logText.includes('points to missing source files')
    )
  }
}
