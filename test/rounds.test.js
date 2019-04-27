/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import { typeDef, resolvers } from '../src/graphql/schema';
import Round from '../src/models/Round';
import Session from '../src/models/Session';

const { ObjectId } = mongoose.Types;

describe('graphql Rounds', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [typeDef],
    context: () => ({}),
    resolvers
  });

  const ids = [
    '5cbe90460408ff48b836e134',
    '5cbe90d0d5fa061470c311aa',
    '5cc3cca98013871074660a87',
    '5cc3cdc48013871074660a89'
  ];

  const sessions = [
    { _id: ObjectId(ids[0]), name: 'session 1', type: 'classic' }
  ];

  const rounds = [
    {
      _id: ObjectId(ids[1]),
      type: 'classic',
      players: ['Player 1', 'Player 2', 'Player 3'],
      winner: 'Player 2',
      session: ObjectId(ids[0])
    },
    {
      _id: ObjectId(ids[2]),
      type: 'g54',
      players: ['Player 1', 'Player 2', 'Player 3'],
      winner: 'Player 1',
      session: ObjectId(ids[0])
    }
  ];

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  });

  beforeEach(async () => {
    await Round.insertMany(rounds);
    await Session.insertMany(sessions);
  });

  afterEach(async (done) => {
    await Round.deleteMany({});
    await Session.deleteMany({});
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
    expect(res.data.rounds[0].winner).toEqual(rounds[0].winner);
    expect(res.data.rounds[0].type).toEqual(rounds[0].type);
    expect(res.data.rounds[0].players).toEqual(rounds[0].players);
    expect(res.data.rounds[1].winner).toEqual(rounds[1].winner);
    expect(res.data.rounds[1].type).toEqual(rounds[1].type);
    expect(res.data.rounds[1].players).toEqual(rounds[1].players);
  });

  it('should return rounds with only requested attributes', async () => {
    const query = `{ rounds { winner } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.rounds.length).toEqual(2);
    expect(res.data.rounds[0]).toEqual({ winner: rounds[0].winner });
    expect(res.data.rounds[1]).toEqual({ winner: rounds[1].winner });
  });

  it('should retrive round by id', async () => {
    const query = `{ round(id: "${ids[1]}") { winner type players } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.round.winner).toEqual(rounds[0].winner);
    expect(res.data.round.type).toEqual(rounds[0].type);
    expect(res.data.round.players).toEqual(rounds[0].players);
  });

  describe('Session relationship', () => {
    it('should retrive round by id', async () => {
      const query = `{
        round(id: "${ids[1]}") { winner session { id name } }
      }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.round.winner).toEqual(rounds[0].winner);
      expect(res.data.round.session.id).toEqual(ids[0]);
      expect(res.data.round.session.name).toEqual(sessions[0].name);
    });

    it('should include Session information', async () => {
      const query = `{ rounds { winner session { id name } } }`;
      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.rounds.length).toEqual(2);
      expect(res.data.rounds[0].winner).toEqual(rounds[0].winner);
      expect(res.data.rounds[0].session.id).toEqual(ids[0]);
      expect(res.data.rounds[1].winner).toEqual(rounds[1].winner);
      expect(res.data.rounds[1].session.id).toEqual(ids[0]);
    });
  });
});
