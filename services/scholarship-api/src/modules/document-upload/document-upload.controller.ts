import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentUploadService } from './document-upload.service';

@ApiTags('Document Upload')
@Controller('document-upload')
export class DocumentUploadController {
  constructor(private readonly documentService: DocumentUploadService) {}

  @Get('applications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for document upload' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Upload applications retrieved successfully',
  })
  async getUploadApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('acyearId') acyearId?: number,
  ) {
    return this.documentService.getUploadApplications(
      mainCategory || '',
      key || '',
      acyearId ? Number(acyearId) : 0,
    );
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload document' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  async uploadDocument(@Body() uploadData: unknown) {
    return this.documentService.uploadDocument(
      uploadData as Parameters<typeof this.documentService.uploadDocument>[0],
    );
  }

  @Get('documents/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get documents for an application' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
  })
  async getApplicationDocuments(@Param('applicationId') applicationId: string) {
    return this.documentService.getApplicationDocuments(applicationId);
  }

  @Delete('document/:documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  async deleteDocument(@Param('documentId') documentId: number) {
    return this.documentService.deleteDocument(Number(documentId));
  }
}

