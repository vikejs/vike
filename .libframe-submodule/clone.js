const { exec } = require('child_process')

exec('git submodule status libframe', { cwd: `${__dirname}/..` }, (err, stdout, stderr) => {
  if (err) throw err
  if (stderr) console.error(stderr)
  if (stdout.startsWith('-')) {
    exec('git submodule update --init libframe/', { cwd: `${__dirname}/..` }, (err, _stdout, stderr) => {
      if (err) throw err
      if (stderr) {
        const msg = stderr.toLowerCase()
        if (msg.includes('submodule') && msg.includes('registered') && msg.includes('cloning')) {
          // Skip message:
          // ```
          // Submodule 'libframe' (https://github.com/brillout/libframe.git) registered for path 'libframe'
          // Cloning into '/home/romuuu/tmp/vite-plugin-ssr/libframe'...
          // ```
        } else {
          console.error(stderr)
        }
      }
    })
  }
})
