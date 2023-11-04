import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../iresponse';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, IResponse<T, HttpException>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T, HttpException>> {
    const name = context.getClass().name;
    if (name === 'HealthController') {
      return next.handle().pipe(map((data) => data));
    }

    return next.handle().pipe(map((data) => IResponse.ofResult(data).setStatusCode(context.switchToHttp().getResponse().statusCode)));
  }
}
