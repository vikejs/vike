import { PageContextServer } from 'vike/types'

export async function data(pageContext: PageContextServer) {
  return {
    // @ts-expect-error EdgeRuntime is defined by Vercel Edge
    edgeType: typeof EdgeRuntime as string | undefined,
  }
}

export type Data = Awaited<ReturnType<typeof data>>
