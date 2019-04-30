/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import Session from '../src/models/Session';
import Round from '../src/models/Round';
import { typeDef, resolvers } from '../src/graphql/schema';
import { ids, rounds, sessions } from './seed';

describe('graphql Sessions', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [typeDef],
    context: () => ({}),
    resolvers
  });

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  });

  beforeEach(async () => {
    await Round.collection.insertMany(rounds);
    await Session.collection.insertMany(sessions);
  });

  afterEach(async (done) => {
    await Session.deleteMany({});
    await Round.deleteMany({});
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
    expect(res.data.sessions[0].name).toEqual(sessions[0].name);
    expect(res.data.sessions[1].name).toEqual(sessions[1].name);
  });

  it('should retrive session by id', async () => {
    const query = `{ session(id: "${ids[0]}") { id name } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.session.id).toEqual(ids[0]);
    expect(res.data.session.name).toEqual(sessions[0].name);
  });

  describe('Session mutation', () => {
    const variables = { name: 'wow' };

    it('should return new object after mutation', async () => {
      const mutation = `mutation addSession($name: String) { addSession (name: $name) { id name } }`;
      const client = createTestClient(myTestServer);
      const res = await client.mutate({
        mutation,
        variables
      });
      expect(res.data.addSession.name).toEqual(variables.name);
    });

    it('should create new session record in DB after mutation', async () => {
      expect((await Session.find({})).length).toEqual(2);
      const mutation = `mutation addSession($name: String) { addSession (name: $name) { id name } }`;
      const client = createTestClient(myTestServer);
      await client.mutate({ mutation, variables });
      const sessionRecords = await Session.findOne(
        { name: variables.name },
        'id name'
      );
      expect(sessionRecords.name).toEqual(variables.name);
      expect((await Session.find({})).length).toEqual(3);
    });
  });

  describe('Round relationship', () => {
    it('should return Round as a part of Session', async () => {
      const query = `
        { session(id: "${ids[0]}") { id name rounds { winner } } }
      `;

      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.session.id).toEqual(ids[0]);
      expect(res.data.session.name).toEqual(sessions[0].name);
      expect(res.data.session.rounds.length).toEqual(1);
      expect(res.data.session.rounds[0].winner).toEqual('Player 2');
    });

    it('should return Round as a part of every Session', async () => {
      const query = `{ sessions { id name rounds { winner type } } }`;

      const client = createTestClient(myTestServer);
      const res = await client.query({ query });

      expect(res.data.sessions.length).toEqual(2);

      const sessionOne = res.data.sessions.find((s) => s.id === ids[0]);
      const sessionTwo = res.data.sessions.find((s) => s.id === ids[1]);

      expect(sessionOne.rounds[0].winner).toEqual('Player 2');
      expect(sessionTwo.rounds[0].winner).toEqual('Player 1');
    });
  });
});
