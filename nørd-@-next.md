# Nørd@next

Hej! Thanks for checking out the `next` branch. Nørd's version 2.0.0 is currently in development and has just finished completion of it's core primitives:

- [`@grainular/nord`](./packages/@grainular/nord/README.md) - The reactive runtime
- [`@grainular/grains`](./packages/@grainular/grains/README.md) - The reactive primitives
- [`@grainular/styled`](./packages/@grainular/styled/README.md) - The CSS is JS solution
- [`@grainular/forms`](./packages/@grainular/forms/README.md) - The reactive forms library

With most of the building blocks in place and the core API hopefully locked down, I'd love to get feedback on Nørd.

## Setting up

To test out Nørd, you can take a look at the examples in the respective [`directory`](./examples/). You can play around with the code there, or setup your own playground. While documentation is still WIP, most of the core methods should be fairly well documented.

To work with the repository, you need to install dependencies. The easiest way is to use `bun`, as the repository also uses this. I'm pretty sure `npm i` would also work, but do so at your own risk.

### Running a example

After navigating to the directory (eg. `cd examples/tic-tac-toe`), you can run `bun run dev:example` to start the standard vite server with the example.

### Creating your own example

The easiest way to setup a new project for testing is to locally link the libraries you want to use.

```sh
# Add a package to the local link cache
cd packages/@grainular/<package-name> 
bun link # npm link should also work
```

To use this package, in the root where you would install dependencies, you can just run `bun link <package-name> <package-name>` to link one ore more packages. Watch out for node just removing packages and only linking one. Always install all packages at the same time.

To quickly set up a test app, use `bun create vite@latest`, choose the vanilla ts example, and add Nørd manually. There is no special compiler or plugin required.

> There is a cli scaffolder, you can also use.

### Editor Extension

There is a syntax highlighting plugin for Nørd in [`language-tools/nord-vscode`](./language-tools/nord-vscode/). You can manually install the `.vsix` file, while the plugin is not yet released.

### Benchmarks

You can find benchmark screenshots [in the benchmarks directory](./benchmarks/). As you can see, Nørd performs in about the range other modern frameworks do. Granular updates are faster, bundle size and sustained load performances are good. DOM Manipulation is average or worse then average, simply based on the caveat that Nørd operates 100% at runtime.

### Looking for feedback

- How does Nørd feel?
- How easy is it to write Nørd syntax? ($each, ...etc)
- How easy is it to grasp Nørds mental model?
- Where the tenets helpful?
- Where did you get stuck?
