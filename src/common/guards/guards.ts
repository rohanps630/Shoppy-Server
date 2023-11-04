import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { VerifyAuthRequest } from '../../auth/dto/verify-auth.dto';
import { AuthInfo } from '../base.request';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const methodKey = context.getHandler().name; // "create"
      const className = context.getClass().name;
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const headers = request.headers;

      this._verifyAuthAndPreSetFields(request, headers)
        .then((v) => {
          this.loggerService.log('canActivate => ' + className + '.' + methodKey + '[headers]', JSON.stringify(headers));
          return v;
        })
        .then((v) => {
          resolve(v);
        })
        .catch((error) => {
          this.loggerService.error('canActivate => ' + className + '.' + methodKey + '[headers]', error);
          reject(error);
        });
    });
  }

  async _verifyAuthAndPreSetFields(request: Request, headers: Headers): Promise<boolean> {
    let authorization = headers['Authorization'];

    if (!authorization) {
      authorization = headers['authorization'];
    }

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const verifyAuthRequest = new VerifyAuthRequest(authorization);
    const verifyAuthResponse = await this.authService.verify(verifyAuthRequest);

    if (!verifyAuthResponse || verifyAuthResponse.isValid == false) {
      throw new UnauthorizedException();
    }

    const authInfo = new AuthInfo(authorization, verifyAuthResponse.userId);

    AuthGuard._set(headers, AuthInfo.AUTHORIZATION_KEY, authInfo.authorization);
    AuthGuard._set(headers, AuthInfo.USER_ID_KEY, authInfo.userId);

    AuthGuard._set(request, 'body', AuthInfo.AUTH_INFO_KEY, authInfo);
    AuthGuard._set(request, 'body', AuthInfo.AUTHORIZATION_KEY, authInfo.authorization);
    AuthGuard._set(request, 'body', AuthInfo.USER_ID_KEY, authInfo.userId);

    AuthGuard._set(request, 'query', AuthInfo.AUTH_INFO_KEY, authInfo);
    AuthGuard._set(request, 'query', AuthInfo.AUTHORIZATION_KEY, authInfo.authorization);
    AuthGuard._set(request, 'query', AuthInfo.USER_ID_KEY, authInfo.userId);

    AuthGuard._set(request, 'params', AuthInfo.AUTH_INFO_KEY, authInfo);
    AuthGuard._set(request, 'params', AuthInfo.AUTHORIZATION_KEY, authInfo.authorization);
    AuthGuard._set(request, 'params', AuthInfo.USER_ID_KEY, authInfo.userId);

    return true;
  }

  static _set(obj: object, key1?: any, key2?: any, val?: any) {
    try {
      if (key1 && key2) {
        obj[key1][key2] = val;
      } else if (key1) {
        obj[key1] = val;
      }
    } catch (error) {}
  }
}
