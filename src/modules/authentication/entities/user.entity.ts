import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/shared/enums/authentication';
import * as bcryptjs from 'bcryptjs';
import { PartialType } from '@nestjs/mapped-types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column({ default: Role.User, type: 'enum', enum: Role })
  role: Role;
  @Column({ select: true })
  password: string;
  @BeforeInsert()
  hashPass() {
    this.password = bcryptjs.hashSync(this.password, 10);
  }
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

export class UserPartial extends PartialType(User) {}
