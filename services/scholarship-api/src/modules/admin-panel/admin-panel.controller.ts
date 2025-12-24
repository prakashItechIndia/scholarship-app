import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdminPanelService, ApplicationRecord } from './admin-panel.service';

@ApiTags('Admin Panel')
@Controller('admin-panel')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Overview module' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'selectedStatusText', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  async getOverviewApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('selectedStatusText') selectedStatusText?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('acyearId') acyearId?: number,
  ): Promise<ApplicationRecord[]> {
    return this.adminPanelService.getOverviewApplications({
      mainCategory,
      key,
      selectedStatusText,
      fromDate,
      toDate,
      acyearId: acyearId ? Number(acyearId) : 0,
    });
  }

  @Get('process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Process/Documents module' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Process applications retrieved successfully',
  })
  async getProcessApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('acyearId') acyearId?: number,
  ): Promise<ApplicationRecord[]> {
    return this.adminPanelService.getProcessApplications({
      mainCategory,
      key,
      acyearId: acyearId ? Number(acyearId) : 0,
    });
  }

  @Get('suggest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Suggest module' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'selectedStatusText', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Suggest applications retrieved successfully',
  })
  async getSuggestApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('selectedStatusText') selectedStatusText?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('acyearId') acyearId?: number,
  ) {
    return this.adminPanelService.getSuggestApplications({
      mainCategory,
      key,
      selectedStatusText,
      fromDate,
      toDate,
      acyearId: acyearId ? Number(acyearId) : 0,
    });
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Verify module' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Verify applications retrieved successfully',
  })
  async getVerifyApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('acyearId') acyearId?: number,
  ): Promise<ApplicationRecord[]> {
    return this.adminPanelService.getVerifyApplications({
      mainCategory,
      key,
      acyearId: acyearId ? Number(acyearId) : 0,
    });
  }

  @Get('approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications for Approve module' })
  @ApiQuery({ name: 'mainCategory', required: false })
  @ApiQuery({ name: 'key', required: false })
  @ApiQuery({ name: 'acyearId', required: false, type: Number })
  @ApiQuery({ name: 'roleId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Approve applications retrieved successfully',
  })
  async getApproveApplications(
    @Query('mainCategory') mainCategory?: string,
    @Query('key') key?: string,
    @Query('acyearId') acyearId?: number,
    @Query('roleId') roleId?: number,
  ): Promise<ApplicationRecord[]> {
    return this.adminPanelService.getApproveApplications(
      {
        mainCategory,
        key,
        acyearId: acyearId ? Number(acyearId) : 0,
      },
      roleId ? Number(roleId) : 1,
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify document' })
  @ApiResponse({
    status: 200,
    description: 'Document verified successfully',
  })
  async verifyDocument(
    @Body()
    body: {
      applicationId: string;
      scholarshipId: number;
      isVerify: string;
      verifiedBy: number;
      remarks?: string;
    },
  ) {
    return this.adminPanelService.verifyDocument(
      body.applicationId,
      body.scholarshipId,
      body.isVerify,
      body.verifiedBy,
      body.remarks,
    );
  }

  @Post('suggest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suggest scholarship amount' })
  @ApiResponse({
    status: 200,
    description: 'Amount suggested successfully',
  })
  async suggestAmount(
    @Body()
    body: {
      applicationId: string;
      scholarshipId: number;
      suggestedAmount: number;
      suggestedBy: number;
      remarks?: string;
    },
  ) {
    return this.adminPanelService.suggestAmount(
      body.applicationId,
      body.scholarshipId,
      body.suggestedAmount,
      body.suggestedBy,
      body.remarks,
    );
  }

  @Post('approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve application' })
  @ApiResponse({
    status: 200,
    description: 'Application approved successfully',
  })
  async approveApplication(
    @Body()
    body: {
      applicationId: string;
      scholarshipId: number;
      approvedAmount: number;
      approvedBy: number;
      remarks?: string;
    },
  ) {
    return this.adminPanelService.approveApplication(
      body.applicationId,
      body.scholarshipId,
      body.approvedAmount,
      body.approvedBy,
      body.remarks,
    );
  }

  @Post('reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject application' })
  @ApiResponse({
    status: 200,
    description: 'Application rejected successfully',
  })
  async rejectApplication(
    @Body()
    body: {
      applicationId: string;
      scholarshipId: number;
      rejectedBy: number;
      remarks: string;
    },
  ) {
    return this.adminPanelService.rejectApplication(
      body.applicationId,
      body.scholarshipId,
      body.rejectedBy,
      body.remarks,
    );
  }

  @Post('issue-amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue scholarship amount' })
  @ApiResponse({
    status: 200,
    description: 'Amount issued successfully',
  })
  async issueAmount(
    @Body()
    body: {
      applicationId: string;
      scholarshipId: number;
      paymentMode: string;
      ddChequeNo?: string;
      ddChequeDate?: string;
      ddChequeInFavor?: string;
      issuedBy?: number;
      comments?: string;
    },
  ) {
    return this.adminPanelService.issueAmount(
      body.applicationId,
      body.scholarshipId,
      body.paymentMode,
      body.ddChequeNo,
      body.ddChequeDate,
      body.ddChequeInFavor,
      body.issuedBy,
      body.comments,
    );
  }

  @Get('previous-scholarship/:aadhaarId/:panId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get previous scholarship details by Aadhaar ID and PAN ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Previous scholarship details retrieved successfully',
  })
  async getPreviousScholarshipDetails(
    @Param('aadhaarId') aadhaarId: string,
    @Param('panId') panId: string,
  ) {
    return this.adminPanelService.getPreviousScholarshipDetails(
      aadhaarId,
      panId,
    );
  }
}
