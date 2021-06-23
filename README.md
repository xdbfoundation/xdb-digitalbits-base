# JS DigitalBits Base

The digitalbits-base library is the lowest-level digitalbits helper library. It consists
of classes to read, write, hash, and sign the xdr structures that are used in
[digitalbits-core](https://github.com/xdbfoundation/DigitalBits). This is an
implementation in JavaScript that can be used on either Node.js or web browsers.

- **[API Reference](https://xdbfoundation.github.io/js-digitalbits-base/)**

> **Warning!** Node version of this package is using [`sodium-native`](https://www.npmjs.com/package/sodium-native) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies).
> This means that if for any reason installation of this package fails, `digitalbits-base` will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
>
> If you are using `digitalbits-base` in a browser you can ignore this. However, for production backend deployments you should definitely be using `sodium-native`.
> If `sodium-native` is successfully installed and working
> `DigitalBitsBase.FastSigning` variable will be equal `true`. Otherwise it will be
> `false`.

## Quick start

1. Install [Bundler](https://bundler.io)
2. Use node version >= 12. 

Clone repository, install dependencie, compile libs and link directory 

```shell
git clone https://github.com/xdbfoundation/js-digitalbits-base
cd js-digitalbits-base
bundle install
yarn
yarn gulp
yarn link
```

Use yarn to include js-digitalbits-base in your own project. Execute in root directory of your project

```shell
yarn link digitalbits-base
```

Then require/import it in your JavaScript:

```js
var DigitalBitsBase = require('digitalbits-base');
```
## Usage

For information on how to use js-digitalbits-base, take a look at the docs in the
[docs folder](./docs).

## Testing

To run all tests:

```shell
yarn gulp test
```

To run a specific set of tests:

```shell
yarn gulp test:node
yarn gulp test:browser
```

You can also run `yarn test` for a simpler subset of the test cases.

## Documentation

Documentation for this repo lives inside the [docs folder](./docs).


## License

js-digitalbits-base is licensed under an Apache-2.0 license. See the
[LICENSE](./LICENSE) file for details.
