import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class NotificationTask {
  private readonly logger = new Logger(NotificationTask.name);

  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private notificationsService: NotificationsService,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Checking for new matches to notify...');

    try {
      const newMatches = await this.matchesRepository.find({
        where: { is_notified: false },
        relations: ['project'],
      });

      this.logger.log(`Found ${newMatches.length} new matches to process`);

      for (const match of newMatches) {
        try {
          await this.notificationsService.sendMatchNotification(match.id);
          this.logger.log(`Processed notification for match ${match.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to process notification for match ${match.id}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to process match notifications: ${error.message}`,
      );
      throw error;
    }
  }
}
