export { getSectionId }

type Header = {
  title: string
  id?: string
}

function getSectionId(header: Header) {
  return 'id' in header ? header.id : computeHeaderId(header.title)
}

function computeHeaderId(title: string): string {
  return title
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .join('-')
}
