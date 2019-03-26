<p align="center"><img src="https://storage.googleapis.com/time-to-coup-api/twitter_header_photo_2.png" alt="header image"></p>

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# Time to Coup

GraphQL based API to track history of Coup G54 games.

# ESLint rules

Notible rules

- `"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]`

# Prettier rules

```json
{
  "printWidth": 80,
  "singleQuote": true
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

type Query {
  cardsInCategory(category: String!): [Card]
  card(id: Int!): Card
  cards: [Card]
}
```

# CI pipeline

GCP Cloud Build used to build test and deploy app to GCP App Engine. Take a look at `cloudbuild.yaml` and `app.yaml` for more information.

# Install & Run

Run `npm install` to install all packages and `npm run dev` to start app with hot reload. App has live reload using `nodemon`.

Run `npm run build && npm run serve` to use production version.
Run `npm run test` for testing.

# Demo

Demo avaliable at `https://time-to-coup.appspot.com`

## 📄 License

MIT License
