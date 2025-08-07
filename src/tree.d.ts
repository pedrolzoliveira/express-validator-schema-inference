import type { Schema, ParamSchema } from 'express-validator';
import { HasKey, IntersectRecursive } from './utils';

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

export type SchemaTree = {
  [key: string]: {
    __param?: ParamSchema;
    __fallbackValue?: unknown;
    __shape?: SchemaTree;
  };
};

type __MakeSchemaTree<TSchema extends Schema> = {
  [K in keyof TSchema as K extends `${infer A}.${string}`
    ? A
    : K]: K extends `${infer A}.${infer B}`
    ? {
        __shape: __MakeSchemaTree<{ [key in B]: TSchema[K] }>;
      }
    : {
        __param: TSchema[K];
        __fallbackValue: HasKey<TSchema[K], DefaultOrOptionalKeys> extends true
          ? InferDefaultOrOptionalValue<TSchema[K]>
          : never;
      };
};

export type MakeSchemaTree<TSchema extends Schema> = IntersectRecursive<
  __MakeSchemaTree<TSchema>
>;
