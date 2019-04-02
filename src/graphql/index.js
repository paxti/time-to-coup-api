import { ApolloServer } from 'apollo-server-express';
import { typeDef, resolvers } from './schema';

export default new ApolloServer({
  typeDefs: [typeDef],
  resolvers
});
