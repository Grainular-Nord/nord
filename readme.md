<!-- @format -->

# TypeScript NPM-Package Template

This template can be used as a opinionated starting point for a typescript based npm package. It uses several tools to enhance the dx aspect of creating a npm package. Read more about how the different aspects of the template in the [`Contributing Guidelines`](./contributing.md).

## Tools used in the template

-   [yarn](https://yarnpkg.com/getting-started)
-   [TypeScript](https://www.typescriptlang.org)
-   [Rollup](https://rollupjs.org/guide/en/) as bundler, using esbuild to transpile TypeScript to JavaScript
-   [ava](https://github.com/avajs/ava) as test-runner
-   [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to ensure commit standards
-   [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to create releases automatically
-   [Prettier](https://prettier.io) & [Pretty-quick](https://www.npmjs.com/package/pretty-quick) to format the code
-   [alex](https://alexjs.com) for linting the documentation

## Getting started

To get started, clone the repository and recreate the git repository to start with a clean template.

```bash
git clone https://github.com/IamSebastianDev/template-pkg.git <your-package-name>

cd <your-package-name>

# Reset the git repository
yarn reset

# This will leave you with three branches, main, development and release.
```

After creating a new repository, fill out the remaining information in the `package.json` and install the dev-dependencies. You should use the defaults already set in the `package.json` and only change the not already set meta information.

```bash
# fill out the package.json
yarn init
# do a clean install of the dependencies
yarn ci
# install githooks
yarn setup
```

## Development

Checkout the [`Contributing Guidelines`](./contributing.md) to find out how to develop within your newly created repository.
