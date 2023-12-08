// https://vike.dev/data
export type { Data }

import type { MovieDetails } from '../types'
import type { GlobalData } from '../../../renderer/PageContext'

/**
 * Page-specific `data()` hook return type.
 *
 * See https://vike.dev/data
 */
type Data = {
  movie: MovieDetails
} & GlobalData
