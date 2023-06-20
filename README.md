# JS DigitalBits Base

The @digitalbits-blockchain/xdb-digitalbits-base library is the lowest-level digitalbits helper library. It consists
of classes to read, write, hash, and sign the xdr structures that are used in
[digitalbits-core](https://github.com/xdbfoundation/DigitalBits). This is an
implementation in JavaScript that can be used on either Node.js or web browsers.

- **[API Reference](https://xdbfoundation.github.io/xdb-digitalbits-base/)**

> **Warning!** The Node version of this package uses the [`sodium-native`](https://www.npmjs.com/package/sodium-native) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies).
> This means that if for any reason installation of this package fails, `@digitalbits-blockchain/xdb-digitalbits-base` will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
> 
> If you'd explicitly prefer **not** to install the `sodium-native` package, pass the appropriate flag to skip optional dependencies when installing this package (e.g. `--no-optional` if using `npm install` or `--without-optional` using `yarn install`).
> 
> If you are using `@digitalbits-blockchain/xdb-digitalbits-base` in a browser you can ignore this. However, for production backend deployments you should most likely be using `sodium-native`.
> If `sodium-native` is successfully installed and working,
> `DigitalBitsBase.FastSigning` variable will be equal `true`. Otherwise it will be
> `false`.

## Quick start

Using yarn to include @digitalbits-blockchain/xdb-digitalbits-base in your own project:

```shell
yarn add @digitalbits-blockchain/xdb-digitalbits-base
```

For browsers, [use Bower to install it](#to-use-in-the-browser). It exports a
variable `DigitalBitsBase`. The example below assumes you have `xdb-digitalbits-base.js`
relative to your html file.

```html
<script src="xdb-digitalbits-base.js"></script>
<script>
  console.log(DigitalBitsBase);
</script>
```

## Install

### To use as a module in a Node.js project

1. Install it using yarn:

```shell
yarn add @digitalbits-blockchain/xdb-digitalbits-base
```

2. require/import it in your JavaScript:

```js
var DigitalBitsBase = require('@digitalbits-blockchain/xdb-digitalbits-base');
```

### To develop and test xdb-digitalbits-base itself

1. Install Node 14.x

We support the oldest LTS release of Node, which is [currently 14.x](https://nodejs.org/en/about/releases/). Please likewise install and develop on Node 14 so you don't get surprised when your code works locally but breaks in CI.

If you work on several projects that use different Node versions, you might find helpful to install a nodejs version manager.

- https://github.com/creationix/nvm
- https://github.com/wbyoung/avn
- https://github.com/asdf-vm/asdf

2. Install Yarn

This project uses [Yarn](https://yarnpkg.com/) to manages its dependencies. To install Yarn, follow the project instructions available at https://yarnpkg.com/en/docs/install.

3. Clone the repo

```shell
git clone https://github.com/xdbfoundation/xdb-digitalbits-base.git
```

4. Install dependencies inside xdb-digitalbits-base folder

```shell
cd xdb-digitalbits-base
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

1. Make sure you have [Docker](https://www.docker.com/) installed and running.
2. `make reset-xdr`

## Usage

For information on how to use @digitalbits-blockchain/xdb-digitalbits-base, take a look at the docs in the
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

Tests are also run automatically in Github Actions for every master commit and
pull request.

## Documentation

Documentation for this repo lives inside the [docs folder](./docs).

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to
contribute to this project.

## Publishing to npm

```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

A new version will be published to npm **and** Bower by GitHub Actions.

npm >= 2.13.0 required. Read more about
[npm version](https://docs.npmjs.com/cli/version).

## License

@digitalbits-blockchain/xdb-digitalbits-base is licensed under an Apache-2.0 license. See the
[LICENSE](./LICENSE) file for details.
