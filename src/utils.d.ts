import type { ParamSchema } from 'express-validator';

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

export type IntersectRecursive<T> = {
  [K in keyof T]: T[K] extends Function
    ? T[K]
    : [T[K]] extends [never]
    ? never
    : T[K] extends object
    ? UnionToIntersection<IntersectRecursive<T[K]>>
    : T[K];
} extends infer A
  ? A
  : never;
