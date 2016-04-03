
# node-sparrest

Based on Alberto Casero's SparREST, **node-sparrest** brings to you a *development-only* sparring backend to test your APIs with.

[![Dependency Status](https://david-dm.org/vermicida/node-sparrest.svg)](https://david-dm.org/vermicida/node-sparrest)
[![npm version](https://badge.fury.io/js/node-sparrest.svg)](https://badge.fury.io/js/node-sparrest)

## Getting started

The way I recommend is to install the package to your local NPM project:
```bash
$ npm install node-sparrest --save-dev
```

And add this script within your project's `package.json` file:
```
  "scripts": {
    "sparrest": "node ./node-modules/node-sparrest/node-sparrest.js"
  }
```

Now you can start the **node-sparrest** server with the following command:
```bash
$ npm run sparrest
```

## Custom configuration

The default configuration runs the **node-sparrest** server at `http://127.0.0.1:8000`, but you can customize it.

**node-sparrest** allows you to override the default configuratio via a local `ns-config.json` or `ns-config.js` file in your project.

You can provide custom path to your config file via `-c` or `--config=` runtime options:
```bash
node node-sparrest.js -c path/to/your/ns-config.json
```

To change the server host or the server port, create a `ns-config.json` in your project's folder with this configuration:
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 9000
  }
}
```

Also, you can change the directory where the entities are stored, being `./api` the default value:
```json
{
  "server": {
    "apiDir": "./entities"
  }
}
```

## More

**node-sparrest** is based on Alberto Casero's SparREST; this is only an attempt to port from Python to the Node.js world. I highly recommend you to visit the [SparREST repository](https://github.com/kasappeal/sparrest) for more info.

## Status

+ GET and POST actions have been already implemented.
+ PUT, PATCH and DELETE actions will be implemented soon.
+ The error handling is really poor at the time. I promise to put some effort in this issue.

## License

Code released under the [MIT license](./LICENSE).
