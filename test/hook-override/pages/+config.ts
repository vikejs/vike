export default {
  redirects: {
    '/permanent-redirect': '/',
  },
  // prettier-ignore
  // biome-ignore format:
  passToClient: [
    'globalOnBeforeRenderWasCalled',
    'globalOnBeforeRenderWasCalledInEnv',
    'perPageOnBeforeRenderWasCalled',
    'perPageOnBeforeRenderWasCalledInEnv'
  ],
}
