import react from '@vitejs/plugin-react'
import assert from 'node:assert'
import { getVikeConfig } from 'vike/plugin'
import type { PluginOption } from 'vite'

export default {
  // TEST: funky build output directory
  build: {
    outDir: `${__dirname}/../../test/playground/dist/nested`,
    assetsDir: '/nested-dir/assets',
    // TEST: https://github.com/vikejs/vike/issues/2315
    //minify: 'terser'
    //* Inspect dist/client/
    minify: false
    //*/
  },
  plugins: [react(), testPlugin()]
}

function testPlugin(): PluginOption {
  let vike: Vike
  return {
    name: 'testPlugin',
    configResolved(config) {
      vike = getVikeConfig(config as any)
      testVikeConfig(vike)
    },
    closeBundle() {
      testPrerenderSettings(vike)
    }
  }
}
type Vike = ReturnType<typeof getVikeConfig>

// TEST: getVikeConfig()
function testVikeConfig(vike: Vike) {
  assert(typeof vike.config.prerender![0] === 'object')
  assert(vike.config.prerender![0].parallel === 4)
  assert(vike.pages)
  assert(vike.pages['/pages/index']!.config.prerender![0] === false)
  assert(vike.pages['/pages/markdown']!.config.prerender![0])
}

// TEST: prerenderSetOverEffect
function testPrerenderSettings(vike: Vike) {
  const { prerenderContext } = vike
  assert(prerenderContext.isPrerenderingEnabled)
  if (!prerenderContext.output) return
  ;(globalThis as any).prerenderContextWasTested = true
  const pageIds = Object.keys(vike.pages)
  const pageIdsPrerendered = unique(
    prerenderContext.output.map((file) => file.pageContext.pageId).filter((pageId) => pageId !== null)
  )
  ;[
    {
      pageId: '/pages/markdown',
      prerendered: true
    },
    {
      pageId: '/pages/navigate-early',
      prerendered: true
    },
    {
      pageId: '/pages/index',
      prerendered: false
    },
    {
      pageId: '/pages/about-page',
      prerendered: false
    }
  ].forEach(({ pageId, prerendered }) => {
    const debug = JSON.stringify({ pageIds, pageIdsPrerendered, pageId }, null, 2)
    assert(pageIds.includes(pageId), debug)
    const wasPrerendered = pageIdsPrerendered.includes(pageId)
    assert(wasPrerendered === prerendered, debug)
  })

  // TEST: prerender.noExtraDir
  prerenderContext.output.forEach(({ filePath }) => assert(!filePath.endsWith('index.html'), filePath))
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
