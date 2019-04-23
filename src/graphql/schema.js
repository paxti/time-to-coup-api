import { gql } from 'apollo-server-express';
import { PubSub } from 'apollo-server';
import cardsData from '../../data/cards';
import generateRandom from '../utils';
import Session from '../models/Session';
import Round from '../models/Round';

const SESSION_ADDED = 'SESSION_ADDED';

const pubsub = new PubSub();

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
  }

  type Round {
    winner: String
    players: [String]!
    type: String!
  }

  type Subscription {
    sessionAdded: Session
  }

  type Mutation {
    addSession(id: String, name: String): Session
  }

  type Query {
    randomDeck: [Card]!
    cardsInCategory(category: String!): [Card]
    card(id: Int!): Card
    cards: [Card]
    session(id: String!): Session
    sessions: [Session]
    rounds: [Round]
    round(id: String): Round
  }
`;

export const resolvers = {
  Subscription: {
    sessionAdded: {
      subscribe: () => pubsub.asyncIterator([SESSION_ADDED])
    }
  },
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
    },
    async rounds(_parent, _argsd) {
      return Round.find({});
    }
  },
  Mutation: {
    async addSession(_parent, { id, name }, _context) {
      const session = await new Session({ id, name }).save();
      pubsub.publish(SESSION_ADDED, { sessionAdded: session });
      return session;
    }
  }
};
