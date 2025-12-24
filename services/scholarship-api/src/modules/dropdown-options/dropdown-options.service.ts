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
   * Get all countries
   */
  async getCountries(): Promise<DropdownOption[]> {
    try {
      // Try different possible table names
      const possibleTableNames = [
        'tbl_country_list',
        'TBL_COUNTRY_LIST',
        'tbl_Country_List',
      ];

      let result: { recordset: unknown[] } | undefined;
      let query: string;

      for (const tableName of possibleTableNames) {
        try {
          query = `
            SELECT Country_name as label, Country_ID as value
            FROM ${tableName}
            ORDER BY Country_name
          `;

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
        { value: '', label: '--Select Country--' },
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'Country_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'Country_name') ||
                getCaseInsensitiveValue(rowRecord, 'COUNTRY_NAME') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
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
   */
  private getCountriesFallback(): DropdownOption[] {
    return [
      { value: '', label: '--Select Country--' },
      { value: 'IN', label: 'India' },
      { value: 'US', label: 'United States' },
      { value: 'UK', label: 'United Kingdom' },
      // Add more common countries as needed
    ];
  }

  /**
   * Get states by country ID
   */
  async getStates(countryId?: string): Promise<DropdownOption[]> {
    try {
      // Try different possible table names
      const possibleTableNames = [
        'tbl_state_list',
        'TBL_STATE_LIST',
        'tbl_State_List',
      ];

      let result: { recordset: unknown[] } | undefined;
      let query: string;

      for (const tableName of possibleTableNames) {
        try {
          query = `
            SELECT State_name as label, State_ID as value
            FROM ${tableName}
          `;

          const params: Record<string, unknown> = {};

          if (countryId) {
            query += ` WHERE Country_ID = @countryId`;
            params.countryId = countryId;
          }

          query += ` ORDER BY State_name`;

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
        { value: '', label: '--Select State--' },
      ];

      if (result.recordset && result.recordset.length > 0) {
        for (const row of result.recordset) {
          const rowRecord = row as Record<string, unknown>;
          options.push({
            value: String(
              getCaseInsensitiveValue(rowRecord, 'State_ID') ||
                getCaseInsensitiveValue(rowRecord, 'value') ||
                '',
            ),
            label: String(
              getCaseInsensitiveValue(rowRecord, 'State_name') ||
                getCaseInsensitiveValue(rowRecord, 'label') ||
                '',
            ),
          });
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
      { value: '', label: '--Select State--' },
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
        { value: '', label: '--Select District--' },
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
      { value: '', label: '--Select District--' },
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
      { value: '', label: '--Select Community--' },
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
        { value: '', label: '--Select Caste--' },
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
      return [{ value: '', label: '--Select Caste--' }];
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
        { value: '', label: '--Select Occupation--' },
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
        { value: '', label: '--Select Occupation--' },
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
      { value: '', label: '--Select Annual Income--' },
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
        { value: '', label: '--Select Bank--' },
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
        { value: '', label: '--Select Bank--' },
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
        { value: '', label: '--Select Branch--' },
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
      return [{ value: '', label: '--Select Branch--' }];
    }
  }

  /**
   * Get applicant categories/types
   */
  async getApplicantCategories(): Promise<DropdownOption[]> {
    // Based on the old system: School, College, Research
    // Can be moved to database if needed
    return Promise.resolve([
      { value: '', label: '--Select Applicant Category--' },
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
}
