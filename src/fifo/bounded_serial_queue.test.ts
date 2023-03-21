import { jest } from '@jest/globals';
import { BoundedSerialQueue } from './index.js';

const TIMEOUT = 500;
const QUEUE_SIZE = 5;

describe('BoundedSerialQueue', () => {
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
        let timeoutRef: NodeJS.Timeout;

        const addpromises = new Promise<boolean>(async resolve => {
          for (let i = 0; i < QUEUE_SIZE + 1; i++) {
            await boundedSerialQueue.put(() => new Promise(() => jest.fn()));
          }
          resolve(false);
        });

        const timeoutpromise = new Promise<boolean>(async resolve => {
          timeoutRef = setTimeout(() => {
            resolve(true);
          }, TIMEOUT);
        });

        await new Promise<void>(resolve => {
          Promise.race([addpromises, timeoutpromise]).then((value: boolean) => {
            expect(value).toBe(true);
            expect(boundedSerialQueue.length()).toBe(QUEUE_SIZE);
            clearTimeout(timeoutRef);
            resolve();
          });
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
    });

    it('should await until the queue is empty before resuming', async () => {
      const testfn = jest.fn();
      let timeoutRef: NodeJS.Timeout;

      const syncpointPromise = new Promise(async resolve => {
        await boundedSerialQueue.syncPoint();
        resolve(true);
      });

      const timeoutPromise = new Promise<boolean>(async resolve => {
        timeoutRef = setTimeout(() => {
          resolve(false);
        }, TIMEOUT);
      });

      boundedSerialQueue.exec(() => new Promise<void>(() => testfn()));
      boundedSerialQueue.start();

      await new Promise<void>(resolve => {
        Promise.race([syncpointPromise, timeoutPromise]).then(result => {
          expect(result).toBe(true);
          clearTimeout(timeoutRef);
          resolve();
        });
      });
    });
  });
});
