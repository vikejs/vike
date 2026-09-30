import { getPublicDirCopied, getStaticAssetCollision } from './getStaticAssetCollision.js'
import { expect, describe, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/public')
const clientBuildFiles = new Set(['assets/entries/entry-client.abc.js', 'sitemap.xml', 'nested/emitted.txt'])
const assetsManifest = {
  'virtual:vike:entry:client': {
    file: 'assets/entries/entry-client.abc.js',
    css: ['assets/static/style.abc.css'],
    assets: ['assets/static/font.abc.woff2'],
  },
}

describe('getStaticAssetCollision', () => {
  it('public/ file', () => {
    expect(getStaticAssetCollision('favicon.ico', publicDir, null, {})).toBe(path.join(publicDir, 'favicon.ico'))
    expect(getStaticAssetCollision('icons/logo.png', publicDir, null, {})).toBe(path.join(publicDir, 'icons/logo.png'))
  })
  it('file emitted by the client build', () => {
    const msg = "the client build's assets/entries/entry-client.abc.js"
    expect(getStaticAssetCollision('assets/entries/entry-client.abc.js', null, null, assetsManifest)).toBe(msg)
    expect(getStaticAssetCollision('assets/static/style.abc.css', null, null, assetsManifest)).toBe(msg)
    expect(getStaticAssetCollision('assets/static/font.abc.woff2', null, null, assetsManifest)).toBe(msg)
  })
  it('file emitted by a plugin (not in the manifest)', () => {
    expect(getStaticAssetCollision('sitemap.xml', publicDir, clientBuildFiles, assetsManifest)).toBe(
      "the client build's sitemap.xml",
    )
    expect(getStaticAssetCollision('nested/emitted.txt', null, clientBuildFiles, {})).toBe(
      "the client build's nested/emitted.txt",
    )
  })
  it('no collision', () => {
    expect(getStaticAssetCollision('feed.atom', publicDir, clientBuildFiles, assetsManifest)).toBe(null)
    // Directory, not a file
    expect(getStaticAssetCollision('icons', publicDir, clientBuildFiles, assetsManifest)).toBe(null)
    // publicDir disabled
    expect(getStaticAssetCollision('favicon.ico', null, null, assetsManifest)).toBe(null)
  })
})

describe('getPublicDirCopied', () => {
  const get = (copyPublicDir: boolean, copyPublicDirClient: boolean | undefined, publicDir = '/app/public') =>
    getPublicDirCopied({
      publicDir,
      build: { copyPublicDir } as any,
      environments:
        copyPublicDirClient === undefined ? {} : ({ client: { build: { copyPublicDir: copyPublicDirClient } } } as any),
    })
  it("the client environment's setting takes precedence", () => {
    // Vike sets it to `true` for the client environment
    expect(get(false, true)).toBe('/app/public')
    expect(get(true, false)).toBe(null)
  })
  it('top-level setting', () => {
    expect(get(true, undefined)).toBe('/app/public')
    expect(get(false, undefined)).toBe(null)
  })
  it('publicDir disabled', () => {
    expect(get(true, true, '')).toBe(null)
  })
})
