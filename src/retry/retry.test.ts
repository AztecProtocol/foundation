jest.mock('../sleep/index.js');
import { jest } from '@jest/globals';
import { backoffGenerator, retry } from './index.js';
import * as sleepmodule from '../sleep/index.js';

console.log(sleepmodule);

const TEST_VALUE = 'test-value-';

describe('backoffGenerator', () => {
  let values: number[];
  let generator: Generator<number, void, unknown>;

  beforeEach(() => {
    values = [1, 1, 1, 2, 4, 8, 16, 32, 64, 64, 64, 64];
    generator = backoffGenerator();
  });

  it('should return all values of the array, and repeat the last one', () => {
    values.forEach(value => {
      expect(generator.next().value).toBe(value);
    });
  });
});

describe('retry', () => {
  describe('values', () => {
    let generator: () => Generator<number, void, unknown>;

    function* mockGenerator() {
      while (true) {
        yield 1;
      }
    }

    beforeEach(() => {
      generator = mockGenerator;
      jest.useFakeTimers();
      jest.spyOn(global, 'setTimeout');
      // jest.spyOn(sleepmodule, 'sleep').mockImplementation((ms: number) => {
      //   console.log('asdf');
      //   return new Promise<void>(() => {});
      // });
    });

    xit('should return values', async () => {
      for (let i = 0; i < 5; i++) {
        const result = await retry(
          async () => new Promise<string>(resolve => resolve(`${TEST_VALUE}${i}`)),
          'mock',
          generator(),
        );
        expect(result).toBe(`${TEST_VALUE}${i}`);
      }
    });

    it('should return values', async () => {
      const promise = retry(
        async () => new Promise<string>((_, reject) => reject(`${TEST_VALUE}`)),
        'mock',
        generator(),
      );

      jest.runAllTimers();
      await promise;

      // const result = await promise;
      // expect(result).toBe(`${TEST_VALUE}`);
    });

    // TODO: test failures (needs jest.spyOn sleep)
  });
});
