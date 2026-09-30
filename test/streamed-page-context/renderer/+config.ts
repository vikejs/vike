import type { Config } from 'vike/types'

export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // The streamed values are sent in `<script>` tags: they need the nonce
  csp: { nonce: true },
} satisfies Config
