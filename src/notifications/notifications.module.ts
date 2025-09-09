import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './services/notifications.service';
import { MockEmailService } from './services/mock-email.service';
import { SmtpEmailService } from './services/smtp-email.service';
import { Match } from '../matches/entities/match.entity';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';

const emailServiceProvider: Provider = {
  provide: 'EmailService',
  useFactory: (configService: ConfigService) => {
    const useMock =
      configService.get('NODE_ENV') === 'development' ||
      !configService.get('SMTP_HOST');
    return useMock
      ? new MockEmailService()
      : new SmtpEmailService(configService);
  },
  inject: [ConfigService],
};

@Module({
  imports: [TypeOrmModule.forFeature([Match]), ProjectsModule, VendorsModule],
  providers: [
    NotificationsService,
    emailServiceProvider,
    MockEmailService,
    SmtpEmailService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
