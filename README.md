type helper to infer express-validator's schema type

# express-validator-schema-inference

TypeScript type helper to infer the resulting data type from an [express-validator](https://express-validator.github.io/docs/) schema.

This utility allows you to statically infer the shape of validated request data, improving type safety and developer experience in Express projects using express-validator.

## Features

- Infers nested object and array types from express-validator schema keys (e.g., `user.name.first`, `user.phones.*.number`).
- Supports common express-validator options (see below).

### Supported schema options

The following express-validator schema options are currently supported for type inference:

#### Validators
- `isBoolean`
- `isDate`
- `isFloat`
- `isInt`
- `isString`
- `isULID`
- `isAlpha`
- `isAlphanumeric`
- `isAscii`
- `isBase32`
- `isBase58`
- `isBase64`
- `isBtcAddress`
- `isCreditCard`
- `isCurrency`
- `isEmail`
- `isISO6346`
- `isISO4217`
- `isISO8601`
- `isObject`
- `notEmpty`
- `isEmpty`
- `isNumeric`
- `isJSON`
- `isURL`
- `isUUID`
- `isMobilePhone`
- `isLength`
- `contains`
- `equals`
- `matches`
- `isIP`
- `isHexadecimal`
- `isMongoId`
- `isMD5`
- `isDecimal`
- `isEthereumAddress`
- `isFQDN`
- `isHash`
- `isHexColor`
- `isIBAN`
- `isISBN`
- `isISSN`
- `isISIN`
- `isJWT`
- `isLatLong`
- `isLocale`
- `isLowercase`
- `isMimeType`
- `isPassportNumber`
- `isPort`
- `isPostalCode`
- `isRFC3339`
- `isSemVer`
- `isSlug`
- `isUppercase`
- `isDataURI`
- `isMagnetURI`
- `isMailtoURI`
- `isMACAddress`
- `isOctal`
- `isRgbColor`
- `isTime`
- `isVAT`
- `isWhitelisted`
- `isArray`
- `isIn`

#### Sanitizers
- `toBoolean`
- `toDate`
- `toFloat`
- `toInt`
- `ltrim`
- `rtrim`
- `trim`
- `toLowerCase`
- `toUpperCase`
- `escape`
- `unescape`
- `blacklist`
- `whitelist`
- `normalizeEmail`
- `stripLow`
- `toArray`

#### Special options
- `optional` (marks a field as optional, reflected in the output type)
- `custom` (supports custom validators with type guards and assertions)
- `customSanitizer` (supports custom sanitizers with return type inference)

Other options may be partially supported if they do not affect the output type. See Limitations below for unsupported or advanced features.
- Handles optional fields and union types (e.g., enums, nullable fields).
- Designed for use with TypeScript and type inference in controllers/middleware.

## Limitations

- Recursive fields using `**.field` (double star for deep/recursive matching) are not supported.
- Multiple custom validators/sanitizers using arbitrary keys (as described in the [express-validator documentation](https://express-validator.github.io/docs/api/check-schema#custom-validators)) are not supported. Only single `custom` and `customSanitizer` properties are supported per field.
- Not all express-validator features are supported. Please see the source or open an issue if you need support for additional features.

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
) {
  // You should implement makeController so that req.data is set to the return value of matchedData.
}

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