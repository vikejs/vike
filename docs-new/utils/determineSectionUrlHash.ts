export { determineSectionUrlHash }

function determineSectionUrlHash(title: string): string {
  return title
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
    .join('-')
}
