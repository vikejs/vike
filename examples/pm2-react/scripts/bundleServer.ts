import path from 'node:path'
import fs from 'fs-extra'
import { build } from 'esbuild'

const serverDir = path.resolve(__dirname, '../server/')

async function bundleServer() {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [path.join(serverDir, 'index.ts')],
    outfile: 'index.js',
    write: false,
    platform: 'node',
    bundle: true,
    format: 'cjs',
    sourcemap: false,
    treeShaking: true,
    banner: {
      js: `/* eslint-disable prettier/prettier */`,
    },
    tsconfig: path.resolve(__dirname, './tsconfig.bundleServer.json'),
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return {
                external: true,
              }
            }
          })
        },
      },
    ],
  })
  const { text } = result.outputFiles[0]
  const filePath = path.join(serverDir, 'index.js')
  if (fs.existsSync(filePath)) {
    await fs.remove(filePath)
  }
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, text)
}

bundleServer()
