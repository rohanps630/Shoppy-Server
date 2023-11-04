import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { hashPassword } from '@common/utils/hash-password';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EntityNames } from '@/database/entity-names';

export type UserDocument = UserEntity & Document;
@Schema({ collection: 'users' })
export class UserEntity {
  // @ObjectIdColumn({ name: '_id' })
  @Prop({
    type: Types.ObjectId, // Specify the type as ObjectId
    default: new Types.ObjectId(), // Generate a new ObjectId by default
  })
  public _id: Types.ObjectId;

  // @Column({ name: 'user_name' })
  @Prop({ name: 'user_name' })
  public user_name: string;

  // @Column({ name: 'first_name' })
  @Prop({ name: 'first_name' })
  public first_name: string;

  // @Column({ name: 'last_name' })
  @Prop({ name: 'last_name' })
  public last_name: string;

  // @Column({ name: 'email', nullable: false })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Prop({ name: 'email' })
  public email: string;

  // @Column({ name: 'password', nullable: false })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Prop({ name: 'password' })
  public password: string;

  // @ManyToOne(() => UserRoleEntity)
  // @Column({ name: 'role' })
  // @Prop({ type: Types.ObjectId, ref: EntityNames.USER_ROLE, name: 'role' }) // Define the reference to UserStateEntity
  // public role: UserRoleEntity;

  // @CreateDateColumn({ name: 'created_at', nullable: false, update: false })
  @Prop({ type: Date, default: Date.now, select: false, name: 'createdAt' }) // Define createdAt field and exclude it from updates
  public createdAt: Date;

  // @UpdateDateColumn({ name: 'updated_at', nullable: false })
  @Prop({ type: Date, default: Date.now, name: 'updatedAt' }) // Define updatedAt field
  public updatedAt: Date;

  // @VersionColumn({ name: 'version', nullable: false, default: 0 })
  @Prop({ type: 'number', name: 'version' })
  public version = 0;

  public static builder() {
    return new UserEntity.Builder();
  }

  public toBuilder() {
    const builder = UserEntity.builder();

    builder._id = this._id;
    builder.userName = this.user_name;
    builder.email = this.email;
    builder.firstName = this.first_name;
    builder.lastName = this.last_name;
    builder.password = this.password;
    // builder.role = this.role;
    builder.createdAt = this.createdAt;
    builder.updatedAt = this.updatedAt;
    builder.version = this.version;

    return builder;
  }

  public static Builder = class {
    _id: Types.ObjectId;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // role: UserRoleEntity;
    createdAt: Date;
    updatedAt: Date;
    version = 0;

    profileImage: string;

    public setUserName(value: string) {
      this.userName = value;
      return this;
    }

    public setEmail(value: string) {
      this.email = value;
      return this;
    }
    public setPassword(value: string) {
      const hashedPassword = hashPassword(value);
      this.password = hashedPassword;
      return this;
    }
    public setFirstName(value: string) {
      this.firstName = value;
      return this;
    }
    public setLastName(value: string) {
      this.lastName = value;
      return this;
    }
    // public setUserRoles(value: UserRoleEntity) {
    //   this.role = value;
    //   return this;
    // }

    public build(includeId = true): UserEntity {
      const e = new UserEntity();

      if (!this.createdAt) this.createdAt = new Date();
      if (!e._id) this._id = new Types.ObjectId();

      this.updatedAt = new Date();

      if (includeId) {
        e._id = this._id;
      }

      e._id = this._id;
      e.user_name = this.userName;
      e.first_name = this.firstName;
      e.last_name = this.lastName;
      e.email = this.email;
      e.password = this.password;
      // e.role = this.role;
      e.createdAt = this.createdAt;
      e.updatedAt = this.updatedAt;
      e.version = e.version + 1;

      return e;
    }
  };
}
export const UserSchema = SchemaFactory.createForClass(UserEntity);
UserSchema.loadClass(UserEntity);
