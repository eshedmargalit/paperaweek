# Paper-a-Week

## Development

You'll need two API keys:

1. For the MongoDB instance
1. For Microsoft Cognitive Services, which provides the academic search [MS Cog Services](https://azure.microsoft.com/en-us/services/cognitive-services/)

Create `.env` in the root directory and add:

```text
DB_CONNECTION_STRING="<your connection string goes here>"
```

Create `client/.env.local` and add:

```text
REACT_APP_MSCOG_KEY1=<MSCOG API key goes here>
```

### Dependencies :package:

From the top-level directory, run `yarn install`.
`cd` into the `client` directory and run `yarn install` to scoop up those dependencies, too.

You'll need the following installed (maybe globally) if you want hot-reloading and easy startup. They're included in the project, but if you're getting any errors, install them globally.

- [Nodemon](https://www.npmjs.com/package/nodemon) to hot-reload the server.

  ```sh
  npm install -g nodemon
  ```

- [Concurrently](https://www.npmjs.com/package/concurrently) to start the server and client in one go.

  ```sh
  npm install -g concurrently
  ```

To start the server and client together, just run `yarn run dev` from the top-level directory.
