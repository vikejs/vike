export default {
  data: {
    env: { server: false, client: true },
  },
  onBeforeRender: {
    env: { server: true, client: true },
  },
}
