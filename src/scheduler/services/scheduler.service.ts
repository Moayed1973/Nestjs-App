import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchRefreshTask } from '../tasks/match-refresh.task';
import { NotificationTask } from '../tasks/notification.task';
import { SlaCheckTask } from '../tasks/sla-check.task';

@Injectable()
export class SchedulerService {
  constructor(
    private matchRefreshTask: MatchRefreshTask,
    private notificationTask: NotificationTask,
    private slaCheckTask: SlaCheckTask,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron(CronExpression.EVERY_30_SECONDS) // For testing purposes, runs every 30 seconds
  async handleDailyMatchRefresh() {
    await this.matchRefreshTask.execute();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleNotificationProcessing() {
    await this.notificationTask.execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleSlaChecks() {
    await this.slaCheckTask.execute();
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyCleanup() {}
}
