import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ScholarshipApplicationService } from './scholarship-application.service';

@ApiTags('Scholarship Application')
@Controller('scholarship-application')
export class ScholarshipApplicationController {
  constructor(
    private readonly applicationService: ScholarshipApplicationService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new scholarship application' })
  @ApiResponse({
    status: 201,
    description: 'Application registered successfully',
  })
  async register(@Body() registrationData: unknown) {
    return this.applicationService.saveRegistration(
      registrationData as Parameters<
        typeof this.applicationService.saveRegistration
      >[0],
    );
  }

  @Get('check-aadhaar/:aadhaarId/:scholarshipYearId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if Aadhaar ID already exists' })
  @ApiResponse({
    status: 200,
    description: 'Aadhaar ID check result',
  })
  async checkAadhaarId(
    @Param('aadhaarId') aadhaarId: string,
    @Param('scholarshipYearId') scholarshipYearId: number,
  ) {
    const count = await this.applicationService.checkAadhaarId(
      aadhaarId,
      Number(scholarshipYearId),
    );
    return { exists: count > 0, count };
  }

  @Get('check-pan/:panId/:scholarshipYearId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if PAN ID already exists' })
  @ApiResponse({
    status: 200,
    description: 'PAN ID check result',
  })
  async checkPanId(
    @Param('panId') panId: string,
    @Param('scholarshipYearId') scholarshipYearId: number,
  ) {
    const count = await this.applicationService.checkPanId(
      panId,
      Number(scholarshipYearId),
    );
    return { exists: count > 0, count };
  }

  @Get('application/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application by application ID' })
  @ApiQuery({ name: 'processType', required: false })
  @ApiQuery({ name: 'scholarshipId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Application retrieved successfully',
  })
  async getApplication(
    @Param('applicationId') applicationId: string,
    @Query('processType') processType?: string,
    @Query('scholarshipId') scholarshipId?: number,
  ) {
    return this.applicationService.getApplicationByApplicationId(
      applicationId,
      processType,
      scholarshipId ? Number(scholarshipId) : undefined,
    );
  }

  @Get('applications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applications by email' })
  @ApiQuery({ name: 'email', required: true })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  async getApplications(@Query('email') email: string) {
    return this.applicationService.getApplicationsByEmail(email);
  }

  @Get('check-email/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if email exists in the system' })
  @ApiResponse({
    status: 200,
    description: 'Email check result',
  })
  async checkEmailExists(@Param('email') email: string) {
    const exists = await this.applicationService.checkEmailExists(email);
    return { exists };
  }

  @Get('check-login-status/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check user login status (email exists and password set)',
  })
  @ApiResponse({
    status: 200,
    description: 'User login status',
  })
  async checkUserLoginStatus(@Param('email') email: string) {
    return this.applicationService.checkUserLoginStatus(email);
  }

  @Get('scholarship-year')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get active scholarship year settings' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship year retrieved successfully',
  })
  async getScholarshipYear() {
    return this.applicationService.getActiveScholarshipYear();
  }

  @Put('application/:applicationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update application' })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully',
  })
  async updateApplication(
    @Param('applicationId') applicationId: string,
    @Body() updateData: unknown,
  ) {
    return this.applicationService.updateApplication(
      applicationId,
      updateData as Parameters<
        typeof this.applicationService.updateApplication
      >[1],
    );
  }

  @Post('send-verification-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send verification email for new user onboarding' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
  })
  async sendVerificationEmail(@Body() body: { email: string }) {
    return this.applicationService.sendVerificationEmail(body.email);
  }

  @Get('verify-email-token/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email verification token' })
  @ApiResponse({
    status: 200,
    description: 'Token verification result',
  })
  async verifyEmailToken(@Param('token') token: string) {
    return this.applicationService.verifyEmailToken(token);
  }

  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set password for new user (onboarding completion)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password set successfully',
  })
  async setNewPassword(
    @Body() body: { email: string; password: string; token?: string },
  ) {
    return this.applicationService.setNewPassword(
      body.email,
      body.password,
      body.token,
    );
  }
}
