import { expect, describe, it, assert } from 'vitest'
import { stripAnsi } from '../../utils.js'
import { assertNoInfiniteHttpRedirect } from './assertNoInfiniteHttpRedirect.js'

describe('assertNoInfiniteHttpRedirect()', () => {
  it('works', () => {
    expectErr(
      () => {
        assertNoInfiniteHttpRedirect('/a', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vite-plugin-ssr][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /a"'
        )
      }
    )
    assertNoInfiniteHttpRedirect('/a', '/b')
    expectErr(
      () => {
        assertNoInfiniteHttpRedirect('/a', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vite-plugin-ssr][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /a"'
        )
      }
    )
    expectErr(
      () => {
        assertNoInfiniteHttpRedirect('/b', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vite-plugin-ssr][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /b -> /a"'
        )
      }
    )
    assertNoInfiniteHttpRedirect('/a', '/c')
    assertNoInfiniteHttpRedirect('/b', '/c')
    assertNoInfiniteHttpRedirect('/c', '/d')
    expectErr(
      () => {
        assertNoInfiniteHttpRedirect('/d', '/b')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vite-plugin-ssr][Wrong Usage] Infinite loop of HTTP URL redirects: /b -> /c -> /d -> /b"'
        )
      }
    )
    assertNoInfiniteHttpRedirect('/a', '/e')
    assertNoInfiniteHttpRedirect('/e', '/c')
    expectErr(
      () => {
        assertNoInfiniteHttpRedirect('/d', '/a')
      },
      (msg) => {
        expect(msg).toMatchInlineSnapshot(
          '"[vite-plugin-ssr][Wrong Usage] Infinite loop of HTTP URL redirects: /a -> /b -> /c -> /d -> /a"'
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
