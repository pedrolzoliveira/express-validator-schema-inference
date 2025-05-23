# express-validator-schema-inference

type helper to infer express-validator's schema type

## Install

```
npm install --save-dev express-validator-schema-inference
```

## Usage example

``` ts
import type { Request, Response } from 'express';
import type { Schema } from 'express-validator';
import type { Infer } from 'express-validator-schema-inference';

function makeController<T extends Schema>(
  schema: T,
  handler: (req: Request & { data: Infer<T> }, res: Response) => any
) {}

makeController(
  {
    'user.name.first': {
      isString: true,
      trim: true,
    },
    'user.name.last': {
      isString: true,
      trim: true,
    },
    'user.emails': {
      isArray: true,
      isEmail: true,
    },
    'user.phones': {
      isArray: true,
      optional: true,
    },
    'user.phones.*.number': {
      isNumeric: true,
      trim: true,
    },
    'user.phones.*.code': {
      isNumeric: true,
      trim: true,
    },
    'user.age': {
      isInt: true,
      toInt: true,
    },
    role: {
      isIn: { options: [['owner', 'admin', 'user'] as const] },
      optional: { options: { values: 'null' } },
    },
  },
  (req, res) => {
    req.data;
    // {
    //   user: {
    //     name: {
    //       first: string;
    //       last: string;
    //     }
    //     emails: string[];
    //     phones: {
    //      number: string;
    //      code: string;
    //     }[] | undefined;
    //     age: number;
    //   }
    //   role: "owner" | "admin" | "user" | undefined | null;
    // }
  }
);

```

## License

MIT License