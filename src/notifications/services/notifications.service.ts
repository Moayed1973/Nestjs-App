import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { ProjectsService } from '../../projects/projects.service';
import { VendorsService } from '../../vendors/vendors.service';
import { EmailService } from '../interfaces/email-service.interface';
import { MatchNotificationTemplate } from '../templates/match-notification.template';
import { SlaWarningTemplate } from '../templates/sla-warning.template';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private projectsService: ProjectsService,
    private vendorsService: VendorsService,
    @Inject('EmailService') private emailService: EmailService,
  ) {}

  async sendMatchNotification(matchId: number): Promise<boolean> {
    try {
      const match = await this.matchesRepository.findOne({
        where: { id: matchId },
        relations: ['project', 'vendor'],
      });

      if (!match || match.is_notified) {
        return false;
      }

      const project = await this.projectsService.findOne(match.project_id, {
        role: 'admin',
      } as any);
      const vendor = await this.vendorsService.findOne(match.vendor_id);

      const servicesOverlap = project.services_needed.filter((s) =>
        vendor.services_offered.includes(s),
      ).length;

      const emailContent = MatchNotificationTemplate.generate(
        project.country,
        project.services_needed,
        vendor.name,
        match.score,
        servicesOverlap,
        vendor.rating,
        vendor.response_sla_hours,
      );

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@expanders360.com';

      const emailSent = await this.emailService.sendEmail(
        adminEmail,
        `New Match: ${vendor.name} for ${project.country} Project`,
        emailContent,
      );

      if (emailSent) {
        match.is_notified = true;
        await this.matchesRepository.save(match);
        this.logger.log(`Notification sent for match ${matchId}`);
      }

      return emailSent;
    } catch (error) {
      this.logger.error(`Failed to send match notification: ${error.message}`);
      return false;
    }
  }

  async sendSlaWarningNotification(vendorId: number): Promise<boolean> {
    try {
      const vendor = await this.vendorsService.findOne(vendorId);

      const expiredMatches = await this.matchesRepository
        .createQueryBuilder('match')
        .where('match.vendor_id = :vendorId', { vendorId })
        .andWhere(
          'match.created_at < DATE_SUB(NOW(), INTERVAL :slaHours HOUR)',
          {
            slaHours: vendor.response_sla_hours,
          },
        )
        .andWhere('match.is_notified = false')
        .getCount();

      if (expiredMatches > 0) {
        const emailContent = SlaWarningTemplate.generate(
          vendor.name,
          vendor.response_sla_hours,
          expiredMatches,
          vendor.countries_supported,
          vendor.services_offered,
        );

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@expanders360.com';

        return this.emailService.sendEmail(
          adminEmail,
          `SLA Warning: ${vendor.name}`,
          emailContent,
        );
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to send SLA warning: ${error.message}`);
      return false;
    }
  }
}
