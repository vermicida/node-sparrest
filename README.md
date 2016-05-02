
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
    "sparrest": "node ./node_modules/node-sparrest/node-sparrest.js"
  }
```

Now you can start the **node-sparrest** server with the following command:
```bash
$ npm run sparrest
```

## Custom configuration

The default configuration runs the **node-sparrest** server at `http://127.0.0.1:8000`, but you can customize it.

**node-sparrest** allows you to override the default configuration via a local `ns-config.json` or `ns-config.js` file in your project.

To change the server's host and/or port, create a `ns-config.json` in your project's folder with this configuration:
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
  "dirs": {
    "api": "./entities"
  }
}
```

And if you want to change the default static files directory, which is `./static`, try this:
```json
{
  "dirs": {
    "static": "./uploads"
  }
}
```

## How to

I will show you a quick **node-sparrest** walkthrough.

### Create a new entity

Just do a POST request to the `/api/entity` path, where `entity` is the type of the data you want to store. Use the request body to write the JSON data, and don't forget to set the `Content-Type` header as `application/json`:

```bash
$ curl -H "Content-Type: application/json" \
       -X POST \
       -d '{"brand": "Gibson", "model": "Les Paul Goldtop", "year": 1957}' \
       http://localhost:8000/api/guitars
```

An incremental identifier will be set to the entity, starting by 1.

```json
{
  "id": 1,
  "brand": "Gibson",
  "model": "Les Paul Goldtop",
  "year": 1957
}
```

### Retrieve an entity data

Try to do a GET request to a path pointing to its type and identifier:

```bash
$ curl http://localhost:8000/api/guitars/2
```

You will get the entity asked for:

```json
{
  "id": 2,
  "brand": "PRS",
  "model": "SE Custom 22",
  "year": 2014
}
```

### List all entities

To retrieve a collection just do a GET request using the entity type as path:

```bash
$ curl http://localhost:8000/api/guitars
```

Et voilà:

```json
[{
  "id": 1,
  "brand": "Gibson",
  "model": "Les Paul Goldtop",
  "year": 1957
}, {
  "id": 2,
  "brand": "PRS",
  "model": "SE Custom 22",
  "year": 2014
}, {
  "id": 3,
  "brand": "Fender",
  "model": "Relic Telecaster Custom",
  "year": 1962
}]
```

### Updating and patching an entity

You can override an entity by using a PUT request. You must point the request to the single entity you want to update:

```bash
$ curl -H "Content-Type: application/json" \
       -X PUT \
       -d '{"brand": "Fender"}' \
       http://localhost:8000/api/guitars/3
```

Your updated entity.

```json
{
  "id": 3,
  "brand": "Fender"
}
```

Or you might prefer to patch it:

```bash
$ curl -H "Content-Type: application/json" \
       -X PATCH \
       -d '{"model": "Relic Telecaster Custom", "year": 1962}' \
       http://localhost:8000/api/guitars/3
```

And your original entity is back:

```json
{
  "id": 3,
  "brand": "Fender",
  "model": "Relic Telecaster Custom",
  "year": 1962
}
```

### Deleting entities

To delete an entity, you must do a DELETE request to its type and identifier. Make it this way:

```bash
curl -X DELETE http://localhost:8000/api/guitars/3
```

## More

**node-sparrest** is based on Alberto Casero's SparREST; this is only an attempt to port it from Python to the Node.js world. I highly recommend you to visit the [SparREST repository](https://github.com/kasappeal/sparrest) for more info.

## Status

+ The actions for GET, POST, PUT, PATCH and DELETE methods are already working.
+ Now you can upload & serve static files.
+ The error handling is really poor at the time. I promise to put some effort in this issue. Eventually.

## License

Code released under the [MIT license](./LICENSE).
