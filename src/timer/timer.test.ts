import { jest } from '@jest/globals';
import { Timer } from './timer.js';

describe('timer', () => {
  let timer: Timer;

  beforeAll(() => {
    jest.spyOn(global, 'setTimeout');
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 3, 27, 10, 10, 10, 10));
    timer = new Timer();
  });

  describe('ms', () => {
    it('should return difference between starting time and "now" time in milliseconds', () => {
      jest.setSystemTime(new Date(2023, 3, 27, 11, 11, 11, 11));
      expect(timer.ms()).toBe(3661001);
    });
  });

  describe('s', () => {
    it('should return difference between starting time and "now" time in seconds', () => {
      jest.setSystemTime(new Date(2023, 3, 27, 11, 11, 11, 11));
      expect(timer.s()).toBe(3661.001);
    });
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
