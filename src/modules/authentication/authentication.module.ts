import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/user.Entity';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '7d',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, UserRepository],
})
export class AuthenticationModule {}
