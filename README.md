
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

The default configuration runs the **node-sparrest** server at `http://127.0.0.1:8000`, but you can customize it. You are allowed to override the default configuration via a local `ns-config.json` or `ns-config.js` file in your project.

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

If you want to change the default static files directory, which is `./static`, try this:
```json
{
  "dirs": {
    "static": "./uploads"
  }
}
```

## How to

This is a quick **node-sparrest** walkthrough.

### Create a new entity

Just do a **POST** request to the `/api/entity` path, where `entity` is the type of the data you want to store. Use the request body to write the JSON data to store, and don't forget to set the `Content-Type` header as `application/json`:

```bash
$ curl -X POST \
       -H "Content-Type: application/json" \
       -d '{"brand": "Gibson", "model": "Les Paul Goldtop", "year": 1957}' \
       http://localhost:8000/api/guitars
```

An incremental identifier will be set to the entity, starting at 1.

```json
{
  "id": 1,
  "brand": "Gibson",
  "model": "Les Paul Goldtop",
  "year": 1957
}
```

### Retrieve entity data

Try to do a **GET** request to a path pointing to its type and identifier:

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

To retrieve a collection just do a **GET** request using the entity type as path:

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

You can override an entity by using a **PUT** request. You must point the request to the single entity you want to update:

```bash
$ curl -X PUT \
       -H "Content-Type: application/json" \
       -d '{"brand": "Fender"}' \
       http://localhost:8000/api/guitars/3
```

Your updated entity:

```json
{
  "id": 3,
  "brand": "Fender"
}
```

Or you might prefer to patch it with a **PATCH** request:

```bash
$ curl -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"model": "Relic Telecaster Custom", "year": 1962}' \
       http://localhost:8000/api/guitars/3
```

Your original entity is back:

```json
{
  "id": 3,
  "brand": "Fender",
  "model": "Relic Telecaster Custom",
  "year": 1962
}
```

### Deleting entities

To delete an entity, you must do a **DELETE** request to its type and identifier. Make it this way:

```bash
$ curl -X DELETE http://localhost:8000/api/guitars/3
```

### Upload & serve a static file

Since version 0.0.8, you can upload a static file to the **node-sparrest** server. Just make sure you are using the `/upload` endpoint instead of `/api/entity`. The request must be a `POST` one:

```bash
$ curl -X POST \
       -F "file=@/Users/myuser/Desktop/relic-telecaster-custom.png" \
       http://localhost:8000/upload
```

A relative path to the uploaded file will be set in the response:

```json
{
  "path": "upload/cs14cg7h4u781twf.png"
}
```

Then, to serve this file, just prefix the given relative path with the **node-sparrest** server's:

```
http://localhost:8000/upload/cs14cg7h4u781twf.png
```

## More

**node-sparrest** is based on Alberto Casero's SparREST; this is only an attempt to port it from Python to the Node.js world. I highly recommend you to visit the [SparREST repository](https://github.com/kasappeal/sparrest) for more info.

## Status

+ The actions for GET, POST, PUT, PATCH and DELETE methods are already working.
+ It is possible to upload and serve static files.
+ The error handling is really poor at the time. I promise to put some effort in this issue. Eventually.

## License

Code released under the [MIT license](./LICENSE).
