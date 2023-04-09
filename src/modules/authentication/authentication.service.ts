import { Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { LoginAuthenticationDto } from './dto/login-authentication.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { PinoLogger } from 'nestjs-pino';
import { AppConfig } from '../app';
import { User } from './Entities/user.Entity';
import { Role } from '@/shared/enums/authentication';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthenticationService {
  private logger: PinoLogger;
  constructor(private readonly repo: UserRepository, private jwt: JwtService) {
    this.logger = new PinoLogger(AppConfig.getLoggerConfig());
  }
  async login(loginDto: LoginAuthenticationDto) {
    let user = await this.repo.findByEmail(loginDto.email);
    this.logger.info(`Log user ${loginDto.email} tries to login`);
    if (!user) {
      // throw new customException(errors.invalidEmailPassword, 400);
    } else {
      if (await this.verifyPassword(loginDto.password, user.password)) {
        const token = await this.jwt.signAsync({
          email: user.email,
          id: user.id,
        });
        delete user.password;
        return { token, email: user.email, roles: user.role };
      } else {
        this.logger.error(` user ${loginDto.email} Failed to login`, 'SIGN IN');

        // throw new customException(errors.invalidEmailPassword, 400);
      }
    }
  }

  //Register
  async register(createUserDto: CreateAuthenticationDto) {
    const { email, password, role, name } = createUserDto;

    /*Check if the user is already present in database, if yes, throw error */
    // const checkUser = await this.repo.findOne({ where: { email } });
    this.logger.info(` user ${email} tries to Register`);

    let checkUser = await this.repo.findByEmail(email);
    if (checkUser) {
      this.logger.error(` user ${email}  is already Registered`, 'SIGN UP');

      // throw new customException(errors.alreadyRegistered, 400);
    } else {
      const user = new User();
      // const role=new rolesEntitiy();
      user.email = email;
      user.password = password;
      user.name = name;
      user.role = role ?? Role.User;
      await this.repo.create(user);
      delete user.password;
      const token = await this.jwt.signAsync({
        email: user.email,
        id: user.id,
      });
      delete user.password;
      this.logger.info(` user ${email} Registered successfully`, 'SIGN UP');

      return { token, email, role: user.role };
    }
  }
  async verifyPassword(password: string, userHash: string) {
    return await bcrypt.compare(password, userHash);
  }
}
