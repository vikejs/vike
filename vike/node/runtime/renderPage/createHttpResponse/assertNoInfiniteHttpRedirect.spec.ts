import { expect, describe, it, assert } from 'vitest'
import { stripAnsi } from '../../utils.js'
import { assertNoInfiniteHttpRedirect } from './assertNoInfiniteHttpRedirect.js'

const call = (urlRedirectTarget: string, urlOriginal: string) =>
  assertNoInfiniteHttpRedirect(urlRedirectTarget, { urlOriginal })

describe('assertNoInfiniteHttpRedirect()', () => {
  it('works', () => {
    expectErr(
      () => {
        call('/a', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot('"[vike][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /a"')
      }
    )
    call('/a', '/b')
    expectErr(
      () => {
        call('/a', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot('"[vike][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /a"')
      }
    )
    expectErr(
      () => {
        call('/b', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot('"[vike][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /b -> /a"')
      }
    )
    call('/a', '/c')
    call('/b', '/c')
    call('/c', '/d')
    expectErr(
      () => {
        call('/d', '/b')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vike][Wrong Usage] Infinite loop of HTTP URL redirects: /b -> /c -> /d -> /b"'
        )
      }
    )
    call('/a', '/e')
    call('/e', '/c')
    expectErr(
      () => {
        call('/d', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vike][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /b -> /c -> /d -> /a"'
        )
      }
    )
  })
})

function expectErr(fn: Function, validate: (msg: string) => void) {
  let err: Error | undefined
  try {
    fn()
  } catch (err_) {
    err = err_ as Error
  }
  expect(err).toBeTruthy()
  assert(err)
  validate(stripAnsi(err.message))
}
