import { jest } from '@jest/globals';
import { BoundedSerialQueue } from './index.js';

const TIMEOUT = 4e3;
const QUEUE_SIZE = 5;

describe('BoundedSerialQueue', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  describe('put', () => {
    let boundedSerialQueue: BoundedSerialQueue;

    beforeEach(() => {
      boundedSerialQueue = new BoundedSerialQueue(QUEUE_SIZE);
    });

    it('should add a function to the queue', async () => {
      expect(boundedSerialQueue.length()).toBe(0);
      await boundedSerialQueue.put(() => new Promise(() => jest.fn()));
      expect(boundedSerialQueue.length()).toBe(1);
    });

    describe('max out the queue', () => {
      it('should max out the queue and timeout', async () => {
        const addpromises = new Promise<boolean>(async resolve => {
          for (let i = 0; i < QUEUE_SIZE + 1; i++) {
            await boundedSerialQueue.put(() => new Promise(() => jest.fn()));
          }
          resolve(false);
        });

        const timeoutpromise = new Promise<boolean>(async resolve => {
          setTimeout(() => {
            resolve(true);
          }, TIMEOUT);
        });

        Promise.race([addpromises, timeoutpromise]).then((value: boolean) => {
          expect(value).toBe(true);
          expect(boundedSerialQueue.length()).toBe(QUEUE_SIZE);
        });
      });
    });
  });

  describe('exec', () => {
    let boundedSerialQueue: BoundedSerialQueue;

    beforeEach(() => {
      boundedSerialQueue = new BoundedSerialQueue(QUEUE_SIZE);
    });

    it('should execute a function in the queue', async () => {
      const testfn = jest.fn();
      await new Promise<unknown>(resolve => {
        boundedSerialQueue.exec(() => new Promise<void>(() => resolve(testfn())));
        boundedSerialQueue.start();
      });
      expect(boundedSerialQueue.length()).toBe(0);
      expect(testfn).toHaveBeenCalled();
    });
  });

  describe('syncPoint', () => {
    let boundedSerialQueue: BoundedSerialQueue;

    beforeEach(async () => {
      boundedSerialQueue = new BoundedSerialQueue(QUEUE_SIZE);
      await boundedSerialQueue.put(() => new Promise(() => jest.fn()));
    });

    it('should await until the queue is empty before resuming', () => {});
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
