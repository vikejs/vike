const { exec } = require('child_process')

exec('git submodule status libframe', { cwd: `${__dirname}/..` }, (err, stdout, stderr) => {
  if (err) throw err
  if (stderr) console.error(stderr)
  if (stdout.startsWith('-')) {
    const errMsg = [
      '',
      '❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗',
      '❗❗❗ SETUP MISSING: run `pnpm run setup` before running `pnpm install`. ❗❗❗',
      '❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗'
    ].join('\n')
    console.log(errMsg)
    process.exit(1)
  }
})
