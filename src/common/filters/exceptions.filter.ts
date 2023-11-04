import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { IResponse } from '../iresponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const ex: HttpException = exception instanceof HttpException ? exception : new InternalServerErrorException();
    const status = ex.getStatus();

    try {
      this.loggerService.error(this, 'catch', exception, request, response);
    } catch (error) {
      this.loggerService.error(this, 'catch.catch', error);
    }

    response.status(status).json(IResponse.ofError(ex).setStatusCode(status));
  }
}
