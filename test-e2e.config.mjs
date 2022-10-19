export default {
  ci: {
    jobs: getCiJobs()
  },
  tolerateError
}

function tolerateError(log) {
  return isSlowHookWarning() || isFetchExperimentalWarning() || isViteBug()

  // [vite-plugin-ssr@0.4.42][Warning] The onBeforeRender() hook of /pages/star-wars/index/index.page.server.ts is taking more than 4 seconds
  function isSlowHookWarning() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes('[Warning]') &&
      log.logText.includes('hook of') &&
      log.logText.includes('is taking more than 4 seconds')
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

  // [16:10:29.456][\examples\preact-client-routing][npm run preview][stderr] 4:10:29 PM [vite] Internal server error: The service is no longer running
  function isViteBug() {
    return (
      log.logSource === 'stderr' &&
      log.logText.includes('vite') &&
      log.logText.includes('Internal server error: The service is no longer running')
    )
  }
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
      name: 'Examples React',
      setups: setupsExamples
    },
    {
      name: 'Examples Vue/Others',
      setups: setupsExamples
    },
    {
      name: 'Boilerplates',
      setups: [mac17]
    },
    {
      name: 'Cloudflare',
      setups: [ubuntu16]
    },
    {
      name: 'Unit Tests E2E',
      setups: [win18]
    },
    {
      name: 'https://vite-plugin-ssr.com',
      setups: [ubuntu17]
    }
  ]
}
