## Workflow

- When squash-merging a PR, the commit message should be a one-liner (typically the PR title) and reference the PR number
- Never force push
- You can assume the reviewer reads the code (e.g. you don't need to repeat/explain what the code does)

## Docs

- When changing the docs, consider updating docs/public/llms.txt

## Tests

- The only thing worse than a failing test is a reduction in test coverage
- A test should never cover trivial code — every test must earn its place by covering something non-trivial (e.g. edge cases, complex logic, subtle behavior, ...).
