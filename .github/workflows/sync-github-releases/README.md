# Sync GitHub Releases

Keeps each package's [GitHub Releases](https://github.com/vikejs/vike/releases) in sync with its
`CHANGELOG.md`: creates any missing release and rewrites any whose notes have drifted from the changelog.

In CI this runs automatically via [`../sync-github-releases.yml`](../sync-github-releases.yml) — on every
push to `main` that touches a `packages/**/CHANGELOG.md`, and on manual `workflow_dispatch`. The scripts
below run the same tooling by hand.

## Scripts

Run from anywhere in the repo:

```bash
GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run <script>
```

Each script needs a `GITHUB_TOKEN` ([personal access token](https://github.com/settings/tokens)) with the
scope below. `<package-dir>` is a path such as `packages/vike`.

| Script | Description | Token scope |
| --- | --- | --- |
| `run -- <package-dir>` | Create/update the package's GitHub Releases from its `CHANGELOG.md`. | `contents: write` |
| `try -- <package-dir>` | Dry-run of `run`: log what would change without writing anything. | `contents: read` |
| `delete-all` | **Destructive** — delete every GitHub Release in the repo. | `contents: write` |

### Examples

```bash
# Preview the changes for the `vike` package (no writes):
GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run try -- packages/vike

# Create/update the releases for real:
GITHUB_TOKEN=<token> pnpm -C .github/workflows/sync-github-releases run run -- packages/vike
```

> Requires [Bun](https://bun.sh) — the scripts run the TypeScript directly with `bun`.

## Files

| File | Purpose |
| --- | --- |
| `index.ts` | Entry point: picks which packages to sync, then plans and applies the release changes. |
| `github-utils.ts` | GitHub REST helpers: auth, fetching releases, throttled requests. |
| `remove-all-releases.ts` | The `delete-all` maintenance script. |
| `index.spec.ts` | Unit tests for changelog parsing and release planning. |
