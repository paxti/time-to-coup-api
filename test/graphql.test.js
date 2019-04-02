/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import Session from '../src/models/Session';
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

  describe("query 'randomDeck'", () => {
    it('should return array of size 5', async () => {
      const query = `{ randomDeck { name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.randomDeck.length).toEqual(5);
    });

    it('should return array of Cards', async () => {
      const query = `{ randomDeck { name action category } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });
      expect(res.data.randomDeck[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          action: expect.any(String),
          category: expect.any(String)
        })
      );
    });
  });

  describe('Sessions', () => {
    const sessions = [
      { id: '1', name: 'session 1' },
      { id: '2', name: 'session 2' }
    ];

    beforeAll(() => {
      mongoose.connect('mongodb://localhost:27017/test', {
        useCreateIndex: true,
        useNewUrlParser: true
      });
    });

    beforeEach(() => {
      return Session.insertMany(sessions);
    });

    afterEach(async (done) => {
      await Session.deleteMany({});
      done();
    });

    afterAll(async (done) => {
      await mongoose.connection.close();
      done();
    });

    it('should return all sessions', async () => {
      const query = `{ sessions { id name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.sessions.length).toEqual(2);
      expect(res.data.sessions[0]).toEqual(sessions[0]);
      expect(res.data.sessions[1]).toEqual(sessions[1]);
    });

    it('should retrive session by id', async () => {
      const query = `{ session(id: "1") { id name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.session.id).toEqual(sessions[0].id);
      expect(res.data.session.name).toEqual(sessions[0].name);
    });
  });
});
