import {
  boolToByte,
  deserializeArrayFromVector,
  deserializeBigInt,
  deserializeBool,
  deserializeBufferFromVector,
  deserializeField,
  deserializeInt32,
  deserializeUInt32,
  numToInt32BE,
  numToUInt32BE,
  numToUInt32LE,
  numToUInt8,
  serializeBigInt,
  serializeBufferArrayToVector,
  serializeBufferToVector,
  serializeDate,
} from './free_funcs.js';

const TEST_NUMBER = 1337;
const TEST_SMALL_NUMBER = 52;

describe('boolToByte', () => {
  describe('true', () => {
    it('should return a Buffer with a 1', () => {
      expect(boolToByte(true)).toEqual(Buffer.from([1]));
    });
  });
  describe('false', () => {
    it('should return a Buffer with a 0', () => {
      expect(boolToByte(false)).toEqual(Buffer.from([0]));
    });
  });
});

describe('numToUInt32LE', () => {
  describe('buffer size 4', () => {
    it('should return correct buffer', () => {
      expect(numToUInt32LE(TEST_NUMBER)).toEqual(Buffer.from([57, 5, 0, 0]));
    });
  });
  describe('buffer size 8', () => {
    expect(numToUInt32LE(TEST_NUMBER, 8)).toEqual(Buffer.from([0, 0, 0, 0, 57, 5, 0, 0]));
  });
});

describe('numToUInt32BE', () => {
  describe('buffer size 4', () => {
    it('should return correct buffer', () => {
      expect(numToUInt32BE(TEST_NUMBER)).toEqual(Buffer.from([0, 0, 5, 57]));
    });
  });
  describe('buffer size 8', () => {
    it('should return correct buffer', () => {
      expect(numToUInt32BE(TEST_NUMBER, 8)).toEqual(Buffer.from([0, 0, 0, 0, 0, 0, 5, 57]));
    });
  });
});

describe('numToInt32BE', () => {
  describe('buffer size 4', () => {
    it('should return correct buffer', () => {
      expect(numToInt32BE(TEST_NUMBER)).toEqual(Buffer.from([0, 0, 5, 57]));
    });
  });
  describe('buffer size 8', () => {
    it('should return correct buffer', () => {
      expect(numToInt32BE(TEST_NUMBER, 8)).toEqual(Buffer.from([0, 0, 0, 0, 0, 0, 5, 57]));
    });
  });
});

describe('numToUInt8', () => {
  it('should return correct buffer', () => {
    expect(numToUInt8(TEST_SMALL_NUMBER)).toEqual(Buffer.from([52]));
  });
});

describe('serializeBufferToVector', () => {
  it('should return correct buffer', () => {
    expect(serializeBufferToVector(Buffer.from([1, 2, 3]))).toEqual(Buffer.from([0, 0, 0, 3, 1, 2, 3]));
  });
});

describe('serializeBigInt', () => {
  describe('width 32', () => {
    it('should return correct buffer', () => {
      expect(serializeBigInt(123456789n)).toEqual(Buffer.from([...Array(28).map(() => 0), 7, 91, 205, 21]));
    });
  });

  describe('width 16', () => {
    it('should return correct buffer', () => {
      expect(serializeBigInt(123456789n, 16)).toEqual(Buffer.from([...Array(12).map(() => 0), 7, 91, 205, 21]));
    });
  });
});

describe('deserializeBigInt', () => {
  describe('offset 0, width 0', () => {
    it('should return correct deserialisation', () => {
      expect(deserializeBigInt(Buffer.from([1, 2, 3, 4]), 0, 0)).toEqual({ adv: 0, elem: 0n });
    });
  });

  describe('offset 1, width 16', () => {
    it('should return correct deserialisation', () => {
      expect(deserializeBigInt(Buffer.from([1, 2, 3, 4]), 1, 16)).toEqual({ adv: 16, elem: 131844n });
    });
  });

  describe('offset 2, width 32', () => {
    it('should return correct deserialisation', () => {
      expect(deserializeBigInt(Buffer.from([1, 2, 3, 4]), 2, 32)).toEqual({ adv: 32, elem: 772n });
    });
  });
});

describe('serializeDate', () => {
  it('should serialize date', () => {
    expect(serializeDate(new Date(123456789))).toEqual(Buffer.from([0, 0, 0, 0, 7, 91, 205, 21]));
  });
});

describe('deserializeBufferFromVector', () => {
  describe('without offset', () => {
    it('should return correct buffer', () => {
      expect(deserializeBufferFromVector(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toEqual({
        adv: 16909064,
        elem: Buffer.from([5, 6, 7, 8, 9, 10]),
      });
    });
  });

  describe('with offset', () => {
    it('should return correct buffer', () => {
      expect(deserializeBufferFromVector(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 2)).toEqual({
        adv: 50595082,
        elem: Buffer.from([7, 8, 9, 10]),
      });
    });
  });
});

describe('deserializeBool', () => {
  describe('without offset', () => {
    it('should return correct object', () => {
      expect(deserializeBool(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toEqual({
        adv: 1,
        elem: 1,
      });
    });
  });

  describe('with offset', () => {
    it('should return correct object', () => {
      expect(deserializeBool(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5)).toEqual({
        adv: 1,
        elem: 6,
      });
    });
  });
});

describe('deserializeUInt32', () => {
  describe('without offset', () => {
    it('should return correct object', () => {
      expect(deserializeUInt32(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toEqual({
        adv: 4,
        elem: 16909060,
      });
    });
  });

  describe('with offset', () => {
    it('should return correct object', () => {
      expect(deserializeUInt32(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5)).toEqual({
        adv: 4,
        elem: 101124105,
      });
    });
  });
});

describe('deserializeInt32', () => {
  describe('without offset', () => {
    it('should return correct object', () => {
      expect(deserializeInt32(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toEqual({
        adv: 4,
        elem: 16909060,
      });
    });
  });

  describe('with offset', () => {
    it('should return correct object', () => {
      expect(deserializeInt32(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5)).toEqual({
        adv: 4,
        elem: 101124105,
      });
    });
  });
});

describe('deserializeField', () => {
  describe('without offset', () => {
    it('should return correct object', () => {
      expect(deserializeField(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))).toEqual({
        adv: 32,
        elem: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      });
    });
  });

  describe('with offset', () => {
    it('should return correct object', () => {
      expect(deserializeField(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5)).toEqual({
        adv: 32,
        elem: Buffer.from([6, 7, 8, 9, 10]),
      });
    });
  });
});

describe('serializeBufferArrayToVector', () => {
  it('should return correct buffer', () => {
    expect(serializeBufferArrayToVector([Buffer.from([1, 2, 3, 4, 5]), Buffer.from([6, 7, 8, 9, 10])])).toEqual(
      Buffer.from([0, 0, 0, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    );
  });
});

describe('deserializeArrayFromVector', () => {
  it('should return correct element', () => {
    expect(deserializeArrayFromVector(deserializeInt32, Buffer.from([0, 0, 0, 0, 1, 0, 0]), 0)).toEqual({
      adv: 4,
      elem: [],
    });
  });
});
