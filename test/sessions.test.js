/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import Session from '../src/models/Session';
import { typeDef, resolvers } from '../src/graphql/schema';

const { ObjectId } = mongoose.Types;

describe('graphql Sessions', () => {
  const myTestServer = new ApolloServerBase({
    typeDefs: [typeDef],
    context: () => ({}),
    resolvers
  });

  const ids = ['5cbe90460408ff48b836e134', '5cbe90d0d5fa061470c311aa'];

  const sessions = [
    { _id: ObjectId(ids[0]), name: 'session 1' },
    { _id: ObjectId(ids[1]), name: 'session 2' }
  ];

  beforeAll(() => {
    mongoose.connect(process.env.MONGO_DB_TEST_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
  });

  beforeEach(async () => {
    await Session.collection.insertMany(sessions);
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
});
