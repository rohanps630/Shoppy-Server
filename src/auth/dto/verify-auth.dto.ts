export class VerifyAuthRequest {
  constructor(public readonly token: string) {}
}
export class VerifiedTokenPayload {
  email: string;
  userId: string;
  sessionId: string;
}
export class VerifyAuthResponse {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly isValid: boolean,
  ) {}
  public static of(userId: string, email: string, isValid: boolean): VerifyAuthResponse {
    return new VerifyAuthResponse(userId, email, isValid);
  }
}
export class VerifyAuthRequestDto {
  constructor(public readonly request: VerifyAuthRequest) {}

  public getType() {
    return this.request.token.split(' ')[0];
  }

  public getToken() {
    return this.request.token.split(' ')[1];
  }
}
