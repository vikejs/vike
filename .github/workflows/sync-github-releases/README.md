# Sync GitHub Releases

Keeps each package's [GitHub Releases](https://github.com/vikejs/vike/releases) in sync with its
`CHANGELOG.md`: creates any missing release, rewrites any whose notes have drifted from the changelog,
and deletes any whose version is no longer in the changelog.

The source of truth is `CHANGELOG.md` => GitHub Releases are derived from it.

In CI this runs automatically via [`../sync-github-releases.yml`](../sync-github-releases.yml) — on every
push to `main` that touches a `CHANGELOG.md`, and on manual `workflow_dispatch`. The scripts
below run the same tooling by hand.

## How it works

`index.ts` runs roughly like this:

1. **Pick which package(s) to sync** (`getPackageDirsToSync()`):
   - an explicit `<package-dir>` argument, or
   - on `push` (CI): the packages whose `CHANGELOG.md` changed, or
   - otherwise (manual `workflow_dispatch`, or no `<package-dir>`): every package.

   Then, for each package:
2. **Parse** its `CHANGELOG.md` into one entry per version (`parseChangelog()`).
3. **Fetch** the package's existing GitHub Releases.
4. **Plan the changes** (`getReleasePlan()`): create a release for every changelog version that doesn't have one yet, update any whose notes have drifted from the changelog, and delete any of the package's releases whose version is no longer in the changelog.
5. **Apply** the plan through the GitHub API — or, with `--dry-run`, just log what would change.

It's safe to run against any current state: older missing releases are created too, and [GitHub orders the releases list by tag version](https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257), so they still land in the right place.

A release is tagged from its git tag. The newest version must already be tagged — the sync hard-fails rather than tag the wrong commit — while an older missing tag is recreated at the release commit deduced from the changelog's own history (and hard-fails if it can't be deduced).

## Assumptions

Nothing is hard-coded to this repo — repository, default branch and API URL come from the environment
(`GITHUB_REPOSITORY`, `GITHUB_DEFAULT_BRANCH`, `GITHUB_API_URL`), so the tooling can be reused as-is in
any project that follows the same conventions:

- **A package per `CHANGELOG.md`.** A "package" is any directory that has a `CHANGELOG.md` next to a
  `package.json` — the repo root, `packages/vike`, or any other path.
- **Changelog format.** Each release is a Markdown heading `## [x.y.z](…)`, as produced by changelog
  tools like [release-me](https://github.com/brillout/release-me) or release-please. A `…/compare/…`
  link becomes the release's "Full Changelog" footer.
- **Tags.** A single package keeps the bare `vX.Y.Z` tag; when several packages share the repo, their
  tags are namespaced as `<package.json#name>@x.y.z`.

## Scripts

Run from anywhere in the repo:

```bash
GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run <script>
```

Each script needs a `GITHUB_TOKEN` ([personal access token](https://github.com/settings/tokens)) with the
scope below. `<package-dir>` is a path such as `packages/vike`; omit it to sync every package.

| Script | Description | Token scope |
| --- | --- | --- |
| `run [-- <package-dir>]` | Synchronize GitHub Releases from `CHANGELOG.md`. | `contents: write` |
| `check [-- <package-dir>]` | Dry-run: log what would change without writing anything. | `contents: read` |
| `delete-all` | **Destructive** — delete all GitHub Releases. | `contents: write` |

### Examples

```bash
cd .github/workflows/sync-github-releases/

# Preview the changes for all packages (no writes):
GITHUB_TOKEN=<token> pnpm run check

# Synchronize the releases of packages/vike:
GITHUB_TOKEN=<token> pnpm run run -- packages/vike
```

> Requires [Node.js](https://nodejs.org) ≥ 22.6 — the scripts run the TypeScript directly via type stripping.
