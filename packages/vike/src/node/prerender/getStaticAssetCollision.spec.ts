import { getStaticAssetCollision } from './getStaticAssetCollision.js'
import { expect, describe, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/public')
const assetsManifest = {
  'virtual:vike:entry:client': {
    file: 'assets/entries/entry-client.abc.js',
    css: ['assets/static/style.abc.css'],
    assets: ['assets/static/font.abc.woff2'],
  },
}

describe('getStaticAssetCollision', () => {
  it('public/ file', () => {
    expect(getStaticAssetCollision('favicon.ico', publicDir, {})).toBe(path.join(publicDir, 'favicon.ico'))
    expect(getStaticAssetCollision('icons/logo.png', publicDir, {})).toBe(path.join(publicDir, 'icons/logo.png'))
  })
  it('file emitted by the client build', () => {
    const msg = "the client build's assets/entries/entry-client.abc.js"
    expect(getStaticAssetCollision('assets/entries/entry-client.abc.js', null, assetsManifest)).toBe(msg)
    expect(getStaticAssetCollision('assets/static/style.abc.css', null, assetsManifest)).toBe(msg)
    expect(getStaticAssetCollision('assets/static/font.abc.woff2', null, assetsManifest)).toBe(msg)
  })
  it('no collision', () => {
    expect(getStaticAssetCollision('feed.atom', publicDir, assetsManifest)).toBe(null)
    // Directory, not a file
    expect(getStaticAssetCollision('icons', publicDir, assetsManifest)).toBe(null)
    // publicDir disabled
    expect(getStaticAssetCollision('favicon.ico', null, assetsManifest)).toBe(null)
  })
})
