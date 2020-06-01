# Paper-a-Week

## Tools

### Backend Stack

- [Search Engine][microsoft cognitive services](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [Object Document Mapping (ODM)][mongoose](https://mongoosejs.com/)
- [Server] Node.js + [Express.js](https://expressjs.com/)
- [Testing][mocha](https://mochajs.org/)
- [Deployment] Google Cloud Run + Docker

### Frontend Stack

- [Components and Style][ant design](https://ant.design/)
- [JS Library] React + Redux

## Development

### Environment Variables

Create a new file, `server/.env`. It should look like this:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
COOKIE_KEY=
MONGO_URI=
REACT_APP_MSCOG_KEY1=
```

### Code Style

[![styled with prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The `client/` directory is styled using prettier. The settings are defined in [our prettier config file](./client/.prettierrc.json). Staged changes are automatically formatted based on a pre-commit hook using `husky` and `pretty-quick`.

You can format the files yourself by running `yarn pretty-quick` from the `client` directory.

### Dependencies :package:

Run `yarn install` once from `server/` and once from `client/`:

```sh
cd server
yarn install
cd ../client
yarn install
```

You'll need the following installed (maybe globally) if you want hot-reloading and easy startup. They're included in the project, but if you're getting any errors, install them globally.

- [Nodemon](https://www.npmjs.com/package/nodemon) to hot-reload the server.

  ```sh
  npm install -g nodemon
  ```

- [Concurrently](https://www.npmjs.com/package/concurrently) to start the server and client in one go.

  ```sh
  npm install -g concurrently
  ```

To start the server and client together, just run `yarn run dev` from the `server/` directory

### Run Tests

To run the tests for the application, run `yarn test` from the `server/`. No credentials or environment variables are required for running tests.

### Docker

Build the container from the top-level directory:
`docker build -t paw:1.0.0 .`

Run the container, exposing port 5000:5000 in "production" mode. Add environment variables by passing in an "env-file". Read more about this [here](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file). Duplicate my `server/.env`, remove double quotes from the values, and added it to the root directory.
`docker run -p 5000:5000 --env NODE_ENV=production --env-file .env.list --name paw_container paw:1.0.0`

Navigate to `localhost:5000` to see the app in production!

Build and deploy to Cloud Run:

```sh
GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
docker build . --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app && docker push gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app`
```

Then go to Cloud Run, select latest image, and re-deploy.
