import * as execa from 'execa'

export { runCommand }

async function runCommand(cmd: string, args: string[], { cwd, silent }: { cwd?: string; silent?: true } = {}) {
  const stdio = silent ? 'ignore' : 'inherit'
  await execa(cmd, args, { cwd, stdio })
}
