import type { Schema, ParamSchema } from 'express-validator';
import type {
  ExtractArrayType,
  TypeOrUnknown,
  HasKey,
  Prettify,
  UnionToIntersection,
  Prettify,
  Prettify2,
} from './utils';

/**
 * @todo Add missing Sanitizers `blacklist`, `whitelist`, `normalizeEmail`
 */
type SanitizersMap = {
  toBoolean: boolean;
  toDate: Date;
  toFloat: number;
  toInt: number;
  ltrim: string;
  rtrim: string;
  trim: string;
  toLowerCase: string;
  toUpperCase: string;
  escape: string;
  unescape: string;
};

type InferSanitizer<TParam extends ParamSchema> = {
  [K in keyof TParam]: K extends keyof SanitizersMap ? SanitizersMap[K] : never;
}[keyof TParam];

/**
 * @todo Add missing validators, take a look at `node_modules/express-validator/lib/chain/validators.d.ts`
 */
type ValidatorsMap = {
  isBoolean: boolean | boolean[];
  isDate: Date | Date[];
  isFloat: number | number[];
  isInt: number | number[];
  isString: string | string[];
  isULID: string | string[];
  isAlpha: string | string[];
  isAlphanumeric: string | string[];
  isAscii: string | string[];
  isBase32: string | string[];
  isBase58: string | string[];
  isBase64: string | string[];
  isBtcAddress: string | string[];
  isCreditCard: string | string[];
  isCurrency: string | string[];
  isEmail: string | string[];
  isISO6346: string | string[];
  isISO4217: string | string[];
  isISO8601: string | string[];
  isObject: {};
};

type InferValidator<TParam extends ParamSchema> = {
  [K in keyof TParam]: K extends keyof ValidatorsMap ? ValidatorsMap[K] : never;
}[keyof TParam];

type ArrayKeys = 'isArray' | 'toArray';

type InferArray<TParam extends ParamSchema> = Array<
  TypeOrUnknown<ExtractArrayType<InferParam<Omit<TParam, ArrayKeys>>>>
>;

type DefaultOrOptionalKeys = 'optional' | 'default';

type OptionalValueMap = {
  undefined: undefined;
  null: null | undefined;
  falsy: '' | 0 | false | null | undefined;
};

type InferDefaultOrOptionalValue<TParam extends ParamSchema> =
  TParam['default'] extends { options: infer D }
    ? D
    : TParam['optional'] extends true
    ? undefined
    : TParam['optional'] extends { options: { nullable: true } }
    ? null | undefined
    : TParam['optional'] extends { options: { checkFalsy: true } }
    ? '' | 0 | false | null | undefined
    : TParam['optional'] extends { options: { values: infer V } }
    ? V extends undefined
      ? undefined
      : V extends keyof OptionalValueMap
      ? OptionalValueMap[V]
      : never
    : undefined;

type InferDefaultOrOptional<TParam extends ParamSchema> =
  | InferParam<Omit<TParam, DefaultOrOptionalKeys>>
  | InferDefaultOrOptionalValue<TParam>;

type InferCustomSanitizer<TParam extends ParamSchema> = TParam extends {
  customSanitizer: {
    options: (...args: any) => infer T;
  };
}
  ? T
  : never;

type InferCustom<TParam extends ParamSchema> = TParam extends {
  custom: {
    options: 
      | ((arg0: any, ...args: any) => asserts arg0 is infer T)
      | ((arg0: any, ...args: any) => arg0 is infer T);
  };
}
  ? T
  : never;

type InferIsIn<TParam extends ParamSchema> = TParam extends {
  isIn: { options: [infer U extends readonly any[]] };
}
  ? U[number]
  : never;

type InferParam<TParam extends ParamSchema> = HasKey<
  TParam,
  DefaultOrOptionalKeys
> extends true
  ? InferDefaultOrOptional<TParam>
  : HasKey<TParam, 'customSanitizer'> extends true
  ? InferCustomSanitizer<TParam>
  : HasKey<TParam, 'custom'> extends true
  ? InferCustom<TParam>
  : HasKey<TParam, 'isIn'> extends true
  ? InferIsIn<TParam>
  : HasKey<TParam, ArrayKeys> extends true
  ? InferArray<TParam>
  : HasKey<TParam, keyof SanitizersMap> extends true
  ? InferSanitizer<TParam>
  : HasKey<TParam, keyof ValidatorsMap> extends true
  ? InferValidator<TParam>
  : never;

/**
 * is this necessary?
 */
type IntersectArray<T> = ExtractArrayType<T> extends object
  ? Array<UnionToIntersection<IntersectRecursive<ExtractArrayType<T>>>>
  : Array<UnionToIntersection<ExtractArrayType<T>>>;

/**
 * @todo Refactor this to better handle the intersection of objects and Dates
 */
type IntersectRecursive<T> = T extends Date | Date[]
  ? T
  : {
      [K in keyof T]: T[K] extends Date | Date[]
        ? T[K]
        : T[K] extends Array<unknown>
        ? IntersectRecursive<IntersectArray<T[K]>>
        : T[K] extends object
        ? UnionToIntersection<IntersectRecursive<T[K]>>
        : T[K];
    } extends infer A
  ? A
  : never;

/**
 * @todo Refactor this
 */
type SchemaMember<
  TSchema extends Schema,
  K extends keyof TSchema
> = K extends `${string}.${infer B}`
  ? B extends '*'
    ? InferParam<TSchema[K]>[]
    : B extends `*.${infer C}`
    ? Array<InferSchema<{ [key in C]: TSchema[K] }>>
    : InferSchema<{ [key in B]: TSchema[K] }>
  : InferParam<TSchema[K]>;

/**
 * @todo Refactor this to find a better way to infer the schema
 */
type InferSchema<TSchema extends Schema> = {
  [K in keyof TSchema as K extends `${infer A}.${string}`
    ? A
    : K]: SchemaMember<TSchema, K>;
};

/**
 * @todo Refactor this so we can have object as optional
 */
export type Infer<TSchema extends Schema> = Prettify<
  IntersectRecursive<InferSchema<TSchema>>
>;
