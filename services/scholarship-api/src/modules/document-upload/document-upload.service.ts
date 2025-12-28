import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { DatabaseService } from '../../database/database.service';
import { FileStorageService, DocumentType } from '../file-storage/file-storage.service';
import type { EnvVars } from '../../config/env.validation';

interface DocumentUploadData {
  applicationId: string;
  documentType: string;
  documentPath: string;
  uploadedBy?: number;
}

/**
 * Helper function to convert 1/0 or '1'/'0' to boolean
 */
function toBoolean(value: unknown): boolean {
  return value === 1 || value === '1' || value === true || String(value).toLowerCase() === 'true';
}

/**
 * Helper function to map boolean fields in query results
 */
function mapBooleanFields(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const booleanFields = [
    'ReUploadLinkEnable',
    'UploadLinkEnable',
    'lblApproved',
  ];

  return rows.map((row) => {
    const mappedRow = { ...row };
    booleanFields.forEach((field) => {
      if (field in mappedRow) {
        mappedRow[field] = toBoolean(mappedRow[field]);
      }
    });
    return mappedRow;
  });
}

@Injectable()
export class DocumentUploadService {
  private readonly logger = new Logger(DocumentUploadService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly fileStorage: FileStorageService,
    private readonly configService: ConfigService<EnvVars, true>,
  ) {}

