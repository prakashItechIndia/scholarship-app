import {
  Controller,
  Get,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
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
  @ApiQuery({ name: 'issuedDate', required: false })
  @ApiQuery({ name: 'issuedType', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'intIssuedBy', required: false, type: Number })
  @ApiQuery({ name: 'strIssuedBy', required: false })
  @ApiResponse({
    status: 200,
    description: 'Scholarship issued report generated successfully',
  })
  async getScholarshipIssuedReport(
    @Query('academicYear') academicYear?: number,
    @Query('issuedDate') issuedDate?: string,
    @Query('issuedType') issuedType?: string,
    @Query('keyword') keyword?: string,
    @Query('intIssuedBy') intIssuedBy?: number,
    @Query('strIssuedBy') strIssuedBy?: string,
  ) {
    return this.reportsService.getScholarshipIssuedReport({
      academicYear: academicYear ? Number(academicYear) : undefined,
      issuedDate,
      issuedType,
      keyword,
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

  @Get('approved-form')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get approved form report' })
  @ApiQuery({ name: 'academicYear', required: false, type: Number })
  @ApiQuery({ name: 'applicationNo', required: false })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'mobileNumber', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiResponse({
    status: 200,
    description: 'Approved form report generated successfully',
  })
  async getApprovedFormReport(
    @Query('academicYear') academicYear?: number,
    @Query('applicationNo') applicationNo?: string,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
    @Query('mobileNumber') mobileNumber?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.reportsService.getApprovedFormReport({
      academicYear: academicYear ? Number(academicYear) : undefined,
      applicationNo,
      studentId,
      status,
      mobileNumber,
      keyword,
    });
  }

  @Get('approval-form/:applicationId/:scholarshipId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get approval form data for a specific application' })
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

  @Get('export/:reportType/:format')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export report to PDF, Excel, CSV, or Word' })
  @ApiQuery({ name: 'academicYear', required: false, type: Number })
  @ApiQuery({ name: 'appliedDate', required: false })
  @ApiQuery({ name: 'gender', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'issuedDate', required: false })
  @ApiQuery({ name: 'issuedType', required: false })
  @ApiQuery({ name: 'intIssuedBy', required: false, type: Number })
  @ApiQuery({ name: 'strIssuedBy', required: false })
  @ApiQuery({ name: 'applicationNo', required: false })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'mobileNumber', required: false })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  async exportReport(
    @Res() res: Response,
    @Param('reportType') reportType: 'categories' | 'scholarship-issued' | 'approved-form',
    @Param('format') format: 'pdf' | 'excel' | 'csv' | 'word',
    @Query('academicYear') academicYear?: number,
    @Query('appliedDate') appliedDate?: string,
    @Query('gender') gender?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
    @Query('issuedDate') issuedDate?: string,
    @Query('issuedType') issuedType?: string,
    @Query('intIssuedBy') intIssuedBy?: number,
    @Query('strIssuedBy') strIssuedBy?: string,
    @Query('applicationNo') applicationNo?: string,
    @Query('studentId') studentId?: string,
    @Query('mobileNumber') mobileNumber?: string,
  ) {
    // Build filters based on report type
    let filters: any = {};
    if (reportType === 'categories') {
      filters = {
        academicYear: academicYear ? Number(academicYear) : undefined,
        appliedDate,
        gender,
        status,
        keyword,
      };
    } else if (reportType === 'scholarship-issued') {
      filters = {
        academicYear: academicYear ? Number(academicYear) : undefined,
        issuedDate,
        issuedType,
        keyword,
        intIssuedBy: intIssuedBy ? Number(intIssuedBy) : undefined,
        strIssuedBy,
      };
    } else {
      filters = {
        academicYear: academicYear ? Number(academicYear) : undefined,
        applicationNo,
        studentId,
        status,
        mobileNumber,
        keyword,
      };
    }

    try {
      let buffer: Buffer;
      let contentType: string;
      let filename: string;

      const reportName =
        reportType === 'categories'
          ? 'CategoriesWiseReport'
          : reportType === 'scholarship-issued'
          ? 'ScholarshipIssuedReport'
          : 'ApprovedFormReport';

      if (format === 'pdf') {
        buffer = await this.reportsService.exportToPDF(reportType, filters);
        contentType = 'application/pdf';
        filename = `${reportName}.pdf`;
      } else if (format === 'excel') {
        buffer = await this.reportsService.exportToExcel(reportType, filters);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `${reportName}.xlsx`;
      } else if (format === 'csv') {
        const csvContent = await this.reportsService.exportToCSV(reportType, filters);
        buffer = Buffer.from(csvContent, 'utf-8');
        contentType = 'text/csv';
        filename = `${reportName}.csv`;
      } else if (format === 'word') {
        buffer = await this.reportsService.exportToWord(reportType, filters);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `${reportName}.docx`;
      } else {
        throw new BadRequestException('Invalid export format');
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length.toString());
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to export report: ${error.message}`);
    }
  }
}
