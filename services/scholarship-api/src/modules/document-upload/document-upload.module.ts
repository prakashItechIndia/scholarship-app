import { Module } from '@nestjs/common';
import { DocumentUploadController } from './document-upload.controller';
import { DocumentUploadService } from './document-upload.service';
import { DatabaseModule } from '../../database';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [DatabaseModule, FileStorageModule],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService],
  exports: [DocumentUploadService],
})
export class DocumentUploadModule {}

