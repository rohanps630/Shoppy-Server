import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { NormalException } from '@/exception';

@Catch(NormalException)
export class NormalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NormalExceptionFilter.name);

  catch(exception: NormalException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).send(exception.toJSON());
  }
}
