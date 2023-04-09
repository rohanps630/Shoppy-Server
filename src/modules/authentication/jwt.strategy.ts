import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from './Repository/user.repository';
import { errors } from '@/shared/Exceptions/errors';
import { customException } from '@/shared/Exceptions/customException.exception';
require('dotenv').config();

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserRepo: UserRepository) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
      //   return request?.cookies?.Authentication;
      // }]),
    });
  }

  async validate(payload: any, req: Request) {
    if (!payload) {
      throw new customException(errors.unAuthorized, 400);
    }
    const user = await this.UserRepo.findByEmail(payload.email);
    if (!user) {
      throw new customException(errors.unAuthorized, 400);
      throw new UnauthorizedException();
    }
    req['user'] = user;
    return req['user'];
  }
}
