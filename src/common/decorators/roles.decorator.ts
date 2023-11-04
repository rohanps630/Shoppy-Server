import { SetMetadata } from '@nestjs/common';
import { Constants } from '../constants';
import { UserRoles } from '../enums/user-role.enums';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(Constants.ROLES, roles);
