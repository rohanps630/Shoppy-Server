import { UserRoles } from './enums/user-role.enums';

export class BaseRequest {
  public readonly authInfo?: AuthInfo;
  public readonly roles: UserRoles = null;
}

export class AuthInfo {
  public static get AUTHORIZATION_KEY(): string {
    return '__authorization__';
  }
  public static get USER_ID_KEY(): string {
    return '__userId__';
  }
  public static get AUTH_INFO_KEY(): string {
    return 'authInfo';
  }
  public static get JWT_AUTH_KEY(): string {
    return '__JWT-auth__';
  }
  public static get ROLES(): string {
    return 'roles';
  }

  constructor(
    public readonly authorization: string,
    public readonly userId: string,
    public readonly roles: UserRoles[] = [],
  ) {}
}
