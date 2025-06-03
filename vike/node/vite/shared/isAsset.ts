export { isAsset }

function isAsset(filename: string) {
  return assetFileExtensions.some((ext) => filename.endsWith('.' + ext))
}

// Copied from Vite: https://github.com/vitejs/vite/blob/9d28ffd3410a3ea2b739cce31e845f59cebd3cc6/packages/vite/src/node/constants.ts#L83-L121
// Alternatively: check sirv's source code (it needs to send the right Content-Type header)
const assetFileExtensions = [
  // images
  'png',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',

  // media
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',

  // fonts
  'woff2',
  'woff',
  'eot',
  'ttf',
  'otf',

  // other
  'webmanifest',
  'pdf',
  'txt'
]
