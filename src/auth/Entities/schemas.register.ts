import { EntityNames } from '@/common/database/entity.names';
import { UserSchema } from './user.entity';

export const AuthServiceSchemas = [{ name: EntityNames.USERS, schema: UserSchema }];
