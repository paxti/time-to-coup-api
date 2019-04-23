/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import { typeDef, resolvers } from '../src/graphql/schema';
import Round from '../src/models/Round';

describe('graphql Rounds', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [typeDef],
    context: () => ({}),
    resolvers
  });

  const rounds = [
    {
      type: 'classic',
      players: ['Player 1', 'Player 2', 'Player 3'],
      winner: 'Player 2'
    },
    {
      type: 'g54',
      players: ['Player 1', 'Player 2', 'Player 3'],
      winner: 'Player 1'
    }
  ];

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  });

  beforeEach(() => Round.insertMany(rounds));

  afterEach(async (done) => {
    await Round.deleteMany({});
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should return all rounds', async () => {
    const query = `{ rounds { winner type players } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.rounds.length).toEqual(2);
    expect(res.data.rounds[0]).toEqual(rounds[0]);
    expect(res.data.rounds[1]).toEqual(rounds[1]);
  });

  it('should return rounds with only requested attributes', async () => {
    const query = `{ rounds { winner } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.rounds.length).toEqual(2);
    expect(res.data.rounds[0]).toEqual({ winner: rounds[0].winner });
    expect(res.data.rounds[1]).toEqual({ winner: rounds[1].winner });
  });
});
