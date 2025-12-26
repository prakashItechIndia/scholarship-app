import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Helper function to get a value from a database record case-insensitively
 * SQL Server can return column names in different cases (COUNTRY_NAME, Country_name, etc.)
 */
function getCaseInsensitiveValue<T = unknown>(
  record: Record<string, unknown>,
  fieldName: string,
): T | undefined {
  // Try exact match first
  if (fieldName in record) {
    return record[fieldName] as T;
  }

  // Try case-insensitive match
  const lowerFieldName = fieldName.toLowerCase();
  for (const key in record) {
    if (key.toLowerCase() === lowerFieldName) {
      return record[key] as T;
    }
  }

  return undefined;
}

@Injectable()
export class DropdownOptionsService {
  private readonly logger = new Logger(DropdownOptionsService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all countries from T_Country table
   */
  async getCountries(): Promise<DropdownOption[]> {
    try {
      // Try different possible table names (new table first, then fallback to old)
      const possibleTableNames = [
        'T_Country',
        'tbl_country_list',
        'TBL_COUNTRY_LIST',
        'tbl_Country_List',
      ];

      let result: { recordset: unknown[] } | undefined;
      let query: string;
      let isNewTable = false;

      for (const tableName of possibleTableNames) {
        try {
          // Check if it's the new T_Country table or old table
          if (tableName === 'T_Country') {
            isNewTable = true;
            query = `
              SELECT Country_Name as label, Id as value, Country_Code
              FROM T_Country
              WHERE Is_Deleted = 0 OR Is_Deleted IS NULL
              ORDER BY Country_Name
            `;
          } else {
            // Old table structure
            isNewTable = false;
            query = `
              SELECT Country_name as label, Country_ID as value, Country_Code
              FROM ${tableName}
              ORDER BY Country_name
            `;
          }

          result = (await this.db.execute('sp_ExecuteSql', {
            Statement: query,
          })) as { recordset: unknown[] };

          // If we get here, the query succeeded
          break;
        } catch {
          this.logger.warn(
            `Table ${tableName} not found, trying next option...`,
          );
          continue;
        }
      }

      // If all table names failed, use fallback
      if (!result) {
        this.logger.warn('Country table not found, using fallback options');
        return this.getCountriesFallback();
      }

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        // Filter by India: for new table check Country_Name or Country_Code, for old table check Country_Code
        const data = result.recordset.filter((row) => {
          const rowRecord = row as Record<string, unknown>;
          if (isNewTable) {
            const countryName =
              getCaseInsensitiveValue<string>(rowRecord, 'Country_Name') || '';
            const countryCode =
              getCaseInsensitiveValue<string>(rowRecord, 'Country_Code') || '';
            return (
              countryName.toLowerCase() === 'india' || countryCode === 'IN'
            );
          } else {
            const countryCode =
              getCaseInsensitiveValue<string>(rowRecord, 'Country_Code') || '';
            return countryCode === 'IN';
          }
        });

        for (const row of data) {
          const rowRecord = row as Record<string, unknown>;
          // Try new table structure first (Id, Country_Name), then old structure
          const value =
            getCaseInsensitiveValue<string>(rowRecord, 'Id') ||
            getCaseInsensitiveValue<string>(rowRecord, 'Country_ID') ||
            getCaseInsensitiveValue<string>(rowRecord, 'value') ||
            '';
          const label =
            getCaseInsensitiveValue<string>(rowRecord, 'Country_Name') ||
            getCaseInsensitiveValue<string>(rowRecord, 'Country_name') ||
            getCaseInsensitiveValue<string>(rowRecord, 'COUNTRY_NAME') ||
            getCaseInsensitiveValue<string>(rowRecord, 'label') ||
            '';

          if (value && label) {
            options.push({
              value: String(value),
              label: String(label),
            });
          }
        }
      }

      return options;
    } catch (error) {
      this.logger.error('Error fetching countries', error);
      this.logger.warn('Using fallback countries list');
      return this.getCountriesFallback();
    }
  }

  /**
   * Fallback countries list
   * Note: Based on T_Country table structure, Id is int (1, 3, 4, etc.)
   * India has Id = 1 in the database
   */
  private getCountriesFallback(): DropdownOption[] {
    return [
      { value: '1', label: 'India' }, // India has Id = 1 in T_Country table
      { value: '3', label: 'Albania' },
      { value: '4', label: 'Algeria' },
      // Add more countries as needed
      // Note: These IDs must match what's stored in the T_Country.Id column
    ];
  }

