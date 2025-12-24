import { Module } from '@nestjs/common';
import { ProcessManagementController } from './process-management.controller';
import { ProcessManagementService } from './process-management.service';

@Module({
  controllers: [ProcessManagementController],
  providers: [ProcessManagementService],
  exports: [ProcessManagementService],
})
export class ProcessManagementModule {}

