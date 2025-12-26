# Paper a Week

A simple interface for finding papers, taking detailed notes, building a habit out of reading papers, and sharing your ideas with others.

## Features

- :pencil: Flexible form to take detailed notes including Markdown and LaTeX

- :eyeglasses: Sort and search through your database of notes

- :outbox_tray: Make your profile public and share your notes with others

- :bookmark_tabs: Plan future work with a reading list

- :chart_with_upwards_trend: Track your reading frequency over time

## Development

### Requirements

- Node.js 20 (specified in `.nvmrc`)

### Backend

The server is written using [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/). Data is stored using MongoDB with [Mongoose](https://mongoosejs.com/) as an object-document mapping (ODM) library.

The website is deployed from a Docker container using Google Cloud Run.

### Frontend

The interface is primarily based on [ant design](https://ant.design/), with a number of custom components added. React and Redux are used to manage component and application state, respectively. [Vite](https://vitejs.dev/) is used as the build tool and dev server.

## Guide for Developers

### Environment Variables

Create a new file, `server/.env`. It should look like this:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
COOKIE_KEY=
MONGO_URI=
```

The first two keys are obtained by setting up a Google OAuth account, the cookie key can be any arbitrary string, and the Mongo URI is obtained after setting up a MongoDB instance.

#### Mongo Databases

We have two databases, one for development/staging, and one used in deployment.
The deployment database should never be used during writing or testing of code.

##### Development/Staging

For development, we use the Mongo Atlas cluster "pawnonprodcluster" and the database
`paw`. An example connection string for that database looks like:

```text
mongodb+srv://<user>:<password>@pawnonprodcluster.ewbc6.mongodb.net/paw?retryWrites=true&w=majority
```

where `user` and `password` correspond to your credentials on the Mongo Atlas project.

##### Deployment

For deployment, we use the Mongo Atlas cluster "paperaweekdev" with the database `test`.
An example connection string for that database looks like:

```text
mongodb+srv://<user>:<password>@paperaweekdev-luhxd.mongodb.net/test?retryWrites=true"
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

To start the server and client together, just run `yarn start`.

### Run Tests

To run the tests for the application, run `yarn test` from the `server/` or `/client` directory, depending on whether you want to run backend or frontend tests.

No credentials or environment variables are required for running tests.

### Deployment to Google Cloud Run

Make sure Docker is running on your system before following these steps. You will need to follow the instructions in Google Cloud Run to set up the Google Cloud Project, add a payment method, etc.

```sh
GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
docker build . --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app && docker push gcr.io/${GOOGLE_CLOUD_PROJECT}/paw-app
```

Then go to Cloud Run, select latest image, and re-deploy. We set the number of minimum instances to 1 to avoid cold-starts.
