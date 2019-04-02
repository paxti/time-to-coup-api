import { gql } from 'apollo-server-express';
import cardsData from '../../../data/cards';
import generateRandom from '../../utils';
import Session from '../../models/Session';

export const typeDef = gql`
  type Card {
    name: String!
    action: String!
    category: String!
    counteraction: String
  }

  type Session {
    id: String!
    name: String!
    email: String!
  }

  type Query {
    randomDeck: [Card]!
    cardsInCategory(category: String!): [Card]
    card(id: Int!): Card
    cards: [Card]
    session(id: String!): Session
    sessions: [Session]
  }
`;

export const resolvers = {
  Query: {
    randomDeck(_parent, _args) {
      return generateRandom().map((number) => cardsData[number]);
    },
    cardsInCategory(_parent, args) {
      return cardsData.filter((card) => card.category === args.category);
    },
    card(_parent, args) {
      return cardsData.find((author) => author.id === args.id);
    },
    cards(_parent, _args) {
      return cardsData;
    },
    async sessions(_parent, _argsd) {
      return Session.find({});
    },
    async session(_parent, args) {
      return Session.findOne(args);
    }
  }
};
