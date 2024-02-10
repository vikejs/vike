export { serve }

async function serve() {
  const { createServer: createServerVite } = await import('vite')
  const { resolveConfig, isCliCall } = await import('./utils.js')
  // Adds vike to viteConfig if not present
  const { viteConfig, viteConfigResolved: resolvedConfig } = await resolveConfig({}, 'serve')
  if (!isCliCall) return createServerVite(viteConfig)

  const { default: pc } = await import('@brillout/picocolors')
  const { startTime } = await import('../cli/bin.js')
  const { projectInfo } = await import('../../utils/projectInfo.js')
  const { projectName, projectVersion } = projectInfo
  try {
    const server = await createServerVite(viteConfig)
    await server.listen()
    const info = server.config.logger.info
    const startupDurationString = pc.dim(
      `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`
    )
    const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0
    info(`\n  ${pc.cyan(`${pc.bold(projectName)} v${projectVersion}`)}  ${startupDurationString}\n`, {
      clear: !hasExistingLogs
    })

    server.printUrls()
    server.bindCLIShortcuts({ print: true })
    return server
  } catch (e: any) {
    resolvedConfig.logger.error(pc.red(`error when starting dev server:\n${e.stack}`), {
      error: e
    })
    process.exit(1)
  }
}
