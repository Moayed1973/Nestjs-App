import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MySqlConfigService } from './database/mysql/mysql.config.service';
import { MongoDbConfigService } from './database/mongodb/mongodb.config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchesModule } from './matches/matches.module';
import { ResearchModule } from './research/research.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SeederModule } from './database/seeds/seeder.module';
import { SeederService } from './database/seeds/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: MySqlConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoDbConfigService,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    ResearchModule,
    AnalyticsModule,
    NotificationsModule,
    SchedulerModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, MySqlConfigService, MongoDbConfigService],
})
// export class AppModule {}
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap() {
    // Seed database on application start (development only)
    if (process.env.NODE_ENV === 'development') {
      try {
        await this.seederService.seed();
      } catch (error) {
        console.log('Seeding skipped or failed:', error.message);
      }
    }
  }
}
