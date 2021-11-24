module.exports = {
  entry: './worker/index.js',
  target: 'webworker',
  resolve: {
    mainFields: ['main', 'module'],
    alias: {},
  },
  node: { fs: 'empty' },
}
