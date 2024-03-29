# RSSSF (RSS simple software semver feeds)

## How to host your own instance

It's currently using mongodb as a db store, place the following in a `.env` file
in project root.

```shell
MONGODB_URL=MY_MONGODB_CONNECTION_STRING
```

Create a database called `rsssf` with a collection called `api-tokens` on the
db. Optionally,
[create a TTL index](https://www.mongodb.com/docs/manual/core/index-ttl/) in
this collection with `expireAfterSeconds: 0` on the field `expireAt`. This lets
you "auto purge" unused tokens to free them up for later use.

Then you can build & run via docker

```shell
docker build -t rsssf .
docker run -it --rm -p 8000:8000 rsssf
```

alternatively, if you use fly.io, change the app name in the file `fly.toml` and
run the following two commands.

```
fly secrets import < .env
fly deploy --build-arg GIT_REVISION=$(git rev-parse HEAD)
```

## Development

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.
