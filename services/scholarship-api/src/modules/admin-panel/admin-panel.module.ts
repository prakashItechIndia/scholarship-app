import { Module } from '@nestjs/common';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
  exports: [AdminPanelService],
})
export class AdminPanelModule {}

