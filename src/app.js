import express from 'express';
import routes from './routes';
import graphql from './graphql';

const app = express();

app.use(routes);

graphql.applyMiddleware({ app });

module.exports = app;