  /**
   * Get applications for document upload
   * Matches GetUploadData from AjaxUploadDocument.aspx.cs
   */
  async getUploadApplications(
    mainCategory: string,
    key: string,
    acyearId: number,
  ) {
    try {
      let query = `
        SELECT
          R.Sch_Year, R.Scholarship_For, R.Application_Id, R.Applicant_Type,
          R.Student_ID, R.Applicant_Name, R.Guardian_Name, R.Father_Name, R.Aadhaar_ID,
          R.Father_Occupation, R.Father_OfficeName, R.Mother_Name,
          R.Mother_Occupation, R.Mother_OfficeName, R.Address_Line1, R.Address_Line2, R.City,
          R.PinCode, R.State, R.District, R.Country, R.Mobile_Number, R.Email, R.Date_Of_Birth,
          R.Gender, R.Community, R.Caste, R.Class_Studying, R.Board_Of_Studying, R.Type_Of_Institution,
          R.Cource_Of_Studying, R.Degree_Type, R.Degree, R.Other_Degree, R.Ph_D, R.Specialization,
          R.Institution_Name, R.University, R.Current_Year, R.Current_Semester,
          R.Father_AnnualIncome, R.Bank_Account_Number, R.Bank_Name, R.Bank_Branch,
          R.IFSC_Code,
          P.Scholarship_Issued_AccNo, P.User_ID, P.Status, P.Update_Date, P.Scholarship_Id,
          CASE P.IsUpload_Status
            WHEN '0' THEN 0
            WHEN '1' THEN 1
            WHEN '2' THEN 0
            ELSE 0
          END as ReUploadLinkEnable,
          CASE P.IsUpload_Status
            WHEN '0' THEN 0
            WHEN '1' THEN 0
            WHEN '2' THEN 1
            ELSE 0
          END as UploadLinkEnable,
          CASE P.IsUpload_Status
            WHEN '0' THEN 1
            WHEN '1' THEN 0
            WHEN '2' THEN 0
            ELSE 0
          END as lblApproved
        FROM t_Registration R
        JOIN t_Registration_Process as P ON P.Application_Id = R.Application_Id,
        T_Scholarship_Year SY
        WHERE P.Status IN ('Registered')
      `;

      const params: Record<string, unknown> = {};

      if (mainCategory === 'Application No') {
        query += ` AND R.Application_Id LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Name') {
        query += ` AND R.Applicant_Name LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Mobile No') {
        query += ` AND R.Mobile_Number LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Student Id') {
        query += ` AND R.Student_ID LIKE @key`;
        params.key = `%${key}%`;
      } else if (mainCategory === 'Aadhaar ID') {
        query += ` AND R.Aadhaar_ID LIKE @key`;
        params.key = `%${key}%`;
      }

      if (acyearId !== 0) {
        query += ` AND SY.ScholarshipYear_Id = R.Scholarship_Year_Id AND R.Scholarship_Year_Id = @acyearId`;
        params.acyearId = acyearId;
      }

      query += ` ORDER BY UploadLinkEnable DESC`;

      const result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
      });

      return mapBooleanFields((result.recordset || []) as Record<string, unknown>[]);
    } catch (error) {
      this.logger.error('Error fetching upload applications', error);
      throw new BadRequestException('Failed to fetch upload applications');
    }
  }

  /**
   * Get Registration ID from Application ID
   */
  private async getRegistrationId(applicationId: string): Promise<number> {
    try {
      const result = await this.db.execute('USP_GET_REgistreation_Id', {
        Application_Id: applicationId,
      });

      // Handle different return formats from stored procedure
      let registrationId: number | undefined;

      if (result.recordset && result.recordset.length > 0) {
        const firstRow = result.recordset[0] as Record<string, unknown>;
        // Try different possible column names
        registrationId =
          (firstRow.Registration_ID as number) ||
          (firstRow.RegistrationId as number) ||
          (firstRow.ID as number) ||
          (firstRow.Id as number) ||
          (Object.values(firstRow)[0] as number);
      } else if (result.output && Object.keys(result.output).length > 0) {
        registrationId = Object.values(result.output)[0] as number;
      }

      if (!registrationId || registrationId === 0) {
        this.logger.warn(
          `Registration ID not found for Application ID: ${applicationId}`,
        );
        throw new BadRequestException(
          `Registration ID not found for Application ID: ${applicationId}`,
        );
      }

      return Number(registrationId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error getting registration ID', error);
      throw new BadRequestException('Failed to get registration ID');
    }
  }

  /**
   * Upload document with file
   */
  async uploadDocumentFile(
    applicationId: string,
    documentType: string,
    file: Express.Multer.File,
    uploadedBy?: number,
  ) {
    try {
      // Save file using file storage service
      const fileResult = await this.fileStorage.saveDocument(
        applicationId,
        documentType,
        file,
      );

      // Get Registration ID
      const registrationId = await this.getRegistrationId(applicationId);

      // Save document using stored procedure
      await this.db.execute('USP_SAVE_UploadDocument', {
        Registration_ID: registrationId,
        Application_Id: applicationId,
        DocumentType: documentType,
        DocumentPath: fileResult.filePath,
        UserId: uploadedBy || null,
      });

      // Update IsUpload_Status
      const updateQuery = `
        UPDATE t_Registration_Process
        SET IsUpload_Status = '1', Update_Date = GETDATE()
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(updateQuery, {
        applicationId,
      });

      // Try to update Uploaded_Date in t_esch_ApplicantDocuments if column exists
      try {
        const updateUploadedDateQuery = `
          UPDATE t_esch_ApplicantDocuments
          SET Uploaded_Date = GETDATE()
          WHERE Application_Id = @applicationId AND DocumentType = @documentType
        `;
        const updateResult = await this.db.query(updateUploadedDateQuery, {
          applicationId,
          documentType,
        });
        this.logger.debug(`Updated Uploaded_Date for ${applicationId} - ${documentType}. Rows affected: ${updateResult.rowsAffected?.[0] || 0}`);
      } catch (error: any) {
        // If Uploaded_Date column doesn't exist, log and continue
        if (error.message && error.message.includes('Uploaded_Date')) {
          this.logger.warn(`Uploaded_Date column does not exist in t_esch_ApplicantDocuments. Please run the SQL script to add it.`);
        } else {
          this.logger.warn('Could not update Uploaded_Date in t_esch_ApplicantDocuments:', error.message);
        }
      }


      return {
        message: 'Document uploaded successfully',
        documentPath: fileResult.filePath,
      };
    } catch (error) {
      this.logger.error('Error uploading document', error);
      throw new BadRequestException('Failed to upload document');
    }
  }

  /**
   * Upload document (legacy method - accepts path directly)
   */
  async uploadDocument(data: DocumentUploadData) {
    try {
      // Get Registration ID
      const registrationId = await this.getRegistrationId(data.applicationId);

      // Save document using stored procedure
      await this.db.execute('USP_SAVE_UploadDocument', {
        Registration_ID: registrationId,
        Application_Id: data.applicationId,
        DocumentType: data.documentType,
        DocumentPath: data.documentPath,
        UserId: data.uploadedBy || null,
      });

      // Update IsUpload_Status
      const updateQuery = `
        UPDATE t_Registration_Process
        SET IsUpload_Status = '1', Update_Date = GETDATE()
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(updateQuery, {
        applicationId: data.applicationId,
      });

      return { message: 'Document uploaded successfully' };
    } catch (error) {
      this.logger.error('Error uploading document', error);
      throw new BadRequestException('Failed to upload document');
    }
  }

  /**
   * Upload multiple documents
   */
  async uploadMultipleDocuments(
    applicationId: string,
    files: Express.Multer.File[],
    documentTypes: string[],
    uploadedBy?: number,
  ) {
    try {
      // Ensure arrays match
      if (files.length !== documentTypes.length) {
        throw new BadRequestException(
          'Number of files must match number of document types',
        );
      }

      // Upload each file
      const uploadResults: Array<{
        message: string;
        documentPath: string;
      }> = [];
      for (let i = 0; i < files.length; i++) {
        const result = await this.uploadDocumentFile(
          applicationId,
          documentTypes[i],
          files[i],
          uploadedBy,
        );
        uploadResults.push(result);
      }

      return {
        message: 'Documents uploaded successfully',
        results: uploadResults,
      };
    } catch (error) {
      this.logger.error('Error uploading multiple documents', error);
      throw new BadRequestException('Failed to upload documents');
    }
  }

  /**
   * Upload student photo
   */
  async uploadPhoto(
    applicationId: string,
    file: Express.Multer.File,
  ) {
    try {
      // Save photo using file storage service
      const fileResult = await this.fileStorage.savePhoto(applicationId, file);

      // Update photo in t_Registration table
      const updateQuery = `
        UPDATE t_Registration
        SET Photo = @photoPath
        WHERE Application_Id = @applicationId
      `;

      await this.db.query(updateQuery, {
        applicationId,
        photoPath: fileResult.filePath,
      });

      return {
        message: 'Photo uploaded successfully',
        photoPath: fileResult.filePath,
      };
    } catch (error) {
      this.logger.error('Error uploading photo', error);
      throw new BadRequestException('Failed to upload photo');
    }
  }

  /**
   * Get documents for an application
   * Matches old app logic - uses t_esch_ApplicantDocuments table
   * Uses sp_ExecuteSql stored procedure for raw query execution
   */
  async getApplicationDocuments(applicationId: string) {
    try {
      // First check if Uploaded_Date column exists
      const checkColumnQuery = `
        SELECT COUNT(*) as ColumnExists
        FROM sys.columns 
        WHERE object_id = OBJECT_ID('t_esch_ApplicantDocuments') 
        AND name = 'Uploaded_Date'
      `;
      const columnCheck = await this.db.execute('sp_ExecuteSql', {
        Statement: checkColumnQuery,
      });
      const columnCheckRow = columnCheck.recordset?.[0] as Record<string, unknown> | undefined;
      const hasUploadedDate = (columnCheckRow?.ColumnExists as number) > 0;

      // Build query based on column existence
      let query = '';
      if (hasUploadedDate) {
        query = `
          SELECT
            Application_Id,
            DocumentType,
            DocumentPath,
            Is_Verified,
            Uploaded_Date
          FROM t_esch_ApplicantDocuments
          WHERE Application_Id = '${applicationId.replace(/'/g, "''")}'
          ORDER BY DocumentType ASC
        `;
      } else {
        query = `
          SELECT
            Application_Id,
            DocumentType,
            DocumentPath,
            Is_Verified,
            NULL as Uploaded_Date
          FROM t_esch_ApplicantDocuments
          WHERE Application_Id = '${applicationId.replace(/'/g, "''")}'
          ORDER BY DocumentType ASC
        `;
      }

      let result = await this.db.execute('sp_ExecuteSql', {
        Statement: query,
      });

      // If no results from t_esch_ApplicantDocuments, try t_Registration_Documents as fallback
      if (!result.recordset || result.recordset.length === 0) {
        const checkColumnQuery2 = `
          SELECT COUNT(*) as ColumnExists
          FROM sys.columns 
          WHERE object_id = OBJECT_ID('t_Registration_Documents') 
          AND name = 'Uploaded_Date'
        `;
        const columnCheck2 = await this.db.execute('sp_ExecuteSql', {
          Statement: checkColumnQuery2,
        });
        const columnCheckRow2 = columnCheck2.recordset?.[0] as Record<string, unknown> | undefined;
        const hasUploadedDate2 = (columnCheckRow2?.ColumnExists as number) > 0;

        if (hasUploadedDate2) {
          query = `
            SELECT
              Application_Id,
              Document_Type,
              Document_Path,
              NULL as Is_Verified,
              Uploaded_Date
            FROM t_Registration_Documents
            WHERE Application_Id = '${applicationId.replace(/'/g, "''")}'
            ORDER BY Document_Type ASC
          `;
        } else {
          query = `
            SELECT
              Application_Id,
              Document_Type,
              Document_Path,
              NULL as Is_Verified,
              NULL as Uploaded_Date
            FROM t_Registration_Documents
            WHERE Application_Id = '${applicationId.replace(/'/g, "''")}'
            ORDER BY Document_Type ASC
          `;
        }
        result = await this.db.execute('sp_ExecuteSql', {
          Statement: query,
        });
      }

      // Get base URL for constructing full document URLs
      // Use SSO_API_URL from config, or construct from request if available
      const apiBaseUrl = this.configService.get('SSO_API_URL', { infer: true }) || 'http://localhost:3000';
      // Remove /api suffix if present to get server base URL
      const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

      // Map results to match frontend expectations
      // Generate Document_Id as sequential number since table doesn't have it
      // Set Uploaded_Date and Uploaded_By as null since table doesn't have these columns
      const mappedResults = (result.recordset || []).map((row: Record<string, unknown>, index: number) => {
        const rowRecord = row as Record<string, unknown>;
        // Handle both column name formats (DocumentType vs Document_Type)
        const documentType = (rowRecord.DocumentType || rowRecord.Document_Type || '') as string;
        const documentPath = (rowRecord.DocumentPath || rowRecord.Document_Path || '') as string;
        
        // Construct full URL for the document
        // Document paths are stored as relative paths like /ScholerShipData/... or /Photos/...
        // Files are served from /uploads prefix, so we need to prepend /uploads
        let documentUrl = '';
        if (documentPath && typeof documentPath === 'string') {
          if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
            // Already a full URL
            documentUrl = documentPath;
          } else if (documentPath.startsWith('/uploads/')) {
            // Path already includes /uploads prefix
            documentUrl = `${serverBaseUrl}${documentPath}`;
          } else if (documentPath.startsWith('/')) {
            // Absolute path starting with / (e.g., /ScholerShipData/... or /Photos/...)
            // Files are stored in uploads directory, so prepend /uploads
            documentUrl = `${serverBaseUrl}/uploads${documentPath}`;
          } else {
            // Relative path - assume it's relative to uploads directory
            // Remove 'uploads/' prefix if already present
            const cleanPath = documentPath.replace(/^uploads\//, '');
            documentUrl = `${serverBaseUrl}/uploads/${cleanPath}`;
          }
        }
        
        // Log for debugging
        this.logger.debug(`Document URL constructed: ${documentUrl} from path: ${documentPath}`);
        
        // Get Uploaded_Date from row if available, otherwise null
        let uploadedDate: string | null = null;
        if (rowRecord.Uploaded_Date) {
          if (rowRecord.Uploaded_Date instanceof Date) {
            uploadedDate = rowRecord.Uploaded_Date.toISOString();
          } else if (typeof rowRecord.Uploaded_Date === 'string') {
            // If it's already a string, use it directly
            uploadedDate = rowRecord.Uploaded_Date;
          } else {
            // Try to convert to string
            uploadedDate = String(rowRecord.Uploaded_Date);
          }
        }
        
        // Log for debugging
        this.logger.debug(`Document ${documentType} - Uploaded_Date from DB: ${uploadedDate || 'NULL'}`);
        
        return {
          Document_Id: index + 1, // Generate sequential ID since table doesn't have Document_Id
          Application_Id: rowRecord.Application_Id || applicationId,
          Document_Type: documentType,
          Document_Path: documentPath, // Keep original path for reference
          Document_URL: documentUrl, // Full URL for frontend to use directly
          Uploaded_Date: uploadedDate, // Use Uploaded_Date from database if available
          Uploaded_By: null, // Table doesn't have this column - set to null
          Is_Verified: rowRecord.Is_Verified || 0,
        };
      });

      return mappedResults;
    } catch (error) {
      this.logger.error('Error fetching documents', error);
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to fetch documents: ${error.message}`);
      }
      throw new BadRequestException('Failed to fetch documents');
    }
  }

  /**
   * Get document file buffer for viewing/downloading
   * Reads the file from the file system based on the document path stored in database
   */
  async getDocumentFile(
    applicationId: string,
    documentType: string,
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    try {
      // Get document path from database
      let query = `
        SELECT DocumentPath
        FROM t_esch_ApplicantDocuments
        WHERE Application_Id = @applicationId AND DocumentType = @documentType
      `;

      let result = await this.db.query(query, { applicationId, documentType });

      // If no results from t_esch_ApplicantDocuments, try t_Registration_Documents as fallback
      if (!result.recordset || result.recordset.length === 0) {
        query = `
          SELECT Document_Path as DocumentPath
          FROM t_Registration_Documents
          WHERE Application_Id = @applicationId AND Document_Type = @documentType
        `;
        result = await this.db.query(query, { applicationId, documentType });
      }

      if (!result.recordset || result.recordset.length === 0) {
        throw new BadRequestException(
          `Document not found: ${documentType} for application ${applicationId}`,
        );
      }

      const row = result.recordset[0] as Record<string, unknown>;
      const documentPath = (row.DocumentPath || row.Document_Path) as string;
      if (!documentPath || typeof documentPath !== 'string') {
        throw new BadRequestException(
          `Document path not found for ${documentType} in application ${applicationId}`,
        );
      }

      // Get upload base path
      const uploadBasePath =
        process.env.UPLOAD_BASE_PATH || join(process.cwd(), 'uploads');

      // Construct full file path
      // Document paths are stored as /ScholerShipData/... or /Photos/...
      // Files are physically stored in uploads/ScholerShipData/... or uploads/Photos/...
      let fullFilePath: string;
      if (documentPath.startsWith('/')) {
        // Remove leading slash and prepend upload base path
        fullFilePath = join(uploadBasePath, documentPath.substring(1));
      } else {
        // Relative path, prepend upload base path
        fullFilePath = join(uploadBasePath, documentPath);
      }

      // Check if file exists
      if (!existsSync(fullFilePath)) {
        this.logger.error(`File not found: ${fullFilePath}`);
        throw new BadRequestException(
          `Document file not found: ${documentType} for application ${applicationId}`,
        );
      }

      // Read file buffer
      const buffer = readFileSync(fullFilePath);

      // Determine content type from file extension
      const fileExtension = fullFilePath.toLowerCase().split('.').pop() || '';
      let contentType = 'application/octet-stream';
      if (fileExtension === 'pdf') {
        contentType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExtension)) {
        contentType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        contentType = 'image/png';
      } else if (fileExtension === 'gif') {
        contentType = 'image/gif';
      } else if (fileExtension === 'doc') {
        contentType = 'application/msword';
      } else if (fileExtension === 'docx') {
        contentType =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      // Extract filename from path
      const filename = fullFilePath.split(/[/\\]/).pop() || `${documentType}.${fileExtension}`;

      this.logger.log(
        `Serving document: ${documentType} for application ${applicationId} (${filename})`,
      );

      return {
        buffer,
        contentType,
        filename,
      };
    } catch (error) {
      this.logger.error('Error getting document file', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to get document file: ${error.message}`);
      }
      throw new BadRequestException('Failed to get document file');
    }
  }

  /**
   * Get standard document types list (matches old app)
   */
  getStandardDocumentTypes(): string[] {
    return [
      'Birth Certificate',
      'Student ID Card',
      'Ration Card',
      'Voter ID',
      'Driving License',
      'Bank Pass Book',
      'AADHAAR ID',
      'PAN Card',
      'Bonafide (Student)',
      'Bonafide (Parent)',
      'Academic Performance',
      'Student Letter',
    ];
  }

  /**
   * Delete document
   * Note: t_esch_ApplicantDocuments doesn't have Document_Id, so we delete by Application_Id and DocumentType
   * The documentId parameter should be the index or we need Application_Id and DocumentType
   */
  async deleteDocument(documentId: number, applicationId?: string, documentType?: string) {
    try {
      // Since t_esch_ApplicantDocuments doesn't have Document_Id, we need Application_Id and DocumentType
      // For now, we'll delete from t_Registration_Documents if it exists, otherwise we need the applicationId and documentType
      if (applicationId && documentType) {
        // Delete from t_esch_ApplicantDocuments using Application_Id and DocumentType
        const query = `
          DELETE FROM t_esch_ApplicantDocuments
          WHERE Application_Id = @applicationId AND DocumentType = @documentType
        `;
        await this.db.query(query, { applicationId, documentType });
      } else {
        // Try t_Registration_Documents as fallback (if it has Document_Id)
        const query = `
          DELETE FROM t_Registration_Documents
          WHERE Document_Id = @documentId
        `;
        await this.db.query(query, { documentId });
      }

      return { message: 'Document deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting document', error);
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to delete document: ${error.message}`);
      }
      throw new BadRequestException('Failed to delete document');
    }
  }
}

