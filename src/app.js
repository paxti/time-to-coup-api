/* eslint-disable no-console */
import {} from 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';

import routes from './routes';
import graphql from './graphql';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_DB_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => console.log(`Connected to ${process.env.MONGO_DB_CONNECTION}`))
    .catch((err) => console.log(err));
}

app.use(routes);

graphql.applyMiddleware({ app });

const httpServer = createServer(app);
graphql.installSubscriptionHandlers(httpServer);

module.exports = httpServer;
