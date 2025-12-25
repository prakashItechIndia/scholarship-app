import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get categories wise report' })
  @ApiQuery({ name: 'academicYear', required: false, type: Number })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'amount', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'issuedTo', required: false })
  @ApiQuery({ name: 'sairamCategory', required: false })
  @ApiQuery({ name: 'institutionName', required: false })
  @ApiQuery({ name: 'parentOffice', required: false })
  @ApiQuery({ name: 'favourCategory', required: false })
  @ApiQuery({ name: 'favourGroup', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiResponse({
    status: 200,
    description: 'Categories report generated successfully',
  })
  async getCategoriesWiseReport(
    @Query('academicYear') academicYear?: number,
    @Query('mainCategory') mainCategory?: string,
    @Query('status') status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('amount') amount?: string,
    @Query('gender') gender?: string,
    @Query('issuedTo') issuedTo?: string,
    @Query('sairamCategory') sairamCategory?: string,
    @Query('institutionName') institutionName?: string,
    @Query('parentOffice') parentOffice?: string,
    @Query('favourCategory') favourCategory?: string,
    @Query('favourGroup') favourGroup?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.reportsService.getCategoriesWiseReport({
      academicYear: academicYear ? Number(academicYear) : undefined,
      mainCategory,
      status,
      fromDate,
      toDate,
      amount,
      gender,
      issuedTo,
      sairamCategory,
      institutionName,
      parentOffice,
      favourCategory,
      favourGroup,
      keyword,
    });
  }

  @Get('scholarship-issued')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get scholarship issued report' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'institutionId', required: false, type: Number })
  @ApiQuery({ name: 'strInstitution', required: false })
  @ApiQuery({ name: 'chequeInFavorType', required: false })
  @ApiQuery({ name: 'intIssuedBy', required: false, type: Number })
  @ApiQuery({ name: 'strIssuedBy', required: false })
  @ApiResponse({
    status: 200,
    description: 'Scholarship issued report generated successfully',
  })
  async getScholarshipIssuedReport(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('institutionId') institutionId?: number,
    @Query('strInstitution') strInstitution?: string,
    @Query('chequeInFavorType') chequeInFavorType?: string,
    @Query('intIssuedBy') intIssuedBy?: number,
    @Query('strIssuedBy') strIssuedBy?: string,
  ) {
    return this.reportsService.getScholarshipIssuedReport({
      fromDate,
      toDate,
      institutionId: institutionId ? Number(institutionId) : undefined,
      strInstitution,
      chequeInFavorType,
      intIssuedBy: intIssuedBy ? Number(intIssuedBy) : undefined,
      strIssuedBy,
    });
  }

  @Get('cheque-issued-by')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all cheque issued by options' })
  @ApiResponse({
    status: 200,
    description: 'Cheque issued by options retrieved successfully',
  })
  async getChequeIssuedBy() {
    return this.reportsService.getChequeIssuedBy();
  }

  @Get('approval-form/:applicationId/:scholarshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get approval form data' })
  @ApiResponse({
    status: 200,
    description: 'Approval form data retrieved successfully',
  })
  async getApprovalFormData(
    @Param('applicationId') applicationId: string,
    @Param('scholarshipId') scholarshipId: number,
  ) {
    return this.reportsService.getApprovalFormData(
      applicationId,
      Number(scholarshipId),
    );
  }

  @Get('academic-years')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all academic years' })
  @ApiResponse({
    status: 200,
    description: 'Academic years retrieved successfully',
  })
  async getAcademicYears() {
    return this.reportsService.getAcademicYears();
  }
}
