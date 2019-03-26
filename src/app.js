import express from 'express';
import routes from './routes';
import graphql from './graphql';

const app = express();

app.use(routes);
app.use('/graphql', graphql);

module.exports = app;
