import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthoriseUserResponse, LoginRequest, RegisterUserRequest } from '../dto/create-user-request.dto';
import { SentryInterceptor } from '@common/interceptors/sentry.interceptor';
import { ApiBasicAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthInfo, BaseRequest } from '@common/base.request';
import { AuthGuard } from '@common/guards/guards';
import { UserRoles } from '@/common/enums/user-role.enums';
import { Roles } from '@/common/decorators/roles.decorator';
import { GetUserByRoleRequest, GetUsersByRoleResponse } from '../dto/get-users-request.dto';

@UseInterceptors(SentryInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Login Response', type: AuthoriseUserResponse })
  async login(@Body() loginUserRequest: LoginRequest): Promise<AuthoriseUserResponse> {
    return await this.authService.login(loginUserRequest);
  }

  @Post('register')
  @ApiOkResponse({ description: 'Register Response', type: AuthoriseUserResponse })
  async register(@Body() registerUserRequest: RegisterUserRequest): Promise<AuthoriseUserResponse> {
    return await this.authService.register(registerUserRequest);
  }

  // @Get('users/role')
  // @ApiOkResponse({ description: 'users Response', type: AuthoriseUserResponse })
  // async users(@Query() request: GetUserByRoleRequest): Promise<GetUsersByRoleResponse> {
  //   return await this.authService.getUsersByRole(request);
  // }

  @Get('test')
  @UseGuards(AuthGuard)

  // @Roles(UserRoles.ADMIN)
  @Roles(UserRoles.TUTOR, UserRoles.ADMIN)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  test(@Query() req: BaseRequest) {
    console.log(req.roles);
    return 'Ok';
  }
}
