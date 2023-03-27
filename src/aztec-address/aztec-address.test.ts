import { AztecAddress } from './index.js';

const AZTEC_ADDRESS_STRING = '0x1043ae64cc5c6a626d7afce9358cde97c96cf58a918b67ce3c143e8958fef321';
const AZTEC_ADDRESS_SHORT_STRING = '0x1043ae64...f321';
const AZTEC_ADDRESS_BUFFER_ARRAY = [
  16, 67, 174, 100, 204, 92, 106, 98, 109, 122, 252, 233, 53, 140, 222, 151, 201, 108, 245, 138, 145, 139, 103, 206, 60,
  20, 62, 137, 88, 254, 243, 33,
];
const AZTEC_ADDRESS_BUFFER = Buffer.from(AZTEC_ADDRESS_BUFFER_ARRAY);

describe('aztec-address', () => {
  let aztecAddress: AztecAddress;

  beforeEach(() => {
    aztecAddress = new AztecAddress(AZTEC_ADDRESS_BUFFER);
  });

  describe('toBuffer', () => {
    it('should return correct buffer', () => {
      expect(aztecAddress.toBuffer()).toEqual(AZTEC_ADDRESS_BUFFER);
    });
  });

  describe('toString', () => {
    it('should return correct string', () => {
      expect(aztecAddress.toString()).toEqual(AZTEC_ADDRESS_STRING);
    });
  });

  describe('toShortString', () => {
    it('should return correct short string', () => {
      expect(aztecAddress.toShortString()).toEqual(AZTEC_ADDRESS_SHORT_STRING);
    });
  });

  describe('equals', () => {
    describe('same address', () => {
      it('should match to same address', () => {
        const aztecAddressClone = new AztecAddress(AZTEC_ADDRESS_BUFFER);
        expect(aztecAddress.equals(aztecAddressClone)).toBe(true);
      });
    });

    describe('different address', () => {
      it('should match to different address', () => {
        const AZTEC_ADDRESS_BUFFER_2 = new AztecAddress(Buffer.from(AZTEC_ADDRESS_BUFFER_ARRAY.reverse()));
        expect(aztecAddress.equals(AZTEC_ADDRESS_BUFFER_2)).toBe(false);
      });
    });
  });

  describe('random', () => {
    it('should generate two new, random AztecAddress', () => {
      const address1 = AztecAddress.random();
      const address2 = AztecAddress.random();
      expect(address1.equals(address2)).toBe(false);
    });
  });
});
