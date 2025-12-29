import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload document with file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        applicationId: {
          type: 'string',
        },
        documentType: {
          type: 'string',
        },
        uploadedBy: {
          type: 'number',
        },
      },
      required: ['file', 'applicationId', 'documentType'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  async uploadDocumentFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('applicationId') applicationId: string,
    @Body('documentType') documentType: string,
    @Body('uploadedBy') uploadedBy?: number,
  ) {
    return this.documentService.uploadDocumentFile(
      applicationId,
      documentType,
      file,
      uploadedBy ? Number(uploadedBy) : undefined,
    );
  }

  @Post('upload-multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple documents' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        applicationId: {
          type: 'string',
        },
        documentTypes: {
          type: 'string',
          description: 'Comma-separated list of document types',
        },
        uploadedBy: {
          type: 'number',
        },
      },
      required: ['files', 'applicationId', 'documentTypes'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Documents uploaded successfully',
  })
  async uploadMultipleDocuments(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // 20MB per file
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
    @Body('applicationId') applicationId: string,
    @Body('documentTypes') documentTypes: string,
    @Body('uploadedBy') uploadedBy?: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
    if (!applicationId) {
      throw new BadRequestException('Application ID is required');
    }
    if (!documentTypes) {
      throw new BadRequestException('Document types are required');
    }
    
    const types = documentTypes.split(',').map((t) => t.trim());
    
    if (files.length !== types.length) {
      throw new BadRequestException(
        `Number of files (${files.length}) must match number of document types (${types.length})`,
      );
    }
    
    return this.documentService.uploadMultipleDocuments(
      applicationId,
      files,
      types,
      uploadedBy ? Number(uploadedBy) : undefined,
    );
  }

  @Post('upload-photo')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload student photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
        applicationId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Photo uploaded successfully',
  })
  async uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('applicationId') applicationId: string,
  ) {
    return this.documentService.uploadPhoto(applicationId, file);
  }

  @Post('upload-legacy')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload document (legacy - accepts path directly)' })
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
  @ApiQuery({ name: 'applicationId', required: false })
  @ApiQuery({ name: 'documentType', required: false })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  async deleteDocument(
    @Param('documentId') documentId: number,
    @Query('applicationId') applicationId?: string,
    @Query('documentType') documentType?: string,
  ) {
    return this.documentService.deleteDocument(Number(documentId), applicationId, documentType);
  }

  @Post('upload-medical-multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple medical documents (saves to MedicalDocuments folder)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        applicationId: {
          type: 'string',
        },
        documentTypes: {
          type: 'string',
          description: 'Comma-separated list of document types',
        },
        uploadedBy: {
          type: 'number',
        },
      },
      required: ['files', 'applicationId', 'documentTypes'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Medical documents uploaded successfully',
  })
  async uploadMultipleMedicalDocuments(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // 20MB per file
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
    @Body('applicationId') applicationId: string,
    @Body('documentTypes') documentTypes: string,
    @Body('uploadedBy') uploadedBy?: number,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
    if (!applicationId) {
      throw new BadRequestException('Application ID is required');
    }
    if (!documentTypes) {
      throw new BadRequestException('Document types are required');
    }
    
    const types = documentTypes.split(',').map((t) => t.trim());
    
    if (files.length !== types.length) {
      throw new BadRequestException(
        `Number of files (${files.length}) must match number of document types (${types.length})`,
      );
    }
    
    return this.documentService.uploadMultipleMedicalDocuments(
      applicationId,
      files,
      types,
      uploadedBy ? Number(uploadedBy) : undefined,
    );
  }

  @Get('document-types')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get standard document types list' })
  @ApiResponse({
    status: 200,
    description: 'Document types retrieved successfully',
  })
  async getDocumentTypes() {
    return {
      documentTypes: this.documentService.getStandardDocumentTypes(),
    };
  }

  @Get('view/:applicationId/:documentType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'View/download document file' })
  @ApiResponse({
    status: 200,
    description: 'Document file retrieved successfully',
    content: {
      'application/pdf': { schema: { type: 'string', format: 'binary' } },
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
      'image/png': { schema: { type: 'string', format: 'binary' } },
      'application/octet-stream': { schema: { type: 'string', format: 'binary' } },
    },
  })
  async viewDocument(
    @Res() res: Response,
    @Param('applicationId') applicationId: string,
    @Param('documentType') documentType: string,
  ) {
    try {
      const { buffer, contentType, filename } =
        await this.documentService.getDocumentFile(applicationId, documentType);

      // Set headers for file download/view
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour

      // Send file buffer
      res.send(buffer);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

