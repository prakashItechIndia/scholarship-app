import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from '../../database';
import { EmailModule } from '../email/email.module';
import { CognitoModule } from '../cognito/cognito.module';
import { CrmModule } from '../crm/crm.module';
import { EnvVars } from '../../config/env.validation';
import { AuditModule } from '../audit/audit.module';
import { AuthController } from './auth.controller';
import { JwksController } from './jwks.controller';
import { LogoutController } from './logout.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { FirebaseService } from '../shared/firebase.service';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    CognitoModule,
    CrmModule,
    AuditModule,
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvVars, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn:
            configService.get('JWT_EXPIRES_IN', { infer: true }) || '1h',
          issuer:
            configService.get('SSO_ISSUER', { infer: true }) ||
            'https://sso.icaptur.ai',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, JwksController, LogoutController],
  providers: [
    AuthService,
    SessionService,
    LocalStrategy,
    JwtStrategy,
    FirebaseService,
  ],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
