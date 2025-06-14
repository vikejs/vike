// TO-DO/eventually: implement comment `// spellcheck-ignore`
// - https://github.com/crate-ci/typos/issues/1322#issuecomment-2971026339
// - Create temp config at /tmp/_typos.yml
// - Show `stderr` of runTypos('--write-changes')

import { shell } from '@brillout/shell'
import pc from '@brillout/picocolors'
import assert from 'node:assert'

await main()

async function main() {
  const arg = process.argv[2]
  assert(arg === 'fix' || arg === 'check')

  if (arg === 'fix') await fix()
  if (arg === 'check') await check()
}

async function fix() {
  if (await hasRepoChanges()) {
    console.log(pc.red(pc.bold('❌ Commit all changes before running this command.')))
    return
  }

  await runTypos('--write-changes')

  if (await hasRepoChanges()) {
    await shell('git add -A')
    await shell("git commit -m 'fix typos'")
    console.log(pc.green(pc.bold('✅ Typos fixed.')))
  } else {
    console.log(pc.green(pc.bold('✅ No typos found.')))
    console.log(pc.blue(pc.bold(`➡️  No changes.`)))
  }
}

async function check() {
  const res = await runTypos('--diff')
  console.log(res.stdout)
  const noTypos = res.stdout.trim().length === 0
  if (noTypos) {
    console.log(pc.green(pc.bold('✅ No typos found.')))
  } else {
    console.log(pc.red(pc.bold('❌ Typos found (see above)')))
    console.log(pc.blue(`➡️  Fix typos by running ${pc.bold('$ pnpm run docs:spellcheck')}`))
    process.exit(1)
  }
}

async function hasRepoChanges() {
  const res = await shell('git status --porcelain')
  return res.stdout.trim().length > 0
}

/* Options:
```bash
pnpm dlx github:dalisoft/typos-rs-npm#v1.33.1 --help
```
*/
function runTypos(arg: '--diff' | '--write-changes') {
  return shell(`pnpm dlx github:dalisoft/typos-rs-npm#v1.33.1 --color always ${arg}`, { tolerateExitCode: true })
}
