import { jest } from '@jest/globals';
import { InterruptableSleep, sleep } from './index.js';

const TIMEOUT = 1337;

describe('InterruptableSleep', () => {
  let interruptableSleep: InterruptableSleep;

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] });
    jest.spyOn(global, 'setTimeout');
    interruptableSleep = new InterruptableSleep();
  });

  describe('interrupted', () => {
    it('should call setTimeout and an interrupt sleep', async () => {
      await expect(async () => {
        const promise = interruptableSleep.sleep(TIMEOUT);
        interruptableSleep.interrupt(true);
        await promise;
      }).rejects.toThrow('Interrupted');
    });
  });

  describe('not interrupted', () => {
    it('should call setTimeout and an interrupt sleep', () => {
      interruptableSleep = new InterruptableSleep();
      interruptableSleep.sleep(TIMEOUT);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1337);
      interruptableSleep.sleep(TIMEOUT * 2);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), TIMEOUT * 2);
    });
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['performance'] });
    jest.spyOn(global, 'setTimeout');
  });

  it('should call setTimeout with correct time', async () => {
    sleep(TIMEOUT);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), TIMEOUT);
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
