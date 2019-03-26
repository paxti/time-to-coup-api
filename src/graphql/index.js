import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello world!'
};

export default graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
});
