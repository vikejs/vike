export default {
  ci: {
    jobs: getCiJobs()
  },
  tolerateError
}

function tolerateError(log) {
  if (isSlowHookWarning()) {
    return true
  }
  return false

  // Tolerate:
  // ```
  // [vite-plugin-ssr@0.4.42][Warning] The onBeforeRender() hook of /pages/star-wars/index/index.page.server.ts is taking more than 4 seconds
  // ```
  function isSlowHookWarning() {
    if (log.logSource === 'stderr') {
      const t = log.logText
      if (t.includes('[Warning]') && t.includes('hook of') && t.includes('is taking more than 4 seconds')) {
        return true
      }
    }
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
