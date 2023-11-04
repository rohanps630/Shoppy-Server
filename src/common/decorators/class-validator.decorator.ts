import { ValidationOptions, ValidationArguments, registerDecorator } from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectIdOrString(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectIdOrString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any /*, args: ValidationArguments */) {
          if (value instanceof Types.ObjectId || Types.ObjectId.isValid(value)) {
            return true;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be either a valid Types.ObjectId or a string representation of Types.ObjectId`;
        },
      },
    });
  };
}

export function IsArrayOfObjectIdOrStrings(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsArrayOfObjectIdOrStrings',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any /*, args: ValidationArguments*/) {
          if (Array.isArray(value)) {
            return value.every((item) => item instanceof Types.ObjectId || Types.ObjectId.isValid(item));
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid Types.ObjectId instances or strings representing Types.ObjectId`;
        },
      },
    });
  };
}
