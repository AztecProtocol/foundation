import { jest } from '@jest/globals';
import { MemoryFifo } from './memory_fifo.js';

const TEST_ARRAY = [1, 2, 3, 4, 5];
const GET_TIMEOUT = 1337;
const VALUE_TO_ADD = 6;

describe('MemoryFifo', () => {
  let memoryFifo: MemoryFifo<number>;

  beforeAll(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] });
    jest.spyOn(global, 'setTimeout');
  });

  beforeEach(() => {
    memoryFifo = new MemoryFifo<number>();
  });

  function fillFifo() {
    TEST_ARRAY.forEach(e => memoryFifo.put(e));
  }

  async function flushFifo(numberOfValuesToGet: number) {
    const exitPromises: Promise<number | null>[] = [];
    for (let i = 0; i < numberOfValuesToGet; i++) {
      exitPromises.push(memoryFifo.get(1337));
    }
    return await Promise.all(exitPromises);
  }

  describe('put', () => {
    describe('fills fifo', () => {
      beforeEach(() => {
        fillFifo();
      });

      it('should fill fifo', async () => {
        expect(memoryFifo.length()).toEqual(TEST_ARRAY.length);
      });
    });

    describe('fills fifo after ending', () => {
      beforeEach(() => {
        memoryFifo.end();
        fillFifo();
      });

      it('should keep fifo empty', async () => {
        expect(memoryFifo.length()).toEqual(0);
      });
    });

    describe('fills fifo after cancelling', () => {
      beforeEach(() => {
        memoryFifo.cancel();
        fillFifo();
      });

      it('should keep fifo empty', async () => {
        expect(memoryFifo.length()).toEqual(0);
      });
    });
  });

  describe('get', () => {
    describe('fills fifo and gets all values', () => {
      beforeEach(() => {
        fillFifo();
      });

      it('should get values in order', async () => {
        const exitArray = await flushFifo(TEST_ARRAY.length);
        expect(exitArray).toEqual(TEST_ARRAY);
      });
    });

    describe('fills fifo and tries getting more values than the ones stored', () => {
      beforeEach(() => {
        fillFifo();
      });

      it('should get values in order', async () => {
        const flushPromise = flushFifo(TEST_ARRAY.length + 1);
        jest.runOnlyPendingTimers();
        flushPromise.catch(e => expect(e).toEqual(new Error('Timeout getting item from queue.')));
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), GET_TIMEOUT * 1000);
      });
    });
  });

  describe('end', () => {
    describe('adds a value after ending', () => {
      let exitArray: (number | null)[];

      beforeEach(async () => {
        fillFifo();
        memoryFifo.end();
        memoryFifo.put(VALUE_TO_ADD);
        exitArray = await flushFifo(TEST_ARRAY.length + 1);
      });

      it('should return null for the sixth value', () => {
        expect(exitArray).toEqual([...TEST_ARRAY, null]);
      });
    });
  });

  describe('cancel', () => {
    describe('adds a value after cancelling', () => {
      let exitArray: (number | null)[];

      beforeEach(async () => {
        fillFifo();
        memoryFifo.cancel();
        memoryFifo.put(VALUE_TO_ADD);
        exitArray = await flushFifo(TEST_ARRAY.length + 1);
      });

      it('should return null for all the values', () => {
        expect(exitArray).toEqual([...TEST_ARRAY.map(_ => null), null]);
      });
    });
  });

  describe('integration', () => {
    let values: (number | null)[];

    beforeEach(async () => {
      fillFifo();
      await flushFifo(1);
      memoryFifo.put(VALUE_TO_ADD);
      memoryFifo.end();
      values = await flushFifo(TEST_ARRAY.length);
    });

    it('should store values, remove values, store values, end', () => {
      const validationArray = [...TEST_ARRAY];
      validationArray.shift();
      expect(values).toEqual([...validationArray, 6]);
    });
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});