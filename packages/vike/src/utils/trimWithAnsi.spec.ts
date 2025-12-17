import { trimWithAnsi, trimWithAnsiTrailOnly } from './trimWithAnsi.js'
import { expect, describe, it } from 'vitest'
import pc from '@brillout/picocolors'

// To inspect ANSI codes:
// ```diff
// - expect(trimWithAnsi(pc.red('a '))).toEqual(pc.red('a'))
// + expect(JSON.stringify(trimWithAnsi(pc.red('a ')))).toEqual(JSON.stringify(pc.red('a')))
// ```

describe('trimWithAnsi()', () => {
  it('same as trim() without ANSI codes', () => {
    expect(trimWithAnsi('a')).toEqual('a')
    expect(trimWithAnsi(' a')).toEqual('a')
    expect(trimWithAnsi('a ')).toEqual('a')
    expect(trimWithAnsi('\na')).toEqual('a')
    expect(trimWithAnsi('a\n')).toEqual('a')
    expect(trimWithAnsi('  \n a \n   b \n c  \n\n')).toEqual('a \n   b \n c')
  })
  it('but also works with ANSI codes', () => {
    expect(trimWithAnsi(pc.red('a'))).toEqual(pc.red('a'))
    expect(trimWithAnsi(pc.red(' a'))).toEqual(pc.red('a'))
    expect(trimWithAnsi(pc.red('a '))).toEqual(pc.red('a'))
    expect(trimWithAnsi(pc.red('\na'))).toEqual(pc.red('a'))
    expect(trimWithAnsi(pc.red('a\n'))).toEqual(pc.red('a'))
    expect(trimWithAnsi(pc.red('  \n a \n   b \n c  \n\n'))).toEqual(pc.red('a \n   b \n c'))
  })
  it('trimWithAnsiTrailOnly()', () => {
    expect(trimWithAnsiTrailOnly(pc.red('\na'))).toEqual(pc.red('\na'))
    expect(trimWithAnsiTrailOnly(pc.red('a\n'))).toEqual(pc.red('a'))
    expect(trimWithAnsiTrailOnly(pc.red(' \n a \n b \n '))).toEqual(pc.red(' \n a \n b'))
  })
})
