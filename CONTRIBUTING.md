# Contributing

To develop Vike's documentation (`https://vike.dev`):

- [Docs](#docs)

To develop Vike's source code:

- [Get started](#get-started)
- [Run tests](#run-tests)
- [Publish to npm](#publish-to-npm)

<br/>


## Get started

**1. Install**

```shell
git clone git@github.com:vikejs/vike
cd vike/ # Go to the monorepo root
pnpm install
```

> [!NOTE]
> See [System requirements](#system-requirements) for how to install pnpm.

**2. Build**

To build Vike's source code:

```shell
pnpm build # At the monorepo root
```

Or, if you want to watch & re-build upon modifications:

```shell
pnpm run dev # At the monorepo root
```

> [!NOTE]
> When switching Git branches, you may need to run `$ pnpm reset` (at the monorepo root): it will re-install and re-build everything. It's required when switching to a branch that, for example, changes the `dependencies` list of `package.json`.

**3. Try**

To try your modifications, open a second shell and run:

```shell
cd examples/react-full/ # or another example
pnpm run dev
```

> [!WARNING]
> After changing the source code of Vike, make sure to **always clear Vite's client cache** with `$ rm -rf examples/some-example/node_modules/.vite/`. Otherwise you'll get a version mismatch between the server (using the latest build) and the client (using the previous cached build).

<br/>


## Run tests

**Run all**

At the monorepo root:

```shell
# Run the unit tests /**/*.spec.js
pnpm exec vitest --project unit

# Run the end-to-end tests /**/*.test.js
pnpm exec test-e2e
```

> [!TIP]
> The end-to-end tests can take a lot of time. We therefore recommend the following:
> - Instead of running all end-to-end tests, run only the end-to-end tests of one example.
> - Instead of running all end-to-end tests locally, run them on GitHub: push your changes to your Vike fork (`github.com/your-username/vike`) and see the result of all end-to-end tests on the GitHub actions of your fork. On GitHub, the tests run in parallel and thus *much* faster than locally.

> [!NOTE]
> On Debian, [these additional steps](https://github.com/vikejs/vike/issues/283#issuecomment-1072974554) are required.

**Run subset**

To run the end-to-end tests of only one example:

```shell
cd examples/some-example/ # From the monorepo root
pnpm exec test-e2e
```

Or:

```shell
# Filter
pnpm exec test-e2e ome-exampl # At the monorepo root
```

<br/>


## Docs

To develop Vike's documentation (`https://vike.dev`):

**1. Install**

```shell
git clone git@github.com:vikejs/vike
cd vike/ # Go to the monorepo root
pnpm install
```

> [!NOTE]
> See [System requirements](#system-requirements) for how to install pnpm.

**2. Build Vike**

```shell
pnpm build # At the monorepo root
```

**3. Develop docs**

```shell
cd docs/ # From the monorepo root
pnpm run dev
```

<br/>


## Publish to npm

Maintainers can manually run the **Publish to npm** GitHub Actions workflow to publish `vike` using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

### One-time setup

In the `vike` package's npm settings, add a GitHub Actions trusted publisher:

| Field | Value |
| --- | --- |
| Organization or user | `vikejs` |
| Repository | `vike` |
| Workflow filename | `publish.yml` |
| Environment name | `release` |
| Allowed actions | Enable direct publishing with `npm publish` |

Complete the first successful publish within two days of creating the configuration, before it expires. No npm publishing token or GitHub secret is needed.

### Publish

The workflow publishes the version already committed in `packages/vike/package.json`. Prepare the version, changelog, and Git tag beforehand; the workflow doesn't create or update them. The existing `pnpm run release` commands also publish to npm, so don't use them just to prepare a version for this workflow.

Once `publish.yml` is merged into the default branch, open **Actions → Publish to npm → Run workflow**, select the release branch, and choose the npm dist-tag (`latest` for stable releases, `beta` for prereleases). The selected version must not already exist on npm. Any protection rules on the `release` environment apply.

Alternatively, from the repository:

```shell
gh workflow run publish.yml --ref main -f tag=latest
gh run watch
```

The workflow installs dependencies from the pnpm lockfile, builds Vike, and publishes from `packages/vike/`, including its `prepack` step. Publishing only runs when manually triggered in `vikejs/vike`.

<br/>


## System requirements

- Node.js `>=20.0.0`
- [pnpm](https://pnpm.io)

> [!NOTE]
> To install [pnpm](https://pnpm.io) run:
> ```shell
> npm install -g pnpm
> ```
> (Or see [pnpm Docs > Installation](https://pnpm.io/installation) for alternative methods.)

> [!NOTE]
> These requirements are only needed for developing the source code of Vike. The npm package `vike` itself can be used with any package manager.
