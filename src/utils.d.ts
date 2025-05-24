import type { ParamSchema } from 'express-validator';

export type Prettify<T> = {
  [K in keyof T]: T[K];
} extends infer A
  ? A
  : never;

export type ExtractArrayType<T> = T extends Array<infer U> ? U : never;

export type TypeOrUnknown<T> = [T] extends [never] ? unknown : T;

export type HasKey<
  TParam extends ParamSchema,
  Key extends keyof ParamSchema
> = keyof Pick<TParam, Extract<keyof TParam, Key>> extends never ? false : true;

export type UnionToIntersection<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];
