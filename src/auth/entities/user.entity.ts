import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  CompanyUser = 'company_user',
  Admin = 'admin',
}

export interface UserEntity {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  companyId?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CompanyUser,
  })
  role: UserRole;

  @Column({ nullable: true })
  companyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
