import { getISOString } from './date-utils';

describe('date-utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 1, 1));
  });

  describe('getISOString', () => {
    it('should return the correct string value', () => {
      expect(getISOString()).toMatchInlineSnapshot(
        `"2024-02-01T00:00:00.000Z"`
      );
    });
  });
});
