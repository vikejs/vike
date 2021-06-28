//*
export type Heading = {
  title: string
  level: number
  titleLong?: string
  id: string
} | {
  title: string
  level: number
  titleLong?: string
  isDocumentBegin: true
}
/*/
export type Heading = {
  title: string
  level: number
  titleLong?: string
} & ({ id: string } | { isDocumentBeing: true })
//*/
/*
export type Heading = {
  title: string
  level: number
  titleLong?: string
  id?: string,
  isDocumentBegin?: true,
}
type HeadingBase = {
  title: string
  level: number
  titleLong?: string
}
export type Heading = ((HeadingBase & { id: string }) | (HeadingBase & { isDocumentBeing: true }))
*/
