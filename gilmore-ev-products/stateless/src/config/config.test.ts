const OLD_ENV = process.env;

describe('config', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('tableName', () => {
    it('should return the value from environment variable', () => {
      process.env.TABLE_NAME = 'table-dev';
      const { config } = require('./config');

      expect(config.get('tableName')).toEqual('table-dev');
    });
  });
});
