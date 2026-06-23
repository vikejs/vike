# Sync GitHub Releases

Keep GitHub Releases in sync with `CHANGELOG.md`:
- Creates any missing release
- Rewrites any whose notes have drifted from the changelog
- Deletes any whose version is no longer in the changelog

Source of truth is `CHANGELOG.md`: GitHub Releases are completely derived from it.

Runs automatically via [`../sync-github-releases.yml`](../sync-github-releases.yml) — on every push to `main` that touches a `CHANGELOG.md`, and on manual `workflow_dispatch`. The scripts below run the same tooling by hand.

## How it works

1. **Pick which package(s) to sync** (`getPackageDirsToSync()`):
   - an explicit `<package-dir>` argument, or
   - on `push` (CI): the packages whose `CHANGELOG.md` changed, or
   - otherwise (manual `workflow_dispatch`, or no `<package-dir>`): every package.

   Then, for each package:
2. **Parse** its `CHANGELOG.md` into one entry per version (`parseChangelog()`).
3. **Fetch** the package's existing GitHub Releases.
4. **Plan the changes** (`getReleasePlan()`): create a release for every changelog version that doesn't have one yet, update any whose notes have drifted from the changelog, and delete any of the package's releases whose version is no longer in the changelog.
5. **Apply** the plan through the GitHub API — or, with `--dry-run`, just log what would change.

It's safe to run against any current state: older missing releases are created too, and [GitHub orders the list of releases by tag version (not by creation date)](https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257), so they still land in the right place.

## Scripts

```bash
cd .github/workflows/sync-github-releases/
GITHUB_TOKEN=<token> pnpm run <script>
```

Each script needs a `GITHUB_TOKEN` ([personal access token](https://github.com/settings/tokens)) with the
scope below.

| Script | Description | Token scope |
| --- | --- | --- |
| `sync [-- <package-dir>]` | Synchronize GitHub Releases from `CHANGELOG.md`. | `contents: write` |
| `sync:check [-- <package-dir>]` | Dry-run: log what would change without writing anything. | `contents: read` |
| `delete-all` | **⚠️ Destructive** — delete all GitHub Releases. | `contents: write` |

For example:

```bash
cd .github/workflows/sync-github-releases/

# Preview the changes for all packages (no writes)
GITHUB_TOKEN=<token> pnpm run sync:check

# Synchronize the GitHub Releases of packages/vike
GITHUB_TOKEN=<token> pnpm run sync -- packages/vike

# Synchronize all packages
GITHUB_TOKEN=<token> pnpm run sync
```
