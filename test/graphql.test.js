/* eslint-disable quotes */
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import {
  typeDef as Card,
  resolvers as cardResolvers
} from '../src/graphql/schemas/card';

describe('graphql', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [Card],
    context: () => ({}),
    resolvers: cardResolvers
  });

  describe("query 'cards'", () => {
    it('should return all cards', async () => {
      const query = `{ cards { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.cards.length).toEqual(25);
    });

    it('should return correct cards', async () => {
      const query = `{ cards { name action category counteraction } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.cards[0]).toEqual({
        name: 'Director',
        action:
          'Active player takes 2 random cards from the deck. They may secretly change any cards with their own, and then return 2 cards to the deck.',
        category: 'communications',
        counteraction: null
      });

      expect(res.data.cards[7]).toEqual({
        name: 'Guerrilla',
        action:
          'Active player pays ⓸  and declares Target. Target loses a life.',
        category: 'force',
        counteraction: 'Target may claim Guerrilla to avoid losing a life'
      });
    });

    it('should return only requested attributes', async () => {
      const query = `{ cards { name action } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.cards[7]).toEqual({
        name: 'Guerrilla',
        action:
          'Active player pays ⓸  and declares Target. Target loses a life.'
      });
    });
  });

  describe("query 'card'", () => {
    it('should return card by id', async () => {
      const query = `{ card(id: 12) { name action category counteraction } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.card).toEqual({
        name: 'Farmer',
        action:
          'Active player takes ⓷  from the Treasury and must then give ⓵  to another player of their choice.',
        category: 'finance',
        counteraction: null
      });
    });

    it('should return only requested attributes', async () => {
      const query = `{ card(id: 12) { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.card).toEqual({
        name: 'Farmer'
      });
    });
  });

  describe("query 'cardsInCategory", () => {
    it("should all cards from 'communications' category", async () => {
      const query = `{ cardsInCategory(category: "communications") { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.cardsInCategory.length).toEqual(5);
    });

    it("should all cards from 'specialInterest' category", async () => {
      const query = `{ cardsInCategory(category: "specialInterest") { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.cardsInCategory.length).toEqual(10);
    });

    it('should return only requested attributes', async () => {
      const query = `{ cardsInCategory(category: "communications") { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.cardsInCategory).toEqual([
        {
          name: 'Director'
        },
        {
          name: 'Newscaster'
        },
        {
          name: 'Producer'
        },
        {
          name: 'Reporter'
        },
        {
          name: 'Writer'
        }
      ]);
    });
  });
});
