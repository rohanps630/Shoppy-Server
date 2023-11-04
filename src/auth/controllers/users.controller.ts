import { SentryInterceptor } from '@/common/interceptors/sentry.interceptor';
import { UseInterceptors, Controller, Get, Query, UseGuards, Put, Param } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthInfo, BaseRequest } from '@/common/base.request';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRoles } from '@/common/enums/user-role.enums';
import { AuthGuard } from '@/common/guards/guards';
import { AuthoriseUserResponse, FindUsersResponse, GetRoleRequest, UpdateRoleRequest } from '../dto/create-user-request.dto';
import { UserService } from '../services/users.service';

@UseInterceptors(SentryInterceptor)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Retrieve all users - only possible for admin', type: FindUsersResponse })
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  async findAll(@Query() req: BaseRequest): Promise<FindUsersResponse> {
    console.log(req.roles);
    return await this.userService.findAll(req);
  }

  @Get('/personal')
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Retrieve personal data based on email- possible for admin and normal user', type: AuthoriseUserResponse })
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  personalData(@Query() req: BaseRequest) {
    console.log(req.roles);
    return 'Ok';
  }

  @Get('/state')
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Get user state', type: AuthoriseUserResponse })
  //   @Roles(UserRoles.USER, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  getUserState(@Query() req: BaseRequest) {
    console.log(req.roles);
    return 'Ok';
  }

  @Put('/state')
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Update user state', type: AuthoriseUserResponse })
  //   @Roles(UserRoles.USER, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  updateUserState(@Query() req: BaseRequest) {
    console.log(req.roles);
    return 'Ok';
  }

  @Get('/role/:roleType')
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Get user role', type: AuthoriseUserResponse })
  //   @Roles(UserRoles.USER, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  findByRole(@Param() req: GetRoleRequest) {
    console.log(req.roles);
    return 'Ok';
  }

  @Put('/role')
  @UseGuards(AuthGuard)
  @ApiBasicAuth(AuthInfo.JWT_AUTH_KEY)
  @ApiOkResponse({ description: 'Update user role', type: AuthoriseUserResponse })
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  // @Roles(UserRoles.ADMIN)
  changeUserRole(@Query() req: UpdateRoleRequest) {
    console.log(req.roles);
    return 'Ok';
  }
}
