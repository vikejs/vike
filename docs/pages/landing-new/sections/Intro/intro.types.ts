import type { UiColorVariantKey } from '../../util/ui.constants'

export type IntroBlobColor = UiColorVariantKey

export interface UspHoverTarget {
  color: IntroBlobColor
  x: number
  y: number
}
