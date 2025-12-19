import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { RedirectUriAdminController } from './redirect-uri-admin.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [OAuthController, RedirectUriAdminController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
