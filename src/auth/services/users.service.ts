import { MicroserviceEnvKeys } from '@/microserviceFactory.factory';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repositories';
import { BaseRequest } from '@/common/base.request';
import { FindUsersResponse } from '../dto/create-user-request.dto';

@Injectable()
export class UserService {
  private JWT_REFRESH_TOKEN_SECRET: string = '';
  private JWT_TOKEN_SECRET: string = '';
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private jwt: JwtService,
    private userRepo: UserRepository,
  ) {
    this.JWT_REFRESH_TOKEN_SECRET = configService.getOrThrow(MicroserviceEnvKeys.JWT_REFRESH_SECRET);
    this.JWT_TOKEN_SECRET = configService.getOrThrow(MicroserviceEnvKeys.JWT_SECRET);
  }
  public async findAll(req: BaseRequest): Promise<FindUsersResponse> {
    try {
      const users = await this.userRepo.findAll();

      const resonse = Promise.all(
        users.map((user) =>
          FindUsersResponse.of(
            user._id,
            user.userName,
            user.name.firstName,
            user.name.lastName,
            user.email,
            user.createdAt,
            user.updatedAt,
          ),
        ),
      );
    } catch (error) {}
    return;
  }
  public async personalData(req: BaseRequest) {}
  public async getUserState(req: BaseRequest) {}
  public async updateUserState(req: BaseRequest) {}
  public async findByRole(req: BaseRequest) {}
  public async changeUserRole(req: BaseRequest) {}
}
