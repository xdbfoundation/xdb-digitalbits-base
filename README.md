# JS DigitalBits Base

[![Build Status](https://travis-ci.org/digitalbitsorg/js-digitalbits-base.svg)](https://travis-ci.org/digitalbitsorg/js-digitalbits-base)
[![Code Climate](https://codeclimate.com/github/digitalbitsorg/js-digitalbits-base/badges/gpa.svg)](https://codeclimate.com/github/digitalbitsorg/js-digitalbits-base)
[![Coverage Status](https://coveralls.io/repos/digitalbitsorg/js-digitalbits-base/badge.svg?branch=master&service=github)](https://coveralls.io/github/digitalbitsorg/js-digitalbits-base?branch=master)
[![Dependency Status](https://david-dm.org/digitalbitsorg/js-digitalbits-base.svg)](https://david-dm.org/digitalbits/js-digitalbits-base)

The digitalbits-base library is the lowest-level digitalbits helper library.  It consists of classes
to read, write, hash, and sign the xdr structures that are used in [digitalbits-core](https://github.com/DigitalBitsOrg/digitalbits-core).
This is an implementation in JavaScript that can be used on either Node.js or web browsers.

* **[API Reference](https://digitalbits.github.io/js-digitalbits-base/)**

> **Warning!** Node version of this package is using [`ed25519`](https://www.npmjs.com/package/ed25519) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies). This means that if for any reason installation of this package fails, `digitalbits-base` will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
>
> If you are using `digitalbits-base` in a browser you can ignore this. However, for production backend deployments you should definitely be using `ed25519`. If `ed25519` is successfully installed and working `StellarBase.FastSigning` variable will be equal `true`. Otherwise it will be `false`.

## Quick start

Using npm to include js-digitalbits-base in your own project:
```shell
npm install --save digitalbits-base
```

For browsers, [use Bower to install it](#to-use-in-the-browser). It exports a
variable `StellarBase`. The example below assumes you have `digitalbits-base.js`
relative to your html file.

```html
<script src="digitalbits-base.js"></script>
<script>console.log(StellarBase);</script>
```

## Install

### To use as a module in a Node.js project
1. Install it using npm:

  ```shell
  npm install --save digitalbits-base
  ```
2. require/import it in your JavaScript:

  ```js
  var StellarBase = require('digitalbits-base');
  ```

### To self host for use in the browser
1. Install it using [bower](http://bower.io):

  ```shell
  bower install digitalbits-base
  ```

2. Include it in the browser:

  ```html
  <script src="./bower_components/digitalbits-base/digitalbits-base.js"></script>
  <script>console.log(StellarBase);</script>
  ```

If you don't want to use install Bower, you can copy built JS files from the [bower-js-digitalbits-base repo](https://github.com/digitalbitsorg/bower-js-digitalbits-base).

### To use the [cdnjs](https://cdnjs.com/libraries/digitalbits-base) hosted script in the browser
1. Instruct the browser to fetch the library from [cdnjs](https://cdnjs.com/libraries/digitalbits-base), a 3rd party service that hosts js libraries:

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/digitalbits-base/{version}/digitalbits-base.js"></script>
  <script>console.log(StellarBase);</script>
  ```

Note that this method relies using a third party to host the JS library. This may not be entirely secure.

Make sure that you are using the latest version number. They can be found on the [releases page in Github](https://github.com/digitalbitsorg/js-digitalbits-base/releases).

### To develop and test js-digitalbits-base itself
1. Clone the repo

  ```shell
  git clone https://github.com/digitalbitsorg/js-digitalbits-base.git
  ```
2. Install dependencies inside js-digitalbits-base folder

  ```shell
  cd js-digitalbits-base
  npm install
  ```

## Usage
For information on how to use js-digitalbits-base, take a look at the docs in the [docs folder](./docs).

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

Tests are also run on the [Travis CI js-digitalbits-base project](https://travis-ci.org/digitalbitsorg/js-digitalbits-base) automatically.

## Documentation
Documentation for this repo lives inside the [docs folder](./docs).

## Contributing
Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## Publishing to npm
```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```
A new version will be published to npm **and** Bower by Travis CI.

npm >=2.13.0 required.
Read more about [npm version](https://docs.npmjs.com/cli/version).

## License
js-digitalbits-base is licensed under an Apache-2.0 license. See the [LICENSE](./LICENSE) file for details.
