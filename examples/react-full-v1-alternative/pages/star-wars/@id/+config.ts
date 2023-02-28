export default {
  onBeforeRender: () => import('./+onBeforeRender').then((m) => m.default),
  onBeforeRenderIsomorphic: true
}