  /**
   * Get states by country ID from T_State table
   */
  async getStates(countryId?: string): Promise<DropdownOption[]> {
    try {
      // Try different possible table names (new table first, then fallback to old)
      const possibleTableNames = [
        'T_State',
        'tbl_state_list',
        'TBL_STATE_LIST',
        'tbl_State_List',
      ];

      let result: { recordset: unknown[] } | undefined;
      let query: string;

      for (const tableName of possibleTableNames) {
        try {
          // Check if it's the new T_State table or old table
          if (tableName === 'T_State') {
            query = `
              SELECT State_Name as label, Id as value
              FROM T_State
              WHERE (Is_Deleted = 0 OR Is_Deleted IS NULL)
            `;
          } else {
            // Old table structure
            query = `
              SELECT State_name as label, State_ID as value
              FROM ${tableName}
            `;
          }

          const params: Record<string, unknown> = {};

          if (countryId) {
            if (tableName === 'T_State') {
              query += ` AND Country_Id = @countryId`;
            } else {
              query += ` WHERE Country_ID = @countryId`;
            }
            params.countryId = countryId;
          } else if (tableName !== 'T_State') {
            // For old tables, add WHERE if countryId is not provided
            query += ` WHERE 1=1`;
          }

          query += ` ORDER BY State_Name, State_name`;

          result = (await this.db.execute('sp_ExecuteSql', {
            Statement: query,
            ...params,
          })) as { recordset: unknown[] };

          // If we get here, the query succeeded
          break;
        } catch {
          this.logger.warn(
            `Table ${tableName} not found, trying next option...`,
          );
          continue;
        }
      }

      // If all table names failed, use fallback
      if (!result) {
        this.logger.warn('State table not found, using fallback options');
        return this.getStatesFallback();
      }

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          // Try new table structure first (Id, State_Name), then old structure
          const value =
            getCaseInsensitiveValue<string>(rowRecord, 'Id') ||
            getCaseInsensitiveValue<string>(rowRecord, 'State_ID') ||
            getCaseInsensitiveValue<string>(rowRecord, 'value') ||
            '';
          const label =
            getCaseInsensitiveValue<string>(rowRecord, 'State_Name') ||
            getCaseInsensitiveValue<string>(rowRecord, 'State_name') ||
            getCaseInsensitiveValue<string>(rowRecord, 'STATE_NAME') ||
            getCaseInsensitiveValue<string>(rowRecord, 'label') ||
            '';

          if (value && label) {
            options.push({
              value: String(value),
              label: String(label),
            });
          }
        }
      }

