import extension from '../extension/config.js' with { type: 'vike:pointer' }

export default {
  extends: [extension],
  clientRouting: true,
  meta: {
    needsServer: { env: { config: true } },
  },
}
