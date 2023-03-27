import { jest } from '@jest/globals';
import { TimeoutTask } from './timeout.js';

const TIMEOUT = 1337;

describe('TimeoutTask', () => {
  describe('timeout', () => {
    let timeoutTask: TimeoutTask<jest.Mock>;

    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['performance'] });
      jest.spyOn(global, 'setTimeout');
      timeoutTask = new TimeoutTask(() => new Promise(() => null), TIMEOUT, 'test');
    });

    it('should timeout', async () => {
      await expect(async () => {
        const promise = timeoutTask.exec();
        jest.runOnlyPendingTimers();
        await promise;
      }).rejects.toThrow(`Timeout running test after ${TIMEOUT}ms.`);
      const time = timeoutTask.getTime();
      expect(time).toBe(0);
    });
  });

  describe('runs', () => {
    let fn: jest.Mock;
    let timeoutTask: TimeoutTask<string>;

    beforeEach(() => {
      fn = jest.fn();
      jest.useFakeTimers({ doNotFake: ['performance'] });
      jest.spyOn(global, 'setTimeout');
      jest.setSystemTime(new Date(2023, 3, 27, 10));
      timeoutTask = new TimeoutTask(
        () => {
          return new Promise(resolve => {
            fn();
            resolve('runs');
          });
        },
        TIMEOUT,
        'test',
      );
    });

    it('should run function, update totalTime', async () => {
      const promise = timeoutTask.exec();
      jest.setSystemTime(new Date(2023, 3, 27, 11));
      expect(await promise).toBe('runs');
      expect(timeoutTask.getTime()).toBe(3600000);
      expect(fn).toHaveBeenCalled();
    });
  });
});
