# JS DigitalBits Base

The xdb-digitalbits-base library is the lowest-level digitalbits helper library. It consists
of classes to read, write, hash, and sign the xdr structures that are used in
[digitalbits-core](https://github.com/xdbfoundation/DigitalBits). This is an
implementation in JavaScript that can be used on either Node.js or web browsers.

- **[API Reference](https://xdbfoundation.github.io/xdb-digitalbits-base/)**

> **Warning!** Node version of this package is using [`sodium-native`](https://www.npmjs.com/package/sodium-native) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies).
> This means that if for any reason installation of this package fails, `xdb-digitalbits-base` will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
>
> If you are using `xdb-digitalbits-base` in a browser you can ignore this. However, for production backend deployments you should definitely be using `sodium-native`.
> If `sodium-native` is successfully installed and working
> `DigitalBitsBase.FastSigning` variable will be equal `true`. Otherwise it will be
> `false`.

## Quick start

1. Install [Bundler](https://bundler.io)
2. Use node version >= 12. 

Clone repository, install dependencie, compile libs and link directory 

```shell
git clone https://github.com/xdbfoundation/xdb-digitalbits-base
cd xdb-digitalbits-base
bundle install
yarn
yarn gulp
yarn link
```

Use yarn to include xdb-digitalbits-base in your own project. Execute in root directory of your project

```shell
yarn link xdb-digitalbits-base
```

Then require/import it in your JavaScript:

```js
var DigitalBitsBase = require('xdb-digitalbits-base');
```
### Updating XDR definitions

1. Make sure you have [Ruby](https://www.ruby-lang.org) installed 3.1.0 version. You can either use a global installation, or use a version manager.
  - https://www.ruby-lang.org/en/downloads/
  - https://github.com/rbenv/rbenv

2. Make sure you have [Bundler](https://bundler.io/) installed.

3. Install all Bundler's depedencies
```shell
bundle install
```

4. Install all nvm's depedencies
```shell
yarn
```

5. Copy xdr files from [DigitalBits/xdr](https://github.com/xdbfoundation/DigitalBits/tree/master/src/xdr) to ./xdr.

6. Run
```shell
yarn xdr
```
from xdb-digitalbits-base folder

7. If src/generated/digitalbits-xdr_generated.js changed, then:
Transform the newly-generated JS into TypeScript using [dts-xdr](https://github.com/stellar/dts-xdr):
Clone dts-xdr into root folder and setup
```shell
git clone https://github.com/stellar/dts-xdr.git
cd dts-xdr
yarn install
```
then generate new TypeScript types:
```shell
OUT=digitalbits-xdr_generated.d.ts npx jscodeshift -t src/transform.js ../src/generated/digitalbits-xdr_generated.js
cp digitalbits-xdr_generated.d.ts ../types/xdr.d.ts
cd ../
yarn run prettier --write types/xdr.d.ts
```
then at types/xdr.d.ts leave necessary only changes  

In short here are the steps one by one:
```shell
git clone https://github.com/xdbfoundation/xdb-digitalbits-base
cd xdb-digitalbits-base
bundle install
yarn
# If src/generated/stellar-xdr_generated.js changed, then:
git clone https://github.com/stellar/dts-xdr.git
cd dts-xdr
yarn install
OUT=digitalbits-xdr_generated.d.ts npx jscodeshift -t src/transform.js ../src/generated/digitalbits-xdr_generated.js
cp digitalbits-xdr_generated.d.ts ../types/xdr.d.ts
cd ../
yarn run prettier --write types/xdr.d.ts
# then at types/xdr.d.ts leave necessary only changes
yarn gulp
```

## Usage

For information on how to use xdb-digitalbits-base, take a look at the docs in the
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

xdb-digitalbits-base is licensed under an Apache-2.0 license. See the
[LICENSE](./LICENSE) file for details.
