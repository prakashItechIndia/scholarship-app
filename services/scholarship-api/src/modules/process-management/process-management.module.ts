import { Module } from '@nestjs/common';
import { ProcessManagementController } from './process-management.controller';
import { ProcessManagementService } from './process-management.service';
import { DatabaseModule } from '../../database';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [DatabaseModule, FileStorageModule],
  controllers: [ProcessManagementController],
  providers: [ProcessManagementService],
  exports: [ProcessManagementService],
})
export class ProcessManagementModule {}

