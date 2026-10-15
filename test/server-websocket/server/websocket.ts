import { defineHooks } from 'crossws'

export const websocket = defineHooks({
  upgrade(request) {
    // Only accept WebSocket connections to /ws
    if (new URL(request.url).pathname !== '/ws') throw new Response('Not Found', { status: 404 })
  },
  message(peer, message) {
    peer.send(`echo: ${message.text()}`)
  },
})
