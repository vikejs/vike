export type Release = {
  id: number
  tag_name: string
  body: string | null
}
export type ChangelogSections = Record<string, string>
export type ReleasesToCreate = {
  tag_name: string
  target_commitish: string
  name: string
  body: string
}
export type ReleasesToUpdate = {
  release_id: number
  tag_name: string
  body: string
}
