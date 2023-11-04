import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

export class DuplicateRecordException extends HttpException {
  constructor(objectOrError: string | object | any, descriptionOrOptions?: HttpExceptionOptions) {
    const errorResponse =
      typeof objectOrError === 'string'
        ? { message: objectOrError, error: 'Duplicate Request', statusCode: HttpStatus.CONFLICT }
        : objectOrError;
    super(errorResponse, HttpStatus.CONFLICT, descriptionOrOptions);
  }
}
