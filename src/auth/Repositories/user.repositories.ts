import { Injectable, Logger } from '@nestjs/common';
import { UserDocument, UserEntity } from '../Entities/user.entity';
import { EntityRepository } from '@/database/entity.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(UserEntity.name) userEntity: Model<UserDocument>) {
    super(userEntity);
  }

  async findById(id: Types.ObjectId): Promise<UserDocument> {
    try {
      if (!id) {
        return null;
      }

      return await this.entityModel.findById(id).populate('role');
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error from userRepo.findById():${error.message}`, 'USER-REPOSITORY');
      } else {
        Logger.error(`Error from userRepo.findById():${error}`, 'USER-REPOSITORY');
      }
      console.log(error);
      return null;
    }
  }

  async findByIds(id: Types.ObjectId[]): Promise<UserDocument[]> {
    try {
      if (!id || id.length <= 0) {
        return null;
      }

      return await this.entityModel.find({
        _id: {
          $in: id,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error from userRepo.findById():${error.message}`, 'USER-REPOSITORY');
      } else {
        Logger.error(`Error from userRepo.findById():${error}`, 'USER-REPOSITORY');
      }
      console.log(error);
      return null;
    }
  }

  async findByEmail(emailId: string): Promise<UserDocument> {
    try {
      if (!emailId) {
        return null;
      }
      return await this.entityModel.findOne({
        email: emailId,
      });
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error from userRepo.findByEmail():${error.message}`, 'USER-REPOSITORY');
      } else {
        Logger.error(`Error from userRepo.findByEmail():${error}`, 'USER-REPOSITORY');
      }
      console.log(error);

      return null;
    }
  }

  async findByUserName(userName: string): Promise<UserDocument> {
    try {
      if (!userName) {
        return null;
      }
      return await this.entityModel.findOne({
        userName: userName,
      });
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error from userRepo.findByEmail():${error.message}`, 'USER-REPOSITORY');
      } else {
        Logger.error(`Error from userRepo.findByEmail():${error}`, 'USER-REPOSITORY');
      }
      console.log(error);

      return null;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.entityModel.find();
    } catch (error) {
      return [];
    }
  }

  async remove(user: UserEntity): Promise<UserEntity> {
    if (!user) return null;
    try {
      const result = await this.entityModel.deleteOne({ _id: user._id });
      return result.deletedCount > 0 ? user : null;
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Error from userRepo.remove():${error.message}`, 'USER-REPOSITORY');
      } else {
        Logger.error(`Error from userRepo.remove():${error}`, 'USER-REPOSITORY');
      }

      return null;
    }
  }
}
