import { gql } from 'apollo-server-express';
import cardsData from '../../../data/cards';

export const typeDef = gql`
  type Card {
    name: String!
    action: String!
    category: String!
    counteraction: String
  }

  type Query {
    randomDeck: [Card]!
    cardsInCategory(category: String!): [Card]
    card(id: Int!): Card
    cards: [Card]
  }
`;

export const resolvers = {
  Query: {
    randomDeck(_parent, _args) {
      return cardsData.slice(0, 5);
    },
    cardsInCategory(_parent, args) {
      return cardsData.filter(card => card.category === args.category);
    },
    card(_parent, args) {
      return cardsData.find(author => author.id === args.id);
    },
    cards(_parent, _args) {
      return cardsData;
    }
  }
};
