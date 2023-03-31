export type { InjectFilterEntry }

type InjectFilterEntry = {
  src: string
  assetType: null | PageAsset['assetType']
  mediaType: null | PageAsset['mediaType']
  isEntry: boolean
  inject: PreloadFilterInject
}
