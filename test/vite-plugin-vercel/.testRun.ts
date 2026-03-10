export { testRun }

import { page, test, expect, getServerUrl, autoRetry, fetchHtml } from '@brillout/test-e2e'
import { testRunClassic } from '../../test/utils'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '.vercel', 'output')

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  const isDev = cmd === 'npm run dev'

  testRunClassic(cmd, {
    skipAboutPage: true,
  })

  test('Index page', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain('Counter')
    expect(html).toContain('0')
    await page.goto(`${getServerUrl()}/`)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  test('Edge page', async () => {
    const html = await fetchHtml('/edge')
    expect(html).toContain('<h1>Edge</h1>')
    expect(html).toContain('typeof EdgeRuntime:')
    await page.goto(`${getServerUrl()}/edge`)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Edge')
    })
  })

  test('ISR page', async () => {
    const html = await fetchHtml('/isr')
    expect(html).toContain('<h1>ISR</h1>')
    await page.goto(`${getServerUrl()}/isr`)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('ISR')
    })
    const body1 = await page.textContent('body')
    expect(body1).toContain('Last access date:')
  })

  if (!isDev) {
    test('Build artifacts: config.json', async () => {
      const config = getConfig()
      expect(config.version).toBe(3)
      expect(Array.isArray(config.routes)).toBe(true)
    })

    test('Build artifacts: Edge function', async () => {
      const route = getRoute((r) => r.src && r.src.includes('/edge'))
      const funcDir = getFuncDir(route.dest)
      expect(fs.existsSync(funcDir)).toBe(true)
      expect(fs.existsSync(path.join(funcDir, 'index.js'))).toBe(true)
      verifyVcConfig(funcDir, {
        runtime: 'edge',
        entrypoint: 'index.js',
      })
    })

    test('Build artifacts: ISR function', async () => {
      const route = getRoute((r) => r.src === '^/isr$')
      const funcDir = getFuncDir(route.dest)
      expect(fs.existsSync(funcDir)).toBe(true)
      expect(fs.existsSync(path.join(funcDir, 'index.mjs'))).toBe(true)
      verifyVcConfig(funcDir, {
        runtime: /^nodejs/,
        handler: 'index.mjs',
        launcherType: 'Nodejs',
      })

      // Check ISR prerender config
      const funcMatch = route.dest.slice(1)
      const prerenderConfigPath = path.join(outputDir, 'functions', `${funcMatch}.prerender-config.json`)
      expect(fs.existsSync(prerenderConfigPath)).toBe(true)
      const prerenderConfig = JSON.parse(fs.readFileSync(prerenderConfigPath, 'utf-8'))
      expect(prerenderConfig.expiration).toBe(15)
    })

    test('Build artifacts: Default function', async () => {
      const route = getRoute((r) => r.src === '^(.*)$')
      const funcDir = getFuncDir(route.dest)
      expect(fs.existsSync(funcDir)).toBe(true)
      expect(fs.existsSync(path.join(funcDir, 'index.mjs'))).toBe(true)
      verifyVcConfig(funcDir, {
        runtime: /^nodejs/,
        handler: 'index.mjs',
        launcherType: 'Nodejs',
      })
    })
  }
}

function getConfig() {
  const configJsonPath = path.join(outputDir, 'config.json')
  expect(fs.existsSync(configJsonPath)).toBe(true)
  return JSON.parse(fs.readFileSync(configJsonPath, 'utf-8'))
}

function getRoute(predicate: (r: any) => boolean) {
  const config = getConfig()
  const route = config.routes.find(predicate)
  expect(route).not.toBe(undefined)
  return route
}

function getFuncDir(dest: string) {
  const funcMatch = dest.split('?')[0].slice(1) // remove leading / and query params
  return path.join(outputDir, 'functions', `${funcMatch}.func`)
}

function verifyVcConfig(funcDir: string, expected: any) {
  const vcConfigPath = path.join(funcDir, '.vc-config.json')
  expect(fs.existsSync(vcConfigPath)).toBe(true)
  const vcConfig = JSON.parse(fs.readFileSync(vcConfigPath, 'utf-8'))
  for (const key in expected) {
    if (expected[key] instanceof RegExp) {
      expect(vcConfig[key]).toMatch(expected[key])
    } else {
      expect(vcConfig[key]).toBe(expected[key])
    }
  }
}
