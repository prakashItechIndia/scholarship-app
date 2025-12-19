import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SampleService {
  private readonly logger = new Logger(SampleService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * GET Example: Fetch all users using raw SQL query
   * This demonstrates how to SELECT data from SQL Server
   */
  async getUsers() {
    try {
      // Raw SQL query with parameterized query for safety
      const result = await this.db.query<{
        id: string;
        name: string;
        email: string;
        created_at: Date;
      }>('SELECT id, name, email, created_at FROM [users] ORDER BY created_at DESC');

      this.logger.log(`Retrieved ${result.recordset.length} users`);
      return {
        success: true,
        count: result.recordset.length,
        data: result.recordset,
      };
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  /**
   * GET Example: Fetch a single user by ID
   * This demonstrates parameterized queries to prevent SQL injection
   */
  async getUserById(id: string) {
    try {
      // Using parameterized query - @id is a SQL Server parameter
      const result = await this.db.query<{
        id: string;
        name: string;
        email: string;
        created_at: Date;
      }>('SELECT id, name, email, created_at FROM [users] WHERE id = @id', {
        id,
      });

      if (result.recordset.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        success: true,
        data: result.recordset[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching user ${id}`, error);
      throw error;
    }
  }

  /**
   * POST Example: Insert a new user
   * This demonstrates how to INSERT data into SQL Server
   */
  async createUser(createUserDto: { name: string; email: string }) {
    try {
      // Generate a new ID (you can use UUID or other ID generation)
      const id = this.generateId();

      // INSERT query with parameters
      const insertQuery = `
        INSERT INTO [users] (id, name, email, created_at)
        VALUES (@id, @name, @email, GETDATE())
      `;

      await this.db.query(insertQuery, {
        id,
        name: createUserDto.name,
        email: createUserDto.email,
      });

      this.logger.log(`Created user with ID: ${id}`);

      // Fetch the newly created user
      const result = await this.db.query<{
        id: string;
        name: string;
        email: string;
        created_at: Date;
      }>('SELECT id, name, email, created_at FROM [users] WHERE id = @id', {
        id,
      });

      return {
        success: true,
        message: 'User created successfully',
        data: result.recordset[0],
      };
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  /**
   * Helper method to generate a simple ID
   * In production, you might want to use UUID or database-generated IDs
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

