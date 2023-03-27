jest.mock('../sleep/index.js');
import { jest } from '@jest/globals';
import { backoffGenerator, retry } from './index.js';
import * as sleepModule from '../sleep/index.js';

const TEST_VALUE = 'test-value';

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
    let iteration = 0;
    const TIMEOUT = 1337;
    let generator: () => Generator<number, void, unknown>;

    function* mockGenerator() {
      while (true) {
        yield TIMEOUT;
      }
    }

    beforeEach(() => {
      generator = mockGenerator;
      jest.useFakeTimers({ doNotFake: ['performance'] });
      jest.spyOn(global, 'setTimeout');
    });

    describe('on success', () => {
      it('should return values', async () => {
        for (let i = 0; i < 5; i++) {
          const result = await retry(
            () => new Promise<string>(resolve => resolve(`${TEST_VALUE}${i}`)),
            'mock',
            generator(),
          );
          expect(result).toBe(`${TEST_VALUE}${i}`);
        }
      });
    });

    describe('on failure', () => {
      it('should return values', async () => {
        jest.spyOn(sleepModule, 'sleep').mockImplementationOnce((ms: number) => {
          expect(ms).toBe(TIMEOUT * 1000);
          return new Promise<string>(resolve => resolve('sleep-test'));
        });
        const promise = retry(
          () =>
            new Promise<string>((resolve, reject) => {
              if (iteration === 0) reject('failure');
              if (iteration === 1) resolve('success');
              iteration++;
            }),
          'mock',
          generator(),
        );
        const result = await promise;
        expect(result).toBe('success');
      });
    });
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
