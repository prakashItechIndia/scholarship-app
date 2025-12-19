import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  /**
   * GET example - Fetch data from SQL Server
   * Example: GET /sample/users
   */
  @Get('users')
  async getUsers() {
    return this.sampleService.getUsers();
  }

  /**
   * GET example with parameter
   * Example: GET /sample/users/123
   */
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.sampleService.getUserById(id);
  }

  /**
   * POST example - Insert data into SQL Server
   * Example: POST /sample/users
   * Body: { name: "John Doe", email: "john@example.com" }
   */
  @Post('users')
  async createUser(@Body() createUserDto: { name: string; email: string }) {
    return this.sampleService.createUser(createUserDto);
  }
}

