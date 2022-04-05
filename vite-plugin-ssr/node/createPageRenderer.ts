//import { SsrEnv, setSsrEnv } from './ssrEnv'
import { renderPage } from './renderPage'
import { assertUsage, assertWarning } from './utils'
//import { importBuildWasLoaded } from './importBuild'

export { createPageRenderer }

let wasCalled = false

type RenderPage = typeof renderPage

function createPageRenderer(_deprecated: {
  viteDevServer?: unknown
  /* Conflicting `ViteDevServer` type definitions upon different Vite versions installed
  viteDevServer?: ViteDevServer
  */
  root?: string
  outDir?: string
  isProduction?: boolean
  base?: string
  baseAssets?: string | null
}): RenderPage {
  assertUsage(
    !wasCalled,
    'You are trying to call `createPageRenderer()` a second time, but it should be called only once.',
  )
  wasCalled = true

  assertWarning(
    false,
    '`createPageRenderer()` is not needed anymore. Remove `createPageRenderer()` to avoid this warning. More infos at https://vite-plugin-ssr.com/createPageRenderer',
    { onlyOnce: true },
  )

  return renderPage
}

/*
function assertArguments(
  ssrEnv: {
    viteDevServer?: unknown
    root?: unknown
    outDir?: unknown
    isProduction?: unknown
    baseUrl?: unknown
    baseAssets?: unknown
  },
  args: unknown[],
): asserts ssrEnv is SsrEnv {
  const { viteDevServer, root, outDir, isProduction, baseUrl, baseAssets } = ssrEnv
  assertUsage(
    root === undefined || typeof root === 'string',
    '`createPageRenderer({ root })`: argument `root` should be a string.',
  )
  assertUsage(typeof outDir === 'string', '`createPageRenderer({ outDir })`: argument `outDir` should be a string.')
  assertUsage(typeof baseUrl === 'string', '`createPageRenderer({ base })`: argument `base` should be a string.')
  assertUsage(
    baseAssets === null || typeof baseAssets === 'string',
    '`createPageRenderer({ baseAssets })`: argument `baseAssets` should be a string.',
  )
  assertUsageBaseUrl(baseUrl, '`createPageRenderer({ base })`: ')
  assertUsage(
    isProduction === true || isProduction === false || isProduction === undefined,
    '`createPageRenderer({ isProduction })`: argument `isProduction` should be `true`, `false`, or `undefined`.',
  )
  if (importBuildWasLoaded()) {
    assertUsage(
      isProduction,
      '`createPageRenderer({ isProduction })`: argument `isProduction` should be `true` if `dist/server/importBuild.js` is loaded. (You should load `dist/server/importBuild.js` only in production.)',
    )
    assertUsage(
      root === undefined,
      '`createPageRenderer({ root })`: argument `root` has no effect if `dist/server/importBuild.js` is loaded. Remove the `root` argument.',
    )
  }
  if (isProduction === true) {
    assertUsage(
      viteDevServer === undefined,
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is `true`, then `viteDevServer` should be `undefined`.',
    )
    assertUsage(
      root || importBuildWasLoaded(),
      "`createPageRenderer({ root })`: argument `root` is missing. (Alternatively, if `root` doesn't exist because you are bundling your server code into a single file, then load `dist/server/importBuild.js`.)",
    )
  } else {
    assertUsage(root, '`createPageRenderer({ root })`: argument `root` is missing.')

    assertUsage(
      !!viteDevServer,
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` cannot be `undefined`.',
    )

    const wrongViteDevServerValueError =
      '`createPageRenderer({ viteDevServer, isProduction })`: if `isProduction` is not `true`, then `viteDevServer` should be `viteDevServer = await vite.createServer()`.'
    assertUsage(
      hasProp(viteDevServer, 'config') &&
        hasProp(viteDevServer.config, 'root') &&
        typeof viteDevServer.config.root === 'string',
      wrongViteDevServerValueError,
    )
    {
      const rootVite = resolve(viteDevServer.config.root)
      const rootResolved = resolve(root)
      assertUsage(
        rootVite === rootResolved,
        '`createPageRenderer({ viteDevServer, root })`: wrong `root` value, make sure it matches `viteDevServer.config.root`. ' +
          `The \`root\` you provided resolves to \`'${rootResolved}'\` while \`viteDevServer.config.root\` resolves to \`${rootVite}\`.`,
      )
    }

    assertUsage(
      hasProp(viteDevServer, 'config', 'object') && hasProp(viteDevServer.config, 'plugins', 'array'),
      wrongViteDevServerValueError,
    )
    assertUsage(
      (viteDevServer as any as ViteDevServer).config.plugins.find((plugin) =>
        plugin.name.startsWith('vite-plugin-ssr'),
      ),
      "`vite-plugin-ssr`'s Vite plugin is not installed. Make sure to add it to your `vite.config.js`.",
    )
  }
  assertUsage(args.length === 1, '`createPageRenderer()`: all arguments should be passed as a single argument object.')
  assert(typeof args[0] === 'object' && args[0] !== null)
  Object.keys(args[0]).forEach((argName) => {
    assertUsage(
      ['viteDevServer', 'root', 'outDir', 'isProduction', 'base', 'baseAssets'].includes(argName),
      '`createPageRenderer()`: Unknown argument `' + argName + '`.',
    )
  })
}
    */
