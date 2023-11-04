import { PreconditionFailedException } from '@nestjs/common';

export class UserNotFoundException extends PreconditionFailedException {
  constructor() {
    super('USER_NOT_FOUND');
  }
}
