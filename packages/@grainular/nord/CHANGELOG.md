# @grainular/nord

## 2.3.0

### Minor Changes

- [#177](https://github.com/Grainular-Nord/nord/pull/177) [`04c29d1`](https://github.com/Grainular-Nord/nord/commit/04c29d138a1fc8b396df2d69f23c67f29f8379c9) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Enable providing a generic to mounted to declare what element is being mounted

- [#176](https://github.com/Grainular-Nord/nord/pull/176) [`bd8c0ce`](https://github.com/Grainular-Nord/nord/commit/bd8c0ce5d9a2ac5a465e5efce0689c20e16b5cf9) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Enables directly interpolation of array fragments inside the template parsing. This aligns the array operation API with the rest of the already possible logic in the template

- [#178](https://github.com/Grainular-Nord/nord/pull/178) [`76a074f`](https://github.com/Grainular-Nord/nord/commit/76a074f6938624550d85e48b8f9a3056102d9077) Thanks [@IamSebastianDev](https://github.com/IamSebastianDev)! - Widens the current ComponentFragment requirement to just Fragment, allowing better composition of primitives

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
