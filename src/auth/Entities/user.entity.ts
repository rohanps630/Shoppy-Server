import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { hashPassword } from '@common/utils/hash-password';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EntityNames } from '@/database/entity-names';

export type UserDocument = UserEntity & Document;
@Schema({ collection: 'users' })
export class UserEntity {
  @Prop({
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  })
  public _id: Types.ObjectId;

  @IsEmail()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  email: string;

  @IsNotEmpty()
  @Prop({ required: true, type: String })
  userName: string;

  @IsNotEmpty()
  @MinLength(8)
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  name: {
    firstName: string;
    lastName: string;
  };

  @Prop({
    type: {
      city: String,
      street: String,
      number: Number,
      zipcode: String,
    },
  })
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Date, default: Date.now, select: false, name: 'createdAt' })
  public createdAt: Date;

  @Prop({ type: Date, default: Date.now, name: 'updatedAt' })
  public updatedAt: Date;

  @Prop({ type: 'number', name: 'version' })
  public version = 0;

  public static builder() {
    return new UserEntity.Builder();
  }

  public toBuilder() {
    const builder = UserEntity.builder();

    builder._id = this._id;
    builder.email = this.email;
    builder.userName = this.userName;
    builder.name = this.name;
    builder.phone = this.phone;
    builder.password = this.password;
    builder.address = this.address;
    builder.createdAt = this.createdAt;
    builder.updatedAt = this.updatedAt;
    builder.version = this.version;

    return builder;
  }

  public static Builder = class {
    _id: Types.ObjectId;
    email: string;
    userName: string;
    password: string;
    name: {
      firstName: string;
      lastName: string;
    };
    address: {
      city: string;
      street: string;
      number: number;
      zipcode: string;
    };
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    version = 0;

    public setEmail(email: string) {
      this.email = email;
      return this;
    }

    public setUserName(userName: string) {
      this.userName = userName;
      return this;
    }

    public setPassword(value: string) {
      const hashedPassword = hashPassword(value);
      this.password = hashedPassword;
      return this;
    }

    public setName(name: typeof this.name) {
      this.name = name;
      return this;
    }

    public setAddress(address: typeof this.address) {
      this.address = address;
      return this;
    }

    public setPhone(phone: string) {
      this.phone = phone;
      return this;
    }

    public build(includeId = true): UserEntity {
      const e = new UserEntity();

      if (!this.createdAt) this.createdAt = new Date();
      if (!e._id) this._id = new Types.ObjectId();

      this.updatedAt = new Date();

      if (includeId) {
        e._id = this._id;
      }

      e._id = this._id;
      e.userName = this.userName;
      e.name = this.name;
      e.email = this.email;
      e.password = this.password;
      e.address = this.address;
      e.phone = this.phone;
      e.createdAt = this.createdAt;
      e.updatedAt = this.updatedAt;
      e.version = e.version + 1;

      return e;
    }
  };
}
export const UserSchema = SchemaFactory.createForClass(UserEntity).loadClass(UserEntity);
