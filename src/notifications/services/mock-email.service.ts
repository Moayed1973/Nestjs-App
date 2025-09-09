import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../interfaces/email-service.interface';

@Injectable()
export class MockEmailService implements EmailService {
  private readonly logger = new Logger(MockEmailService.name);

  sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    this.logger.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
    this.logger.debug(`Email content preview: ${html.substring(0, 100)}...`);
    return Promise.resolve(true);
  }
}
