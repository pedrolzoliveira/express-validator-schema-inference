import { describe, it, expectTypeOf } from 'vitest';
import type { Schema } from 'express-validator';
import type { Infer } from '../src/infer';

describe('Infer', () => {
  it('should infer the sanitizer types correctly', () => {
    const schema = {
      array: { toArray: true },
      int: { toInt: true },
      float: { toFloat: true },
      boolean: { toBoolean: true },
      date: { toDate: true },
      ltrim: { ltrim: true },
      rtrim: { rtrim: true },
      trim: { trim: true },
      lowerCase: { toLowerCase: true },
      upperCase: { toUpperCase: true },
      escape: { escape: true },
      unescape: { unescape: true },
      blacklist: { blacklist: true },
      whitelist: { whitelist: true },
      normalizeEmail: { normalizeEmail: true },
      stripLow: { stripLow: true },
      customSanitizer: {
        customSanitizer: {
          options: () => {
            return { any: 'type' } as const;
          },
        },
      },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      array: unknown[];
      int: number;
      float: number;
      boolean: boolean;
      date: Date;
      ltrim: string;
      rtrim: string;
      trim: string;
      lowerCase: string;
      upperCase: string;
      escape: string;
      unescape: string;
      blacklist: string;
      whitelist: string;
      normalizeEmail: string;
      stripLow: string;
      customSanitizer: { any: 'type' };
    }>({} as any);
  });

  it('should infer the validator types correctly', () => {
    const schema = {
      string: { isString: true },
      int: { isInt: true },
      float: { isFloat: true },
      boolean: { isBoolean: true },
      date: { isDate: true },
      ULID: { isULID: true },
      alpha: { isAlpha: true },
      alphanumeric: { isAlphanumeric: true },
      ascii: { isAscii: true },
      base32: { isBase32: true },
      base58: { isBase58: true },
      base64: { isBase64: true },
      btcAddress: { isBtcAddress: true },
      creditCard: { isCreditCard: true },
      currency: { isCurrency: true },
      email: { isEmail: true },
      ISO6346: { isISO6346: true },
      ISO4217: { isISO4217: true },
      ISO8601: { isISO8601: true },
      object: { isObject: true },
      customAssertsSingleArg: {
        custom: {
          options: (value: unknown): asserts value is string => {
            if (typeof value !== 'string') {
              throw new TypeError();
            }
          },
        },
      },
      customAssertsMultiArg: {
        custom: {
          options: (value: unknown, _meta): asserts value is string => {
            if (typeof value !== 'string') {
              throw new TypeError();
            }
          },
        },
      },
      customPredicateSingleArg: {
        custom: {
          options: (value: unknown): value is string =>
            typeof value === 'string',
        },
      },
      customPredicateMultiArg: {
        custom: {
          options: (value: unknown, _meta): value is string =>
            typeof value === 'string',
        },
      },
      customNoInference: {
        custom: {
          options: () => {},
        },
      },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      string: string;
      int: number;
      float: number;
      boolean: boolean;
      date: Date;
      ULID: string;
      alpha: string;
      alphanumeric: string;
      ascii: string;
      base32: string;
      base58: string;
      base64: string;
      btcAddress: string;
      creditCard: string;
      currency: string;
      email: string;
      ISO6346: string;
      ISO4217: string;
      ISO8601: string;
      object: {};
      customAssertsSingleArg: string;
      customAssertsMultiArg: string;
      customPredicateSingleArg: string;
      customPredicateMultiArg: string;
      customNoInference: unknown;
    }>({} as any);
  });

  it('should infer the array types correctly', () => {
    const schema = {
      isArray: { isArray: true },
      toArray: { toArray: true },
      isArrayString: { isArray: true, isString: true },
      toArrayString: { toArray: true, isString: true },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      isArray: unknown[];
      toArray: unknown[];
      isArrayString: string[];
      toArrayString: string[];
    }>({} as any);
  });

  it('should infer the optional types correctly', () => {
    const schema = {
      optionalTrue: { toInt: true, optional: true },
      optionalValueUndefined: {
        toInt: true,
        optional: {
          options: {
            values: undefined,
          },
        },
      },
      optionalValueUndefinedString: {
        toInt: true,
        optional: {
          options: {
            values: 'undefined',
          },
        },
      },
      optionalValueNull: {
        toInt: true,
        optional: {
          options: {
            values: 'null',
          },
        },
      },
      optionalValueFalsy: {
        toInt: true,
        optional: {
          options: {
            values: 'falsy',
          },
        },
      },
      optionalNullable: {
        toInt: true,
        optional: {
          options: {
            nullable: true,
          },
        },
      },
      optionalCheckFalsy: {
        toInt: true,
        optional: {
          options: {
            checkFalsy: true,
          },
        },
      },
      optionalEmptyObject: {
        toInt: true,
        optional: {},
      },
      optionalEmptyOptions: {
        toInt: true,
        optional: {
          options: {},
        },
      },
      onlyOptional: {
        optional: true,
      },
      onlyDefault: {
        default: { options: 1 as const },
      },
      defaultWithOptional: {
        optional: true,
        default: { options: 1 as const },
      },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      optionalTrue: number | undefined;
      optionalValueUndefined: number | undefined;
      optionalValueUndefinedString: number | undefined;
      optionalValueNull: number | null | undefined;
      optionalValueFalsy: number | '' | 0 | false | null | undefined;
      optionalNullable: number | null | undefined;
      optionalCheckFalsy: number | '' | 0 | false | null | undefined;
      optionalEmptyObject: number | undefined;
      optionalEmptyOptions: number | undefined;
      onlyOptional: undefined;
      onlyDefault: 1;
      defaultWithOptional: 1;
    }>({} as any);
  });

  it('should infer isIn types correctly', () => {
    const schema = {
      isIn: { isIn: { options: [['a', 'b', 'c'] as const] } },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      isIn: 'a' | 'b' | 'c';
    }>({} as any);
  });

  it('should infer object shape correctly', () => {
    const schema = {
      'keyInferredStringArray.*': { isString: true },

      stringArrayDefined: { isArray: true },
      'stringArrayDefined.*': { isString: true },

      optionalStringArray: { optional: true },
      'optionalStringArray.*': { isString: true },

      optionalStringArrayDefined: { isArray: true, optional: true },
      'optionalStringArrayDefined.*': { isString: true },

      'keyInferredObject.a': { isString: true },
      'keyInferredObject.b': { isInt: true },

      'keyInferredArray.*.a': { isString: true },
      'keyInferredArray.*.b': { isInt: true },

      objectDefined: { isObject: true },
      'objectDefined.a': { isString: true },
      'objectDefined.b': { isInt: true },

      optionalObjectDefined: { isObject: true, optional: true },
      'optionalObjectDefined.a': { isString: true },
      'optionalObjectDefined.b': { isInt: true },

      arrayDefined: { isArray: true },
      'arrayDefined.*.a': { isString: true },
      'arrayDefined.*.b': { isInt: true },

      optionalArrayDefined: { isArray: true, optional: true },
      'optionalArrayDefined.*.a': { isString: true },
      'optionalArrayDefined.*.b': { isInt: true },

      objectArrayDefined: { isObject: true, isArray: true },
      'objectArrayDefined.*.a': { isString: true },
      'objectArrayDefined.*.b': { isInt: true },

      optionalObjectArrayDefined: {
        isObject: true,
        isArray: true,
        optional: true,
      },
      'optionalObjectArrayDefined.*.a': { isString: true },
      'optionalObjectArrayDefined.*.b': { isInt: true },

      'deep.nested.object.a': { isString: true },
      'deep.nested.object.b': { isInt: true },
      'deep.nested.object.c': { isString: true, isArray: true },
      'deep.nested.array.*.a': { isString: true },
      'deep.nested.array.*.b': { isInt: true },
      'deep.nested.array.*.c': { isString: true, isArray: true },
    } satisfies Schema;

    const inferredSchemaType = {} as Infer<typeof schema>;

    expectTypeOf(inferredSchemaType).toEqualTypeOf<{
      keyInferredStringArray: string[];
      stringArrayDefined: string[];
      optionalStringArray: string[] | undefined;
      optionalStringArrayDefined: string[] | undefined;
      keyInferredObject: { a: string; b: number };
      keyInferredArray: { a: string; b: number }[];
      objectDefined: { a: string; b: number };
      optionalObjectDefined: { a: string; b: number } | undefined;
      arrayDefined: { a: string; b: number }[];
      optionalArrayDefined: { a: string; b: number }[] | undefined;
      objectArrayDefined: { a: string; b: number }[];
      optionalObjectArrayDefined: { a: string; b: number }[] | undefined;
      deep: {
        nested: {
          object: { a: string; b: number; c: string[] };
          array: { a: string; b: number; c: string[] }[];
        };
      };
    }>({} as any);
  });
});
