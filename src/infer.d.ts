import type { Schema, ParamSchema } from 'express-validator';
import type { MakeSchemaTree, SchemaTree } from './tree';
import type { TypeOrUnknown, HasKey, PrettifyRecursive } from './utils';

/** @todo Add missing Sanitizers `blacklist`, `whitelist`, `normalizeEmail` */
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

/** @todo Add missing validators, take a look at `node_modules/express-validator/lib/chain/validators.d.ts` */
type ValidatorsMap = {
  isBoolean: boolean;
  isDate: Date;
  isFloat: number;
  isInt: number;
  isString: string;
  isULID: string;
  isAlpha: string;
  isAlphanumeric: string;
  isAscii: string;
  isBase32: string;
  isBase58: string;
  isBase64: string;
  isBtcAddress: string;
  isCreditCard: string;
  isCurrency: string;
  isEmail: string;
  isISO6346: string;
  isISO4217: string;
  isISO8601: string;
  isObject: {};
};

type InferValidator<TParam extends ParamSchema> = {
  [K in keyof TParam]: K extends keyof ValidatorsMap ? ValidatorsMap[K] : never;
}[keyof TParam];

type ArrayKeys = 'isArray' | 'toArray';

type InferArray<TParam extends ParamSchema> = InferParam<
  Omit<TParam, ArrayKeys>
> extends infer TInfer
  ? TypeOrUnknown<TInfer>[]
  : never;

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
  'customSanitizer'
> extends true
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

type Intersect<A, B> = [A] extends [never]
  ? B
  : [B] extends [never]
  ? A
  : A extends (infer ArrayTypeA)[]
  ? B extends (infer ArrayTypeB)[]
    ? (ArrayTypeA & ArrayTypeB)[]
    : A & B
  : A & B;

type SchemaMember<TSchema extends SchemaTree> = {
  [K in keyof TSchema]:
    | Intersect<
        TSchema[K] extends { __param: infer TParam }
          ? InferParam<TParam>
          : never,
        TSchema[K] extends { __shape: infer TShape }
          ? InferSchema<TShape>
          : never
      >
    | (TSchema[K] extends { __fallbackValue: infer TFallback }
        ? TFallback
        : never);
};

type InferSchema<TSchema extends SchemaTree> = keyof TSchema extends '*'
  ? Array<SchemaMember<TSchema>[keyof TSchema]>
  : SchemaMember<TSchema>;

export type Infer<TSchema extends Schema> = InferSchema<
  MakeSchemaTree<TSchema>
>;
