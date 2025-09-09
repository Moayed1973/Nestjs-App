import { Injectable, Logger } from '@nestjs/common';
import { VendorsService } from '../../vendors/vendors.service';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class SlaCheckTask {
  private readonly logger = new Logger(SlaCheckTask.name);

  constructor(
    private vendorsService: VendorsService,
    private notificationsService: NotificationsService,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Checking for vendors with expired SLAs...');

    try {
      const vendors = await this.vendorsService.findAll();

      for (const vendor of vendors) {
        try {
          const hasExpiredSla =
            await this.notificationsService.sendSlaWarningNotification(
              vendor.id,
            );
          if (hasExpiredSla) {
            this.logger.log(`Flagged vendor ${vendor.name} for expired SLA`);
          }
        } catch (error) {
          this.logger.error(
            `Failed to check SLA for vendor ${vendor.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('SLA check completed');
    } catch (error) {
      this.logger.error(`Failed to check SLAs: ${error.message}`);
      throw error;
    }
  }
}
