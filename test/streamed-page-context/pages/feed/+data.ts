import { ticks } from '../../renderer/utils'

// Cancelled when the user leaves the page
export function data() {
  return { feed: ticks() }
}
