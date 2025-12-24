import { Module } from '@nestjs/common';
import { DocumentUploadController } from './document-upload.controller';
import { DocumentUploadService } from './document-upload.service';
import { DatabaseModule } from '../../database';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService],
  exports: [DocumentUploadService],
})
export class DocumentUploadModule {}

