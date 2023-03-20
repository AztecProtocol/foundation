import { toBigIntLE, toBufferBE, toBufferLE } from './index.js';

const TEST_HEX = 0x0102030405060708n;
const LE_CONVERSION = 72623859790382856n;
const BE_CONVERSION = 578437695752307201n;

describe('toBigIntLE', () => {
  describe('empty hex', () => {
    it('should return 0', async () => {
      const buffer = Buffer.allocUnsafe(0);
      expect(toBigIntLE(buffer)).toBe(0n);
    });
  });

  describe('valid hex', () => {
    it('should convert a little-endian buffer into a BigInt', async () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeBigInt64LE(TEST_HEX, 0);
      expect(toBigIntLE(buffer)).toBe(LE_CONVERSION);
    });
  });
});

describe('toBigIntBE', () => {
  describe('empty hex', () => {
    it('should return 0', async () => {
      const buffer = Buffer.allocUnsafe(0);
      expect(toBigIntLE(buffer)).toBe(0n);
    });
  });

  describe('valid hex', () => {
    it('should convert a big-endian buffer into a BigInt', async () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeBigInt64BE(TEST_HEX, 0);
      expect(toBigIntLE(buffer)).toBe(BE_CONVERSION);
    });
  });
});

describe('toBufferLE', () => {
  it('should convert a BigInt into a little-endian buffer', async () => {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64LE(TEST_HEX, 0);
    expect(toBufferLE(LE_CONVERSION, 8)).toEqual(buffer);
  });
});

describe('toBufferBE', () => {
  it('should convert a BigInt into a little-endian buffer', async () => {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64BE(TEST_HEX, 0);
    expect(toBufferBE(LE_CONVERSION, 8)).toEqual(buffer);
  });
});
