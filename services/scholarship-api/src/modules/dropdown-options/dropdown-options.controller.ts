import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DropdownOptionsService } from './dropdown-options.service';

@ApiTags('Dropdown Options')
@Controller('dropdown-options')
export class DropdownOptionsController {
  constructor(private readonly dropdownService: DropdownOptionsService) {}

  @Get('countries')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Countries retrieved successfully',
  })
  async getCountries() {
    return this.dropdownService.getCountries();
  }

  @Get('states')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get states by country ID' })
  @ApiQuery({ name: 'countryId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'States retrieved successfully',
  })
  async getStates(@Query('countryId') countryId?: string) {
    return this.dropdownService.getStates(countryId);
  }

  @Get('districts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get districts by state ID' })
  @ApiQuery({ name: 'stateId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Districts retrieved successfully',
  })
  async getDistricts(@Query('stateId') stateId?: string) {
    return this.dropdownService.getDistricts(stateId);
  }

  @Get('communities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all communities' })
  @ApiResponse({
    status: 200,
    description: 'Communities retrieved successfully',
  })
  async getCommunities() {
    return this.dropdownService.getCommunities();
  }

  @Get('castes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get castes by community' })
  @ApiQuery({ name: 'community', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Castes retrieved successfully',
  })
  async getCastes(@Query('community') community?: string) {
    return this.dropdownService.getCastes(community);
  }

  @Get('occupations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all occupations' })
  @ApiResponse({
    status: 200,
    description: 'Occupations retrieved successfully',
  })
  async getOccupations() {
    return this.dropdownService.getOccupations();
  }

  @Get('annual-income-ranges')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get annual income ranges' })
  @ApiResponse({
    status: 200,
    description: 'Annual income ranges retrieved successfully',
  })
  async getAnnualIncomeRanges() {
    return this.dropdownService.getAnnualIncomeRanges();
  }

  @Get('bank-names')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all bank names' })
  @ApiResponse({
    status: 200,
    description: 'Bank names retrieved successfully',
  })
  async getBankNames() {
    return this.dropdownService.getBankNames();
  }

  @Get('bank-branches')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bank branches by bank ID' })
  @ApiQuery({ name: 'bankId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Bank branches retrieved successfully',
  })
  async getBankBranches(@Query('bankId') bankId?: string) {
    return this.dropdownService.getBankBranches(bankId);
  }

  @Get('applicant-categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get applicant categories' })
  @ApiResponse({
    status: 200,
    description: 'Applicant categories retrieved successfully',
  })
  async getApplicantCategories() {
    return this.dropdownService.getApplicantCategories();
  }

  @Get('degrees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get degree options by course and degree type' })
  @ApiResponse({
    status: 200,
    description: 'Degree options retrieved successfully',
  })
  async getDegrees(
    @Query('course') course: string,
    @Query('degreeType') degreeType: string,
  ) {
    return this.dropdownService.getDegrees(course, degreeType);
  }
}
