import { ApolloServer } from 'apollo-server-express';
import { typeDef as Card, resolvers as cardResolvers } from './schemas/card';

export default new ApolloServer({
  typeDefs: [Card],
  resolvers: cardResolvers
});
