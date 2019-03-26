/* eslint-disable arrow-parens */
import { print } from 'graphql';

export default server => {
  const executeOperation = server.executeOperation.bind(server);
  const test = ({ query, mutation, ...args }) => {
    const operation = query || mutation;

    if ((!query && !mutation) || (query && mutation)) {
      throw new Error(
        'Either `query` or `mutation` must be passed, but not both.'
      );
    }

    return executeOperation({
      query: typeof operation === 'string' ? operation : print(operation),
      ...args
    });
  };

  return { query: test, mutate: test };
};
