import type { Schema } from 'express-validator';
import { describe, it, expectTypeOf } from 'vitest';
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
      customSanitizer: {
        customSanitizer: {
          options: () => {
            return { any: 'type' } as const;
          },
        },
      },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      array: Array<unknown>;
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
      custom: {
        custom: {
          options: (value: unknown): asserts value is string => {
            if (typeof value !== 'string') {
              throw new Error('Not a string');
            }
          },
        },
      },
      customWithMoreParameters: {
        custom: {
          options: (value: unknown, _meta): asserts value is string => {
            if (typeof value !== 'string') {
              throw new Error('Not a string');
            }
          },
        },
      },
      customWithoutAssert: {
        custom: {
          options: (value: unknown) => typeof value === 'string',
        },
      },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      string: string | string[];
      int: number | number[];
      float: number | number[];
      boolean: boolean | boolean[];
      date: Date | Date[];
      ULID: string | string[];
      alpha: string | string[];
      alphanumeric: string | string[];
      ascii: string | string[];
      base32: string | string[];
      base58: string | string[];
      base64: string | string[];
      btcAddress: string | string[];
      creditCard: string | string[];
      currency: string | string[];
      email: string | string[];
      ISO6346: string | string[];
      ISO4217: string | string[];
      ISO8601: string | string[];
      object: {};
      custom: string;
      customWithMoreParameters: string;
      customWithoutAssert: unknown;
    }>({} as any);
  });

  it('should infer the array types correctly', () => {
    const schema = {
      isArray: { isArray: true },
      toArray: { toArray: true },
      isArrayString: { isArray: true, isString: true },
      toArrayString: { toArray: true, isString: true },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      isArray: Array<unknown>;
      toArray: Array<unknown>;
      isArrayString: Array<string>;
      toArrayString: Array<string>;
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
      onlyDefault: {
        default: { options: 1 as const },
      },
      defaultWithOptional: {
        optional: true,
        default: { options: 1 as const },
      },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      optionalTrue: number | undefined;
      optionalValueUndefined: number | undefined;
      optionalValueUndefinedString: number | undefined;
      optionalValueNull: number | null | undefined;
      optionalValueFalsy: number | '' | 0 | false | null | undefined;
      optionalNullable: number | null | undefined;
      optionalCheckFalsy: number | '' | 0 | false | null | undefined;
      optionalEmptyObject: number | undefined;
      optionalEmptyOptions: number | undefined;
      onlyDefault: 1;
      defaultWithOptional: 1;
    }>({} as any);
  });

  it('should infer isIn types correctly', () => {
    const schema = {
      isIn: { isIn: { options: [['a', 'b', 'c'] as const] } },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      isIn: 'a' | 'b' | 'c';
    }>({} as any);
  });

  it('should infer object shape correctly', () => {
    const schema = {
      'user.name.first': {
        isString: true,
        trim: true,
      },
      'user.name.middle': {
        isString: true,
        trim: true,
        optional: true,
      },
      'user.name.last': {
        isString: true,
        trim: true,
      },
      'user.name.nicknames': {
        isArray: true,
        isString: true,
        optional: true,
      },

      'split.names.*.first': {
        isString: true,
        trim: true,
      },
      'split.names.*.middle': {
        isString: true,
        optional: true,
        trim: true,
      },
      'split.names.*.last': {
        isString: true,
        trim: true,
      },
      'split.names.*.nicknames': {
        isArray: true,
        isString: true,
        optional: true,
      },
    } satisfies Schema;

    expectTypeOf({} as Infer<typeof schema>).toEqualTypeOf<{
      user: {
        name: {
          first: string;
          middle: string | undefined;
          last: string;
          nicknames: string[] | undefined;
        };
      };

      split: {
        names: {
          first: string;
          middle: string | undefined;
          last: string;
          nicknames: string[] | undefined;
        }[];
      };
    }>({} as any);
  });
});
