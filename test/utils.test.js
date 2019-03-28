import generateRandom from '../src/utils';

describe('utils', () => {
  it('should return 5 numbers', () => {
    expect(generateRandom().length).toEqual(5);
  });
});
