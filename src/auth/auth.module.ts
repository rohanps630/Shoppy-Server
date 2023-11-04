import { Module } from '@nestjs/common';
import { LoggerService } from '@common/logger/logger.service';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './Repositories/user.repositories';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthServiceSchemas } from './Entities/schemas.register';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        signOptions: {
          algorithm: 'HS512',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([...AuthServiceSchemas]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, LoggerService, UserRepository, UserService],
  exports: [AuthService, UserService],
})
export class AuthModule {}
