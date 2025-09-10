import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { ClientCompany } from '../../clients/entities/client.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../auth/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientCompany, Vendor, Project, User, Match]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
