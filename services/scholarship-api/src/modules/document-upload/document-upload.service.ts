import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

interface DocumentUploadData {
  applicationId: string;
  documentType: string;
  documentPath: string;
  uploadedBy?: number;
}

@Injectable()
export class DocumentUploadService {
  private readonly logger = new Logger(DocumentUploadService.name);

  constructor(private readonly db: DatabaseService) {}

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
            WHEN '0' THEN 'False'
            WHEN '1' THEN 'True'
            WHEN '2' THEN 'False'
            ELSE 'False'
          END as ReUploadLinkEnable,
          CASE P.IsUpload_Status
            WHEN '0' THEN 'False'
            WHEN '1' THEN 'False'
            WHEN '2' THEN 'True'
            ELSE 'False'
          END as UploadLinkEnable,
          CASE P.IsUpload_Status
            WHEN '0' THEN 'True'
            WHEN '1' THEN 'False'
            WHEN '2' THEN 'False'
            ELSE 'False'
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

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching upload applications', error);
      throw new BadRequestException('Failed to fetch upload applications');
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(data: DocumentUploadData) {
    try {
      // Insert document record
      const insertQuery = `
        INSERT INTO t_Registration_Documents
        (Application_Id, Document_Type, Document_Path, Uploaded_Date, Uploaded_By)
        VALUES
        (@applicationId, @documentType, @documentPath, GETDATE(), @uploadedBy)
      `;

      await this.db.query(insertQuery, {
        applicationId: data.applicationId,
        documentType: data.documentType,
        documentPath: data.documentPath,
        uploadedBy: data.uploadedBy || null,
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
   * Get documents for an application
   */
  async getApplicationDocuments(applicationId: string) {
    try {
      const query = `
        SELECT
          Document_Id,
          Application_Id,
          Document_Type,
          Document_Path,
          Uploaded_Date,
          Uploaded_By
        FROM t_Registration_Documents
        WHERE Application_Id = @applicationId
        ORDER BY Uploaded_Date DESC
      `;

      const result = await this.db.query(query, { applicationId });

      return result.recordset || [];
    } catch (error) {
      this.logger.error('Error fetching documents', error);
      throw new BadRequestException('Failed to fetch documents');
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: number) {
    try {
      const query = `
        DELETE FROM t_Registration_Documents
        WHERE Document_Id = @documentId
      `;

      await this.db.query(query, { documentId });

      return { message: 'Document deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting document', error);
      throw new BadRequestException('Failed to delete document');
    }
  }
}

