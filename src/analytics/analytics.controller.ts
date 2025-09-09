import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserEntity } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CountryAnalytics } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  getTopVendors(@GetUser() user: UserEntity): Promise<CountryAnalytics[]> {
    return this.analyticsService.getTopVendorsByCountry(user);
  }
}
