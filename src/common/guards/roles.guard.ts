import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../enums/user-role.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { VerifyAuthRequest } from '@/auth/dto/verify-auth.dto';
import { AuthService } from '@/auth/services/auth.service';
import { AuthInfo } from '../base.request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { headers, ...request } = context.switchToHttp().getRequest();
    let authorisation = headers['authorization'];
    if (!authorisation) {
      authorisation = headers['Authorization'];
    }
    if (!authorisation) {
      return false;
    }
    const verifyAuthRequest = new VerifyAuthRequest(authorisation);

    const userRoles = await this._getUserRolesFromToken(verifyAuthRequest);

    RolesGuard._set(headers, AuthInfo.ROLES, userRoles);
    RolesGuard._set(request, 'body', AuthInfo.ROLES, userRoles);
    RolesGuard._set(request, 'query', AuthInfo.ROLES, userRoles);
    RolesGuard._set(request, 'params', AuthInfo.ROLES, userRoles);

    return requiredRoles.some((role) => userRoles?.includes(role));
  }
  async _getUserRolesFromToken(verifyAuthRequest: VerifyAuthRequest) {
    // const requestDto = new VerifyAuthRequestDto(verifyAuthRequest);
    const verifyAuthResponse = await this.authService.verify(verifyAuthRequest);
    // const userRoles = await this.authService._getUserRoles(verifyAuthResponse);
    const userRoles = '';
    return userRoles;
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
