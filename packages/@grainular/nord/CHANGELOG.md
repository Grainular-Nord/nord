# @grainular/nord

## 2.2.1

### Patch Changes

- [#156](https://github.com/Grainular-Nord/nord/pull/156) [`6e4e6cc`](https://github.com/Grainular-Nord/nord/commit/6e4e6cccc67b7b4daf9ec3a9048df0207b295a85) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Resolves an issue where during server side evaluation the mutation observer would not be available, even though it's never used

## 2.2.0

### Minor Changes

- [#154](https://github.com/Grainular-Nord/nord/pull/154) [`b596215`](https://github.com/Grainular-Nord/nord/commit/b596215c789e655e1e3297c689694cc2eb6d1e97) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Add a $empty state to the $each struct

- [#147](https://github.com/Grainular-Nord/nord/pull/147) [`d6b625f`](https://github.com/Grainular-Nord/nord/commit/d6b625fec89d819223be039c88ecc456b80ec2f8) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Interpolated values are now escaped when serialized on the server

- [#149](https://github.com/Grainular-Nord/nord/pull/149) [`afe915f`](https://github.com/Grainular-Nord/nord/commit/afe915fcb86fc84230ddfdc75275e17c4930b6a8) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Allows directives to define a optional SSR snapshot to render

- [#146](https://github.com/Grainular-Nord/nord/pull/146) [`efc74e4`](https://github.com/Grainular-Nord/nord/commit/efc74e4b9443757504aaa07bab96533b58403e2e) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Changes the lifecycle observer from a global singleton to a injected instance. This allows for individual construction and teardown of applications without crosscutting issues between applications

## 2.1.0
