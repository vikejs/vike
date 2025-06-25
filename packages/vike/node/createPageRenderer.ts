// TO-DO/next-major-release: remove this file

//import { SsrEnv, setSsrEnv } from './ssrEnv.js'
import { renderPage } from './runtime/renderPage.js'
import { assertWarning } from './runtime/utils.js'
//import { importBuildWasLoaded } from './importBuild.js'

export { createPageRenderer }

type RenderPage = typeof renderPage

type Options = {
  viteDevServer?: unknown
  root?: string
  outDir?: string
  isProduction?: boolean
  base?: string
  baseAssets?: string | null
}
/** @deprecated */
function createPageRenderer(options: Options): RenderPage {
  showWarnings(options)
  return renderPage
}

function showWarnings(options: Options) {
  assertWarning(
    false,
    '`createPageRenderer()` is outdated, use `renderPage()` instead. See https://vike.dev/renderPage',
    { onlyOnce: true, showStackTrace: true },
  )

  const { viteDevServer, root, outDir, isProduction, base, baseAssets } = options

  {
    const opts = [
      viteDevServer !== undefined && 'viteDevServer',
      root !== undefined && 'root',
      outDir !== undefined && 'outDir',
      isProduction !== undefined && 'isProduction',
    ].filter(notFalse)
    assertWarning(
      opts.length === 0,
      `The options ${str(
        opts,
      )} you passed to \`createPageRenderer()\` have no effect anymore: they are now automatically determined.`,
      { onlyOnce: true },
    )
  }
  {
    const opts = [base !== undefined && 'base', baseAssets !== undefined && 'baseAssets'].filter(notFalse)
    assertWarning(
      opts.length === 0,
      `The options ${str(
        opts,
      )} you passed to \`createPageRenderer()\` have no effect. See https://vike.dev/migration-0.4`,
      { onlyOnce: true },
    )
  }
}

function str(opts: string[]): string {
  return opts
    .map((opt) => '`' + opt + '`')
    .join(', ')
    .replace(/,(?=[^,]*$)/, ' and')
}

function notFalse(val: false | string): val is string {
  return val !== false
}

/*
function assertArguments(
  ssrEnv: {
    viteDevServer?: unknown
    root?: unknown
    outDir?: unknown
    isProduction?: unknown
    baseServer?: unknown
    baseAssets?: unknown
  },
  args: unknown[],
): asserts ssrEnv is SsrEnv {
  const { viteDevServer, root, outDir, isProduction, baseServer, baseAssets } = ssrEnv
  assertUsage(
    root === undefined || typeof root === 'string',
    '`createPageRenderer({ root })`: argument `root` should be a string.',
  )
  assertUsage(typeof outDir === 'string', '`createPageRenderer({ outDir })`: argument `outDir` should be a string.')
  assertUsage(typeof baseServer === 'string', '`createPageRenderer({ base })`: argument `base` should be a string.')
  assertUsage(
    baseAssets === null || typeof baseAssets === 'string',
    '`createPageRenderer({ baseAssets })`: argument `baseAssets` should be a string.',
  )
  assertUsageBaseServer(baseServer, '`createPageRenderer({ base })`: ')
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
        plugin.name.startsWith('vike'),
      ),
      "Vike's Vite plugin is not installed. Make sure to add it to your `vite.config.js`.",
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
