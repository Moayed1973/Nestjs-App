import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from './entities/user.entity';
import { ClientCompany } from 'src/clients/entities/client.entity';

@Module({
  imports: [
    PassportModule, // Enable Passport.js
    TypeOrmModule.forFeature([User, ClientCompany]), // Make User repository available
    JwtModule.registerAsync({
      // Configure JWT module
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy], // Register services and strategies
  controllers: [AuthController], // Register controller
  exports: [AuthService], // Make AuthService available to other modules
})
export class AuthModule {}

// export class AuthModule implements OnApplicationBootstrap {
//   constructor(private authService: AuthService) {}

//   // Create default users when application starts
//   async onApplicationBootstrap() {
//     await this.authService.seedUsers();
//   }
// }
