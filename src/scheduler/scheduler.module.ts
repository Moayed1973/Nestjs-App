import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerService } from './services/scheduler.service';
import { MatchRefreshTask } from './tasks/match-refresh.task';
import { NotificationTask } from './tasks/notification.task';
import { SlaCheckTask } from './tasks/sla-check.task';
import { NotificationsModule } from '../notifications/notifications.module';
import { MatchesModule } from '../matches/matches.module';
import { VendorsModule } from '../vendors/vendors.module';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Project]),
    NotificationsModule,
    MatchesModule,
    VendorsModule,
  ],
  providers: [
    SchedulerService,
    MatchRefreshTask,
    NotificationTask,
    SlaCheckTask,
  ],
})
export class SchedulerModule {}
