import { expect, describe, it, afterEach } from 'vitest'
import { getViteCliCommand, getViteCliArgs, getViteBuildCliArgs } from './isViteCli.js'

// Mutate `process.argv` in-place: cac holds a reference to it.
const argvOriginal = [...process.argv]
afterEach(() => {
  process.argv.splice(0, Infinity, ...argvOriginal)
})
function runViteCli(args: string) {
  process.argv.splice(0, Infinity, '/usr/bin/node', '/app/node_modules/vite/bin/vite.js', ...args.split(' '))
}

describe('Vite CLI options', () => {
  it('dev', () => {
    runViteCli('-c vite.config.dev.ts --port 3001 --strictPort --host --mode staging')
    expect(getViteCliCommand()).toBe('dev')
    expect(getViteCliArgs()).toEqual({ root: undefined, configFile: 'vite.config.dev.ts' })
  })
  it('build', () => {
    runViteCli('build some-root --outDir dist2 --someFutureViteOption --config vite.config.prod.ts')
    expect(getViteCliCommand()).toBe('build')
    expect(getViteCliArgs()).toEqual({ root: 'some-root', configFile: 'vite.config.prod.ts' })
    expect(getViteBuildCliArgs()).toMatchObject({ root: 'some-root', build: { outDir: 'dist2' } })
  })
  it('boolean option before [root]', () => {
    runViteCli('build --emptyOutDir some-root')
    expect(getViteCliArgs()).toEqual({ root: 'some-root', configFile: undefined })
    runViteCli('--experimentalBundle some-root')
    expect(getViteCliArgs()).toEqual({ root: 'some-root', configFile: undefined })
  })
  it('repeated option', () => {
    runViteCli('build -c vite.config.a.ts -c vite.config.b.ts')
    expect(getViteCliArgs()).toEqual({ root: undefined, configFile: 'vite.config.b.ts' })
  })
  it('optimize', () => {
    runViteCli('optimize --force')
    expect(getViteCliCommand()).toBe('optimize')
  })
  it('preview', () => {
    runViteCli('preview --port 3001 --open')
    expect(getViteCliCommand()).toBe('preview')
  })
})
