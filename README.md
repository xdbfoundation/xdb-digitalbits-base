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

Using yarn to include js-digitalbits-base in your own project:

```shell
yarn add digitalbits-base
```

For browsers, [use Bower to install it](#to-use-in-the-browser). It exports a
variable `DigitalBitsBase`. The example below assumes you have `digitalbits-base.js`
relative to your html file.

```html
<script src="digitalbits-base.js"></script>
<script>
  console.log(DigitalBitsBase);
</script>
```

## Install

### To use as a module in a Node.js project

1. Install it using yarn:

```shell
yarn add digitalbits-base
```

2. require/import it in your JavaScript:

```js
var DigitalBitsBase = require('digitalbits-base');
```

### To self host for use in the browser

1. Install it using [bower](http://bower.io):

```shell
bower install digitalbits-base
```

2. Include it in the browser:

```html
<script src="./bower_components/digitalbits-base/digitalbits-base.js"></script>
<script>
  console.log(DigitalBitsBase);
</script>
```

### To develop and test js-digitalbits-base itself

1. Install Node 10.16.3

Because we support earlier versions of Node, please install and develop on Node 10.16.3 so you don't get surprised when your code works locally but breaks in CI.

If you work on several projects that use different Node versions, you might find helpful to install a nodejs version manager.

- https://github.com/creationix/nvm
- https://github.com/wbyoung/avn
- https://github.com/asdf-vm/asdf

2. Install Yarn

This project uses [Yarn](https://yarnpkg.com/) to manages its dependencies. To install Yarn, follow the project instructions available at https://yarnpkg.com/en/docs/install.

3. Clone the repo

```shell
git clone https://github.com/xdbfoundation/js-digitalbits-base.git
```

4. Install dependencies inside js-digitalbits-base folder

```shell
cd js-digitalbits-base
yarn
```

5. Observe the project's code style

While you're making changes, make sure to run the linter-watcher to catch any
linting errors (in addition to making sure your text editor supports ESLint)

```shell
node_modules/.bin/gulp watch
```

If you're working on a file not in `src`, limit your code to Node 6.16 ES! See
what's supported here: https://node.green/ (The reason is that our npm library
must support earlier versions of Node, so the tests need to run on those
versions.)

#### Updating XDR definitions

1. Make sure you have [Ruby](https://www.ruby-lang.org/en/) installed. You can
   either use a global installation, or use a version manager.

- https://www.ruby-lang.org/en/downloads/
- https://github.com/rbenv/rbenv
- https://rvm.io
- https://github.com/asdf-vm/asdf

2. Install [Bundler](https://bundler.io).
3. Install all dependencies.
4. Copy xdr files from
   https://github.com/xdbfoundation/DigitalBits/tree/master/src/xdr to `./xdr`.
5. Run `yarn xdr` from the js-digitalbits-base folder.
6. Transform the newly-generated JS into TypeScript using [dts-xdr](https://github.com/xdbfoundation/dts-xdr):

To "scriptify" the above instructions, here are the steps one by one:

```bash
git clone https://github.com/xdbfoundation/js-digitalbits-base
cd js-digitalbits-base
bundle install
yarn
yarn xdr

# If src/generated/digitalbits-xdr_generated.js changed, then:
git clone https://github.com/xdbfoundation/dts-xdr
cd dts-xdr
npm install
OUT=digitalbits-xdr_generated.d.ts npx jscodeshift -t src/transform.js ../src/generated/digitalbits-xdr_generated.js
cp digitalbits-xdr_generated.d.ts ../types/xdr.d.ts
cd .. && rm -rf dts-xdr
yarn run prettier --write types/xdr.d.ts
```

## Usage

For information on how to use js-digitalbits-base, take a look at the docs in the
[docs folder](./docs).

## Testing

To run all tests:

```shell
gulp test
```

To run a specific set of tests:

```shell
gulp test:node
gulp test:browser
```

You can also run `yarn test` for a simpler subset of the test cases.

## Documentation

Documentation for this repo lives inside the [docs folder](./docs).

## Publishing to npm

```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

npm >=2.13.0 required. Read more about
[npm version](https://docs.npmjs.com/cli/version).

## License

js-digitalbits-base is licensed under an Apache-2.0 license. See the
[LICENSE](./LICENSE) file for details.
