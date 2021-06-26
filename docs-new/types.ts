export type Heading = {
  title: string
  level: number
  titleLong?: string
} & ({ id: string } | { isDocumentBeing: true })
