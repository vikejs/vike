import { resolveRouteStringRedirect } from './resolveRedirects.js'
import { expect, describe, it } from 'vitest'

// E2E tests at /test/playground/pages/redirects.e2e-tests.ts
// https://github.com/vikejs/vike/blob/0e260ad6e64e98952138a90950e10e2d59d94a36/test/playground/pages/redirects.e2e-tests.ts

describe('resolveRouteStringRedirect', () => {
  it('basics', () => {
    expect(resolveRouteStringRedirect('/a', '/b', '/a')).toEqual('/b')
    expect(resolveRouteStringRedirect('/a', '/b', '/c')).toEqual(null)
    expect(resolveRouteStringRedirect('/@id', '/b/@id', '/1')).toEqual('/b/1')
    expect(resolveRouteStringRedirect('/@id', '/b', '/1')).toEqual('/b')
    expect(resolveRouteStringRedirect('/@id', '/b', '/b')).toEqual(null)
    expect(resolveRouteStringRedirect('/@a/@b', '/@b/@a', '/1/2')).toEqual('/2/1')
  })
  it('edge cases', () => {
    expect(resolveRouteStringRedirect('/', '/', '/')).toEqual(null)
    expect(resolveRouteStringRedirect('//', '/', '//')).toEqual('/')
    expect(resolveRouteStringRedirect('//', '/', '/')).toEqual(null)
    expect(resolveRouteStringRedirect('/@id', '/b/@id/@id', '/1')).toEqual('/b/1/1')
    expect(resolveRouteStringRedirect('/@a/@b', '/c', '/b')).toEqual(null)
    // https://github.com/vikejs/vike/issues/1347
    expect(resolveRouteStringRedirect('/npm/*', 'https://cdn.jsdelivr.net/npm/*', '/npm/@my-team/my-package')).toEqual(
      'https://cdn.jsdelivr.net/npm/@my-team/my-package',
    )
    expect(resolveRouteStringRedirect('/@a', '/a/@a', '/@a')).toEqual('/a/@a')
    expect(resolveRouteStringRedirect('/@a/@b', '/a/@a/@b', '/@b/1')).toEqual('/a/@b/1')
  })
  it('handles invalid redirects', () => {
    expect(() => resolveRouteStringRedirect('a', 'b', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] Invalid Route String a: it should start with / or *]`,
    )
    expect(() => resolveRouteStringRedirect('/a', 'b', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] The URL redirection target is 'b' but it should start with '/' or a protocol ('http://', 'mailto:', ...), or be '*']`,
    )
    expect(() => resolveRouteStringRedirect('/a', '/@i', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] The redirection source URL '/a' is missing the URL parameter '@i' used by the redirection target URL '/@i']`,
    )
    expect(() => resolveRouteStringRedirect('/a', '/b/*', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] The redirection source URL '/a' is missing the URL parameter '*' used by the redirection target URL '/b/*']`,
    )
    expect(() => resolveRouteStringRedirect('/', '/*', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] The redirection source URL '/' is missing the URL parameter '*' used by the redirection target URL '/*']`,
    )
    expect(() => resolveRouteStringRedirect('/', '*', '/')).toThrowErrorMatchingInlineSnapshot(
      `[Error: [vike][Wrong Usage][+redirects] The redirection source URL '/' is missing the URL parameter '*' used by the redirection target URL '*']`,
    )
  })
  it('globs', () => {
    expect(resolveRouteStringRedirect('/a/*', '/b/*', '/a/1')).toEqual('/b/1')
    expect(resolveRouteStringRedirect('/a/*', '/b/c/*', '/a/1/2/3')).toEqual('/b/c/1/2/3')
    expect(resolveRouteStringRedirect('/a/*', '/*', '/a/b')).toEqual('/b')
  })
  it('external redirects', () => {
    expect(resolveRouteStringRedirect('/a/*', 'https://a.org/*', '/a/1')).toEqual('https://a.org/1')
    expect(resolveRouteStringRedirect('/a/*', 'http://a.org/b/c/d/*', '/a/1/2/3')).toEqual('http://a.org/b/c/d/1/2/3')
    expect(resolveRouteStringRedirect('/a/b/c', 'http://a.com', '/a/b/c')).toEqual('http://a.com')
  })
  it('mailto:', () => {
    // mailto:
    expect(resolveRouteStringRedirect('/contact', 'mailto:foo@bar.test', '/contact')).toEqual('mailto:foo@bar.test')
    expect(resolveRouteStringRedirect('/contact', 'mailto:foo@bar.test?subject=Hello', '/contact')).toEqual(
      'mailto:foo@bar.test?subject=Hello',
    )
  })
  it('ipfs:', () => {
    expect(resolveRouteStringRedirect('/ipfs', 'ipfs://example.com', '/ipfs')).toEqual('ipfs://example.com')
  })
  it('magnet:', () => {
    expect(resolveRouteStringRedirect('/magnet', 'magnet:?xt=urn:btih:example', '/magnet')).toEqual(
      'magnet:?xt=urn:btih:example',
    )
    // Real world example
    expect(
      resolveRouteStringRedirect(
        '/magnet',
        'magnet:?xt=urn:btih:3a15e1ac49683d91b20c2ffc252ea612a6c01bd7&dn=The.Empire.Strikes.Back.1980.Remastered.1080p.BluRay.DDP.7.1.x265-EDGE2020.mkv&xl=3225443573&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.torrent.eu.org:451&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.openbittorrent.com:6969&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://open.demonii.com:1337',
        '/magnet',
      ),
    ).toEqual(
      'magnet:?xt=urn:btih:3a15e1ac49683d91b20c2ffc252ea612a6c01bd7&dn=The.Empire.Strikes.Back.1980.Remastered.1080p.BluRay.DDP.7.1.x265-EDGE2020.mkv&xl=3225443573&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.torrent.eu.org:451&tr=udp://open.stealth.si:80/announce&tr=udp://tracker.openbittorrent.com:6969&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://open.demonii.com:1337',
    )
  })

  it('real world examples', () => {
    // https://github.com/vikejs/vike/issues/2462
    const source = '/nmrium/demo'
    const target = 'https://app.nmrium.org#?toc=https://cheminfo.github.io/nmr-dataset-demo/samples.json'
    expect(resolveRouteStringRedirect(source, target, source)).toEqual(target)
  })
})
