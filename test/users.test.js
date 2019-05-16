/* eslint-disable quotes */
import mongoose from 'mongoose';
import {} from 'dotenv/config';
import { ApolloServerBase } from 'apollo-server-core';
import createTestClient from './grapqlTestClient';
import User from '../src/models/User';
import { typeDef, resolvers } from '../src/graphql/schema';
import { users } from './seed';

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
    await User.collection.insertMany(users);
  });

  afterEach(async (done) => {
    await User.deleteMany({});
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should return all users', async () => {
    const query = `{ users { id name deviceId } }`;
    const client = createTestClient(myTestServer);
    const res = await client.query({ query });

    expect(res.data.users.length).toEqual(2);
    expect(res.data.users[0].name).toEqual(users[0].name);
    expect(res.data.users[1].name).toEqual(users[1].name);
    expect(res.data.users[0].deviceId).toEqual(users[0].deviceId);
    expect(res.data.users[1].deviceId).toEqual(users[1].deviceId);
  });

});
