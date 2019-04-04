<p align="center"><img src="https://storage.googleapis.com/time-to-coup-api/twitter_header_photo_2.png" alt="header image"></p>

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# Time to Coup

GraphQL based API to track history of Coup G54 games.

# ESLint rules

Notable rules

- `"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]`

# Prettier rules

```json
{
  "printWidth": 80,
  "singleQuote": true,
  "arrowParens": "always"
}
```

# GraphQL

Avaliable schemas

```gql
type Card {
  name: String!
  action: String!
  category: String!
  counteraction: String
}

type Session {
  id: String!
  name: String!
}

type Query {
  randomDeck: [Card]!
  cardsInCategory(category: String!): [Card]
  card(id: Int!): Card
  cards: [Card]
  session(id: String!): Session
  sessions: [Session]
}
```

# Install & Run

## Prerequisites 

You need active MongoDB server available to run or test the application locally.

## Add .env file 

`MONGO_DB_CONNECTION=mongodb://localhost:27017/myproject`
`MONGO_DB_TEST_CONNECTION=mongodb://localhost:27017/myproject_test`
`PORT=8080`

Run `npm install` to install all packages and `npm run dev` to start app with hot reload. App has live reload using `nodemon`.

Run `npm run build && npm run start` to use production version.
Run `npm run test` for testing.

# CI pipeline

[GCP Cloud Build](https://cloud.google.com/cloud-build/) used to build test and deploy an app to the GCP App Engine. Take a look at `cloudbuild.yaml` and `app.yaml` for more information. To be able to deploy app successfully to `Cloud Build` you would need to encrypt .env file with prod values using [kms](https://cloud.google.com/kms/) an commit it to the repository. Also, you need to update keyName and keyRing in `cloudbuid.yaml` more information [here](https://cloud.google.com/kms/docs/encrypt-decrypt)

# Demo

Demo avaliable at `https://time-to-coup.appspot.com`

## 📄 License

MIT License

