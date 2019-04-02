/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import Session from '../src/models/Session';
import { typeDef, resolvers } from '../src/graphql/schema';

describe('graphql Sessions', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [typeDef],
    context: () => ({}),
    resolvers
  });

  const sessions = [
    { id: '1', name: 'session 1' },
    { id: '2', name: 'session 2' }
  ];

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  });

  beforeEach(() => Session.insertMany(sessions));

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
