import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { ProcessManagementService } from './process-management.service';

@ApiTags('Process Management')
@Controller('process-management')
export class ProcessManagementController {
  constructor(private readonly processService: ProcessManagementService) {}

  @Get('applications/overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Overview tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'selectedStatusText', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getOverviewApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('selectedStatusText') selectedStatusText?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getOverviewApplications({
      mainCategory,
      key,
      selectedStatusText,
      fromDate,
      toDate,
      academicYearId,
      tab: 'overview',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Get('applications/documents')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Documents tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getDocumentsApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getDocumentsApplications({
      mainCategory,
      key,
      academicYearId,
      tab: 'documents',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Get('applications/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Verify tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getVerifyApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getVerifyApplications({
      mainCategory,
      key,
      academicYearId,
      tab: 'verify',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Get('applications/suggest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Suggest tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getSuggestApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getSuggestApplications({
      mainCategory,
      key,
      academicYearId,
      tab: 'suggest',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Get('applications/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Approve tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getApproveApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getApproveApplications({
      mainCategory,
      key,
      academicYearId,
      tab: 'approve',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Get('applications/issue-amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Issue Amount tab' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getIssueAmountApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('academicYearId', new ParseIntPipe({ optional: true }))
    academicYearId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.processService.getIssueAmountApplications({
      mainCategory,
      key,
      academicYearId,
      tab: 'issue-amount',
      page,
      pageSize,
      sortField,
      sortOrder,
    });
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify application' })
  @ApiResponse({
    status: 200,
    description: 'Application verified successfully',
  })
  async verifyApplication(@Body() data: unknown) {
    return this.processService.verifyApplication(
      data as Parameters<typeof this.processService.verifyApplication>[0],
    );
  }

  @Post('suggest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suggest amount for application' })
  @ApiResponse({ status: 200, description: 'Amount suggested successfully' })
  async suggestAmount(@Body() data: unknown) {
    return this.processService.suggestAmount(
      data as Parameters<typeof this.processService.suggestAmount>[0],
    );
  }

  @Post('approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve or reject application' })
  @ApiResponse({
    status: 200,
    description: 'Application approved/rejected successfully',
  })
  async approveApplication(@Body() data: unknown) {
    return this.processService.approveApplication(
      data as Parameters<typeof this.processService.approveApplication>[0],
    );
  }

  @Post('issue-amount')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('documents', 5)) // Allow up to 5 files
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Issue amount for approved application' })
  @ApiResponse({ status: 200, description: 'Amount issued successfully' })
  async issueAmount(
    @Body() body: Record<string, unknown>,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Parse form data - convert string numbers to numbers where needed
    const data: Parameters<typeof this.processService.issueAmount>[0] = {
      applicationId: String(body.applicationId || ''),
      scholarshipId: body.scholarshipId ? Number(body.scholarshipId) : undefined,
      paymentMode: String(body.paymentMode || ''),
      comments: body.comments ? String(body.comments) : undefined,
      ddChequeNo: body.ddChequeNo ? String(body.ddChequeNo) : undefined,
      ddChequeInFavor: body.ddChequeInFavor ? String(body.ddChequeInFavor) : undefined,
      ddChequeDate: body.ddChequeDate ? String(body.ddChequeDate) : undefined,
      ddChequeInFavorType: body.ddChequeInFavorType ? String(body.ddChequeInFavorType) : undefined,
      ddChequeInstitutionId: body.ddChequeInstitutionId ? Number(body.ddChequeInstitutionId) : undefined,
      ddChequeOtherInstitution: body.ddChequeOtherInstitution ? String(body.ddChequeOtherInstitution) : undefined,
      ddChequeIssuedBy: body.ddChequeIssuedBy ? Number(body.ddChequeIssuedBy) : undefined,
      scholarshipIssuedDate: body.scholarshipIssuedDate ? String(body.scholarshipIssuedDate) : undefined,
      bankName: body.bankName ? String(body.bankName) : undefined,
      branchDetails: body.branchDetails ? String(body.branchDetails) : undefined,
      issuedBy: body.issuedBy ? Number(body.issuedBy) : undefined,
    };
    
    return this.processService.issueAmount(data, files);
  }

  @Get('history/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application history (View History)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'getAllRecords', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Application history retrieved successfully' })
  async getApplicationHistory(
    @Param('applicationId') applicationId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('getAllRecords') getAllRecords?: string,
  ) {
    const getAll = getAllRecords === 'true' || getAllRecords === '1';
    return this.processService.getApplicationHistory(
      applicationId,
      page,
      pageSize,
      getAll,
    );
  }

  @Get('scholarship-history/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get scholarship history (Previous Scholarship History)' })
  @ApiResponse({ status: 200, description: 'Scholarship history retrieved successfully' })
  async getScholarshipHistory(@Param('applicationId') applicationId: string) {
    return this.processService.getScholarshipHistory(applicationId);
  }

  @Get('scholarship-pdf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get merged scholarship PDF with cheque image',
    description:
      'Generates a PDF with: Top section (dynamic application data), Center section (uploaded cheque image), Bottom section (payment summary)',
  })
  @ApiQuery({ name: 'applicationId', required: true })
  @ApiQuery({ name: 'scholarshipId', required: true })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    content: {
      'application/pdf': {},
    },
  })
  async getMergedScholarshipPDF(
    @Query('applicationId') applicationId: string,
    @Query('scholarshipId') scholarshipId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.processService.generateMergedScholarshipPDF(
      applicationId,
      scholarshipId,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="scholarship_${applicationId}_${scholarshipId}.pdf"`,
    );
    res.send(pdfBuffer);
  }
}