      return options;
    } catch (error) {
      this.logger.error('Error fetching states', error);
      this.logger.warn('Using fallback states list');
      return this.getStatesFallback();
    }
  }

  /**
   * Fallback states list (for India)
   */
  private getStatesFallback(): DropdownOption[] {
    return [
      { value: 'TN', label: 'Tamil Nadu' },
      { value: 'KA', label: 'Karnataka' },
      { value: 'AP', label: 'Andhra Pradesh' },
      { value: 'KL', label: 'Kerala' },
      { value: 'MH', label: 'Maharashtra' },
      { value: 'DL', label: 'Delhi' },
      { value: 'WB', label: 'West Bengal' },
      { value: 'GJ', label: 'Gujarat' },
      { value: 'RJ', label: 'Rajasthan' },
      { value: 'UP', label: 'Uttar Pradesh' },
      // Add more states as needed
    ];
  }

  /**
   * Get districts by state ID
   */
  async getDistricts(stateId?: string): Promise<DropdownOption[]> {
    try {
      // Try different possible table names
      const possibleTableNames = [
        'tbl_district_list',
        'TBL_DISTRICT_LIST',
        'tbl_District_List',
      ];

      let result: { recordset: unknown[] } | undefined;
      let query: string;

      for (const tableName of possibleTableNames) {
        try {
          query = `
            SELECT District_name as label, District_ID as value
            FROM ${tableName}
          `;

          const params: Record<string, unknown> = {};

          if (stateId) {
            query += ` WHERE State_ID = @stateId`;
            params.stateId = stateId;
          }

          query += ` ORDER BY District_name`;

          result = (await this.db.execute('sp_ExecuteSql', {
            Statement: query,
            ...params,
          })) as { recordset: unknown[] };

          // If we get here, the query succeeded
          break;
        } catch {
          this.logger.warn(
            `Table ${tableName} not found, trying next option...`,
          );
          continue;
        }
      }

      // If all table names failed, use fallback
      if (!result) {
        this.logger.warn('District table not found, using fallback options');
        return this.getDistrictsFallback();
      }

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'District_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'District_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
        }
      }

      return options;
    } catch (error) {
      this.logger.error('Error fetching districts', error);
      this.logger.warn('Using fallback districts list');
      return this.getDistrictsFallback();
    }
  }

  /**
   * Fallback districts list
   */
  private getDistrictsFallback(): DropdownOption[] {
    return [
      { value: 'CH', label: 'Chennai' },
      { value: 'KP', label: 'Kancheepuram' },
      { value: 'TV', label: 'Tiruvallur' },
      { value: 'VE', label: 'Vellore' },
      { value: 'CO', label: 'Coimbatore' },
      { value: 'MA', label: 'Madurai' },
      // Add more districts as needed
    ];
  }
  /**
   * Get communities (hardcoded based on old system)
   */
  getCommunities(): Promise<DropdownOption[]> {
    return Promise.resolve([
      { value: 'OC', label: 'OC' },
      { value: 'BC', label: 'BC' },
      { value: 'BCM', label: 'BCM' },
      { value: 'MBC', label: 'MBC' },
      { value: 'SC', label: 'SC' },
      { value: 'SCA', label: 'SCA' },
      { value: 'ST', label: 'ST' },
    ]);
  }

  /**
   * Get castes (check if there's a table, otherwise return empty)
   */
  async getCastes(community?: string): Promise<DropdownOption[]> {
    try {
      // Try to fetch from database table if exists
      let query = `
        SELECT Caste_name as label, Caste_ID as value
        FROM tbl_caste_list
      `;

      const params: Record<string, unknown> = {};

      if (community) {
        query += ` WHERE Community = @community`;
        params.community = community;
      }

      query += ` ORDER BY Caste_name`;

      const result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
        ...params,
      });

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'Caste_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'Caste_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
        }
      }

      return options;
    } catch {
      // If table doesn't exist, return empty options
      this.logger.warn('Caste table may not exist, returning empty options');
      return [];
    }
  }

  /**
   * Get occupations
   */
  async getOccupations(): Promise<DropdownOption[]> {
    try {
      const query = `
        SELECT Occupation_name as label, Occupation_ID as value
        FROM tbl_occupation_list
        ORDER BY Occupation_name
      `;

      const result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
      });

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'Occupation_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'Occupation_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
        }
      } else {
        // Fallback to common occupations if table doesn't exist
        options.push(
          { value: 'government', label: 'Government Service' },
          { value: 'private', label: 'Private Sector' },
          { value: 'business', label: 'Business / Self Employed' },
          { value: 'agriculture', label: 'Agriculture' },
          {
            value: 'professional',
            label: 'Professional (Doctor, Lawyer, etc.)',
          },
          { value: 'retired', label: 'Retired' },
          { value: 'homemaker', label: 'Homemaker' },
          { value: 'others', label: 'Others' },
        );
      }

      return options;
    } catch {
      this.logger.warn(
        'Occupation table may not exist, using fallback options',
      );
      return [
        { value: 'government', label: 'Government Service' },
        { value: 'private', label: 'Private Sector' },
        { value: 'business', label: 'Business / Self Employed' },
        { value: 'agriculture', label: 'Agriculture' },
        {
          value: 'professional',
          label: 'Professional (Doctor, Lawyer, etc.)',
        },
        { value: 'retired', label: 'Retired' },
        { value: 'homemaker', label: 'Homemaker' },
        { value: 'others', label: 'Others' },
      ];
    }
  }

  /**
   * Get annual income ranges
   */
  getAnnualIncomeRanges(): Promise<DropdownOption[]> {
    // Based on common income ranges, can be moved to database if needed
    return Promise.resolve([
      { value: '0', label: 'No Income' },
      { value: '50000', label: 'Up to 50,000' },
      { value: '100000', label: '50,000 - 1,00,000' },
      { value: '150000', label: '1,00,000 - 1,50,000' },
      { value: '200000', label: '1,50,000 - 2,00,000' },
      { value: '250000', label: '2,00,000 - 2,50,000' },
      { value: '300000', label: '2,50,000 - 3,00,000' },
      { value: '400000', label: '3,00,000 - 4,00,000' },
      { value: '500000', label: '4,00,000 - 5,00,000' },
      { value: '600000', label: '5,00,000 - 6,00,000' },
      { value: '800000', label: '6,00,000 - 8,00,000' },
      { value: '1000000', label: '8,00,000 - 10,00,000' },
      { value: '1500000', label: '10,00,000 - 15,00,000' },
      { value: '2000000', label: 'Above 15,00,000' },
    ]);
  }

  /**
   * Get bank names
   */
  async getBankNames(): Promise<DropdownOption[]> {
    try {
      const query = `
        SELECT Bank_name as label, Bank_ID as value
        FROM tbl_bank_list
        ORDER BY Bank_name
      `;

      const result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
      });

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'Bank_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'Bank_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
        }
      } else {
        // Fallback to common banks if table doesn't exist
        options.push(
          { value: 'sbi', label: 'State Bank of India' },
          { value: 'hdfc', label: 'HDFC Bank' },
          { value: 'icici', label: 'ICICI Bank' },
          { value: 'iob', label: 'Indian Overseas Bank' },
          { value: 'pnb', label: 'Punjab National Bank' },
          { value: 'bob', label: 'Bank of Baroda' },
          { value: 'canara', label: 'Canara Bank' },
          { value: 'axis', label: 'Axis Bank' },
        );
      }

      return options;
    } catch {
      this.logger.warn('Bank table may not exist, using fallback options');
      return [
        { value: 'sbi', label: 'State Bank of India' },
        { value: 'hdfc', label: 'HDFC Bank' },
        { value: 'icici', label: 'ICICI Bank' },
        { value: 'iob', label: 'Indian Overseas Bank' },
        { value: 'pnb', label: 'Punjab National Bank' },
        { value: 'bob', label: 'Bank of Baroda' },
        { value: 'canara', label: 'Canara Bank' },
        { value: 'axis', label: 'Axis Bank' },
      ];
    }
  }

  /**
   * Get bank branches by bank ID
   */
  async getBankBranches(bankId?: string): Promise<DropdownOption[]> {
    try {
      let query = `
        SELECT Branch_name as label, Branch_ID as value
        FROM tbl_bank_branch_list
      `;

      const params: Record<string, unknown> = {};

      if (bankId) {
        query += ` WHERE Bank_ID = @bankId`;
        params.bankId = bankId;
      }

      query += ` ORDER BY Branch_name`;

      const result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
        ...params,
      });

      const options: DropdownOption[] = [
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'Branch_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'Branch_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
        }
      }

      return options;
    } catch {
      this.logger.warn(
        'Bank branch table may not exist, returning empty options',
      );
      return [];
    }
  }

  /**
   * Get applicant categories/types
   */
  async getApplicantCategories(): Promise<DropdownOption[]> {
    // Based on the old system: School, College, Research
    // Can be moved to database if needed
    return Promise.resolve([
      {
        value: 'Research',
        label: 'I am a Research Scholar seeking Scholarship',
      },
      {
        value: 'College',
        label: 'I am a College Student seeking Scholarship',
      },
      {
        value: 'School',
        label: 'I am a School Student seeking Scholarship',
      },
      {
        value: 'Medical',
        label: 'I am a Medical Student seeking Scholarship',
      },
    ]);
  }

  /**
   * Get degree options based on course and degree type
   */
  async getDegrees(
    course: string,
    degreeType: string,
  ): Promise<DropdownOption[]> {
    try {
      const query = `
        SELECT Degree
        FROM t_Course_Type
        WHERE Course = @course AND DegreeType = @degreeType
        ORDER BY Degree
      `;

      const result = await this.db.query(query, {
        course,
        degreeType,
      });

      const degrees: DropdownOption[] = [{ value: '', label: '..Select..' }];

      if (result.recordset && result.recordset.length > 0) {
        result.recordset.forEach((row: unknown) => {
          const rowRecord = row as Record<string, unknown>;
          const degree = getCaseInsensitiveValue<string>(rowRecord, 'Degree');
          if (degree) {
            degrees.push({ value: degree, label: degree });
          }
        });
      }

      return degrees;
    } catch (error) {
      this.logger.error('Error fetching degrees', error);
      // Return fallback options
      return [
        { value: '', label: '..Select..' },
        { value: 'B.C.S', label: 'B.C.S' },
        { value: 'B.Sc', label: 'B.Sc' },
        { value: 'B.A', label: 'B.A' },
        { value: 'B.Com', label: 'B.Com' },
        { value: 'B.E', label: 'B.E' },
        { value: 'B.Tech', label: 'B.Tech' },
        { value: 'M.Sc', label: 'M.Sc' },
        { value: 'M.A', label: 'M.A' },
        { value: 'M.Com', label: 'M.Com' },
        { value: 'M.E', label: 'M.E' },
        { value: 'M.Tech', label: 'M.Tech' },
      ];
    }
  }
}
