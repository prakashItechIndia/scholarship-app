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
  @ApiQuery({ name: 'appliedDate', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiResponse({
    status: 200,
    description: 'Categories report generated successfully',
  })
  async getCategoriesWiseReport(
    @Query('academicYear') academicYear?: number,
    @Query('appliedDate') appliedDate?: string,
    @Query('gender') gender?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.reportsService.getCategoriesWiseReport({
      academicYear: academicYear ? Number(academicYear) : undefined,
      appliedDate,
      gender,
      status,
      keyword,
    });
  }

  @Get('scholarship-issued')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get scholarship issued report' })
  @ApiQuery({ name: 'academicYear', required: false, type: Number })
  @ApiQuery({ name: 'appliedDate', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiResponse({
    status: 200,
    description: 'Scholarship issued report generated successfully',
  })
  async getScholarshipIssuedReport(
    @Query('academicYear') academicYear?: number,
    @Query('appliedDate') appliedDate?: string,
    @Query('gender') gender?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.reportsService.getScholarshipIssuedReport({
      academicYear: academicYear ? Number(academicYear) : undefined,
      appliedDate,
      gender,
      keyword,
    });
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

