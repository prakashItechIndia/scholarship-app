import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('financial-summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get financial summary for dashboard' })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Financial summary retrieved successfully',
  })
  async getFinancialSummary(@Query('academicYearId') academicYearId?: number) {
    return this.dashboardService.getFinancialSummary(
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('application-analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application analytics' })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Application analytics retrieved successfully',
  })
  async getApplicationAnalytics(@Query('academicYearId') academicYearId?: number) {
    return this.dashboardService.getApplicationAnalytics(
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('recent-applications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get recent applications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Recent applications retrieved successfully',
  })
  async getRecentApplications(
    @Query('limit') limit?: number,
    @Query('academicYearId') academicYearId?: number,
  ) {
    return this.dashboardService.getRecentApplications(
      limit ? Number(limit) : 10,
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('application-activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application activity by month' })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Application activity retrieved successfully',
  })
  async getApplicationActivityByMonth(@Query('academicYearId') academicYearId?: number) {
    return this.dashboardService.getApplicationActivityByMonth(
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('program-distribution')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get scholarship program distribution' })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Program distribution retrieved successfully',
  })
  async getScholarshipProgramDistribution(@Query('academicYearId') academicYearId?: number) {
    return this.dashboardService.getScholarshipProgramDistribution(
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('application-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application status breakdown by month' })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Application status retrieved successfully',
  })
  async getApplicationStatusByMonth(
    @Query('month') month?: string,
    @Query('academicYearId') academicYearId?: number,
  ) {
    return this.dashboardService.getApplicationStatusByMonth(
      month,
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('recent-activities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
  })
  async getRecentActivities(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentActivities(
      limit ? Number(limit) : 5,
    );
  }

  @Get('performance-metrics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics retrieved successfully',
  })
  async getPerformanceMetrics(@Query('academicYearId') academicYearId?: number) {
    return this.dashboardService.getPerformanceMetrics(
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('fund-spending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get fund spending data' })
  @ApiQuery({ name: 'yearRange', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Fund spending data retrieved successfully',
  })
  async getFundSpending(
    @Query('yearRange') yearRange?: string,
    @Query('academicYearId') academicYearId?: number,
  ) {
    return this.dashboardService.getFundSpending(
      yearRange,
      academicYearId ? Number(academicYearId) : undefined,
    );
  }

  @Get('calendar-events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'academicYearId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Calendar events retrieved successfully',
  })
  async getCalendarEvents(
    @Query('month') month?: string,
    @Query('academicYearId') academicYearId?: number,
  ) {
    return this.dashboardService.getCalendarEvents(
      month,
      academicYearId ? Number(academicYearId) : undefined,
    );
  }
}

