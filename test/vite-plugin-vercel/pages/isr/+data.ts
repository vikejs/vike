import type { PageContextServer } from 'vike/types'

export async function data(pageContext: PageContextServer) {
  return {
    date: new Date().toUTCString(),
  }
}

export type Data = Awaited<ReturnType<typeof data>>
