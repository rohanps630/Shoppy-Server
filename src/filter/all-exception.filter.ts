import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NormalException } from '@/exception';
import { Response } from 'express';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(exception?.getStatus?.() || HttpStatus.BAD_REQUEST)
      .send(NormalException.UNEXPECTED(exception?.message).toJSON());
  }
}
