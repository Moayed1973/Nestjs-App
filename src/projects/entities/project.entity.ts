import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ClientCompany } from '../../clients/entities/client.entity';
import { Match } from 'src/matches/entities/match.entity';

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientCompany, (client) => client.projects, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: ClientCompany;

  @Column()
  company_id: number;

  @Column({ length: 100 })
  country: string;

  @Column('simple-array')
  services_needed: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
