# Sync GitHub Releases

Keeps each package's GitHub Releases in sync with its
`CHANGELOG.md`: creates any missing release, rewrites any whose notes have drifted from the changelog,
and deletes any whose version is no longer in the changelog.

The source of truth is `CHANGELOG.md` => GitHub Releases are derived from it.

In CI this runs automatically via [`../sync-github-releases.yml`](../sync-github-releases.yml) — on every
push to `main` that touches a `CHANGELOG.md`, and on manual `workflow_dispatch`. The scripts
below run the same tooling by hand.

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

It's safe to run against any current state: older missing releases are created too, and [GitHub orders the releases list by tag version](https://github.com/vikejs/vike/pull/3157#issuecomment-4406846257), so they still land in the right place.

## Scripts

Run from anywhere in the repo:

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
| `delete-all` | **Destructive** — delete all GitHub Releases. | `contents: write` |

### Examples

```bash
cd .github/workflows/sync-github-releases/

# Preview the changes for all packages (no writes)
GITHUB_TOKEN=<token> pnpm run sync:check

# Synchronize the releases of packages/vike
GITHUB_TOKEN=<token> pnpm run sync -- packages/vike
```

## Decisions

Notable design choices and the reasoning behind them:

- **`CHANGELOG.md` is the source of truth.** The plan is reconciled from the changelog, not from the existing GitHub Releases — so a release the changelog doesn't mention (another package's, or a hand-made one) is never rewritten or deleted. Each generated release links back to its `CHANGELOG.md`.
- **The tag scheme follows the package count.** A lone package keeps the historical bare `vX.Y.Z` tag; several packages sharing the repo get namespaced `<package.json#name>@x.y.z` tags to avoid collisions. The count comes from every tracked `CHANGELOG.md`, not just the package being synced.
- **Deletes stay in their own namespace.** A version removed from the changelog deletes its release only when the tag belongs to the synced package — never another package's or a hand-made release.
- **Missing git tags: hard-fail the newest, deduce the rest.** Tagging the newest release now would point at the default branch's HEAD (the wrong commit), so it hard-fails; an older missing tag is recreated at the commit deduced from the changelog's history, or hard-fails rather than guess.
- **"Latest" is set explicitly.** Only the newest version is created with `make_latest=true`; releases are created oldest-first (so notifications arrive in order) and GitHub sorts the list by tag semver regardless.
- **Only writes are throttled** — a delay sits between write requests for GitHub's secondary rate limit, but never before the first and never for reads, so a single new release waits not at all.
- **On `push`, only changed packages sync** (selected from the push diff); a manual run, or one with no `<package-dir>`, syncs every package.
- **Project-agnostic, not Vike-stripped.** Repository, default branch and API URL come from the environment, so the tool can be dropped into another repo; Vike stays as the running example, since the goal was to drop the *assumption* of Vike-only use, not the name.
- **`CHANGELOG.md` is discovered anywhere**, not only under `packages/` — any directory containing one is a package (the repo root included). Discovery was chosen over a configurable path: simpler, and it covers single-package and other layouts.
- **Names mirror commands** — the scripts and their entry files share a name with what they do: `sync`/`sync.ts`, `sync:check`, `delete-all`/`delete-all.ts`.
- **Entry points don't guard against import.** `sync.ts` and `delete-all.ts` just call `main()`; nothing imports them, so the old "run only if not imported" guard protected a case that never happens.
- **TypeScript runs directly** via Node's type stripping (no build step), with explicit `.ts` import extensions — hence the Node ≥ 22.6 requirement.
