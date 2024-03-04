export { onCreateImage }
import sharp from 'sharp'

async function onCreateImage() {
  const imageData = await sharp({
    create: {
      width: 300,
      height: 200,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .raw()
    .toBuffer()

  console.log(imageData.byteLength)

  return true
}
