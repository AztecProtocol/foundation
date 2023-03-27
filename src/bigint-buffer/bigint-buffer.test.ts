import { toBigIntBE, toBigIntLE, toBufferBE, toBufferLE } from './index.js';

const TEST_HEX = 0x0102030405060708n;
const CONVERSION = 72623859790382856n;

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
      expect(toBigIntLE(buffer)).toBe(CONVERSION);
    });
  });
});

describe('toBigIntBE', () => {
  describe('empty hex', () => {
    it('should return 0', async () => {
      const buffer = Buffer.allocUnsafe(0);
      expect(toBigIntBE(buffer)).toBe(0n);
    });
  });

  describe('valid hex', () => {
    it('should convert a big-endian buffer into a BigInt', async () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeBigInt64BE(TEST_HEX, 0);
      expect(toBigIntBE(buffer)).toBe(CONVERSION);
    });
  });
});

describe('toBufferLE', () => {
  it('should convert a BigInt into a little-endian buffer', async () => {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64LE(TEST_HEX, 0);
    expect(toBufferLE(CONVERSION, 8)).toEqual(buffer);
  });
});

describe('toBufferBE', () => {
  it('should convert a BigInt into a little-endian buffer', async () => {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeBigInt64BE(TEST_HEX, 0);
    expect(toBufferBE(CONVERSION, 8)).toEqual(buffer);
  });
});
