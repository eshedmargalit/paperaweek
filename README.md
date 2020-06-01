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

### Code Style

[![styled with perttier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The `client/` directory is styled using prettier. The settings are defined in [our prettier config file](./client/.prettierrc.json). Staged changes are automatically formatted based on a pre-commit hook using `husky` and `pretty-quick`.

You can format the files yourself by running `yarn pretty-quick` from the `client` directory.

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

### Run Tests

To run the tests for the application, run `yarn test` from the top-level directory. No credentials or environment variables are required for running tests.

### Docker

Build the container from the top-level directory:
`docker build -t paw:1.0.0 .`

Run the container, exposing port 5000:000 in "production" mode
`docker run -p 5000:5000 --env NODE_ENV=production --name paw_container paw:1.0.0`

Navigate to `localhost:5000` to see the app in production!

To drop into a shell in the running container:
`docker exec -it paw_container sh`

Build and deploy to Cloud Run:

```sh
GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
docker build . --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app && docker push gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app`
```

Then go to Cloud Run, select latest image, and re-deploy.
