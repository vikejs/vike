export default {
  onBeforeRender: {
    env: { server: true, client: true }
  },
  data: {
    env: { server: false, client: true }
  }
}
