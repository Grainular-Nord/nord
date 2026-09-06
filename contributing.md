# Contributing to Nørd

Bug reports, feature requests, documentation improvements, and code contributions are welcome. Start with the [project tenets](readme.md#-tenets-of-nord) to understand Nørd's focus on a small, dependency-free core runtime, browser APIs, and fine-grained updates.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all project spaces. It also explains how to report concerns privately.

## Issues

Search existing issues before opening a new one, then choose the bug report or feature request template. For substantial API or architecture changes, open a feature request first so the approach can be discussed before implementation.

Use this title format for issues:

```text
(scope): Title
```

Choose a scope such as `core`, `forms`, `router`, `cli`, or `docs`. For example:

- `(core): Component does not update after state changes`
- `(forms): Support asynchronous field validation`
- `(cli): Add a starter template option`

Bug reports should include the affected packages and versions, a minimal reproduction, steps to reproduce, expected and actual behavior, and relevant environment details. The bug template applies the `bug` and `triage` labels.

Feature requests should explain the problem or use case, the proposed behavior, and any alternatives considered. The feature template applies the `enhancement` label.

## Local setup

Use Node.js 24, matching CI, and npm 11.6.0, as declared in the root `package.json`. Use npm to install dependencies and keep the shared `package-lock.json` up to date.

Fork the repository, clone your fork, and create a branch from `main`. Run the following commands from the repository root:

```sh
npm ci
npm run build:packages
```

The initial build prepares the local packages used by other workspaces and sites. Package builds also run their configured tests through Turborepo.

To enable the repository's Git hooks locally, run:

```sh
npx lefthook install
```

The hooks run formatting and linting before commits and validate commit messages. Review any formatting changes before committing.

Bun is only needed if you use the CLI package's `cli` script to run its source directly. The standard build and test commands use npm and Node.js.

## Repository layout

| Location                          | Contents                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `packages/@grainular/nord`        | Core UI runtime; use the `core` issue scope                  |
| `packages/@grainular/*`           | Companion packages such as grains, forms, router, and styled |
| `packages/@grainular/create-nord` | CLI and starter templates; use the `cli` issue scope         |
| `packages/@repository/config`     | Shared development configuration                             |
| `packages/vite-plugin-nord-md`    | Markdown integration for Vite                                |
| `sites/`                          | Documentation, playground, and project websites              |
| `sites/docs.nordjs.dev/docs`      | Main documentation content                                   |
| `.changeset/`                     | Pending package release notes                                |

## Development

Run package builds in watch mode:

```sh
npm run dev
```

To work on the sites, run this in a separate terminal:

```sh
npm run dev:sites
```

You can also work on a single package or site from the repository root:

```sh
npm run dev --workspace=@grainular/nord
npm run docs:dev --workspace=sites/docs.nordjs.dev
```

Keep changes focused on the issue being addressed and follow nearby code conventions. Preserve the core runtime's dependency-free design and consider bundle size and update performance when changing runtime behavior.

Add regression tests for bug fixes where a relevant test suite exists. For new behavior, cover meaningful public behavior and edge cases. Update documentation and examples when the public API or user experience changes.

## Validation

Before opening a pull request with code changes, run the same checks as CI:

```sh
npm run format:check
npm run lint
npm test
npm run build:packages
```

Use `npm run format` to apply formatting. It formats the repository, so review the resulting diff for unrelated changes.

For a focused test run after building dependencies, use a workspace with a test script, for example:

```sh
npm test --workspace=@grainular/nord
```

For site or documentation changes, preview the affected pages and run `npm run build:sites`. Include screenshots for visible UI changes when they help reviewers assess the result. Documentation-only and repository maintenance changes need the checks relevant to those changes; explain any skipped or failing checks in the pull request.

## Commits and pull requests

Commit messages follow Conventional Commits, as configured in `commitlint.config.ts`. Examples:

```text
fix(core): clean up subscriptions on unmount
feat(forms): add asynchronous validation
docs: clarify local setup
chore(deps): update build tooling
```

Open pull requests against `main` and fill out the [pull request template](.github/pull_request_template.md). Explain the problem, the resulting behavior, and how you verified the change. Link related issues, using `Closes #123` when the pull request resolves one. Call out breaking changes and migration steps.

The `(scope): Title` convention above applies to issues. Choose a clear, descriptive pull request title.

## Use of AI

AI tools are welcome, provided their use is disclosed in the pull request description. Disclosure is not required in the code itself. Pull requests containing clearly AI-generated code without disclosure will be rejected.

## Changesets and releases

Include a changeset when a change needs a package release:

```sh
npx changeset
```

Select the affected publishable packages, choose an appropriate version bump, and write a concise description of the user-visible change. Include migration guidance for breaking changes. Commit the generated Markdown file in `.changeset/` with your code.

Documentation, tests, and repository maintenance usually do not need a changeset. Several packages share a fixed release group; the Changesets configuration handles their version coordination.

Maintainers handle versioning and publishing through the release workflow. Contributions should include changesets where needed; manual version bumps and publishing are not part of the contribution workflow.
