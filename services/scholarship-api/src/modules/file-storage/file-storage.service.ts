import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { EnvVars } from '../../config/env.validation';

export type DocumentType =
  | 'BirthCertificate'
  | 'StudentIDCard'
  | 'RationCard'
  | 'VoterID'
  | 'PanCard'
  | 'DrivingLicense'
  | 'BankPassBook'
  | 'AadharID'
  | 'AadhaarID'
  | 'BonafideStudent'
  | 'BonafideParent'
  | 'AcademicPerformance'
  | 'Letter';

export interface FileUploadResult {
  filePath: string;
  fileName: string;
  fullPath: string;
}

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadBasePath: string;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    // Get upload base path from environment variable or use default
    const basePath =
      process.env.UPLOAD_BASE_PATH || join(process.cwd(), 'uploads');
    this.uploadBasePath = basePath;
    this.ensureBaseDirectories();
  }

  /**
   * Ensure base directories exist
   */
  private ensureBaseDirectories(): void {
    const directories = [
      'ScholerShipData',
      'Photos',
      'Registered_Pdf_ScholerShip',
      'BarcodeImage',
      'TempImage',
      'DD_Check_DT',
      'user_profile_images',
      'MedicalDocuments',
    ];

    directories.forEach((dir) => {
      const dirPath = join(this.uploadBasePath, dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        this.logger.log(`Created directory: ${dirPath}`);
      }
    });
  }

  /**
   * Create application-specific folder in ScholerShipData
   */
  private ensureApplicationFolder(applicationId: string): string {
    const appFolder = join(
      this.uploadBasePath,
      'ScholerShipData',
      applicationId,
    );
    if (!existsSync(appFolder)) {
      mkdirSync(appFolder, { recursive: true });
      this.logger.log(`Created application folder: ${appFolder}`);
    }
    return appFolder;
  }

  /**
   * Save document file following the old system's pattern
   * Pattern: /ScholerShipData/{ApplicationNo}/{ApplicationNo}_{DocumentType}.{ext}
   */
  async saveDocument(
    applicationId: string,
    documentType: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    try {
      // Ensure application folder exists
      const appFolder = this.ensureApplicationFolder(applicationId);

      // Get file extension
      const fileExtension = this.getFileExtension(file.originalname);

      // Create filename following pattern: {ApplicationNo}_{DocumentType}.{ext}
      const fileName = `${applicationId}_${documentType}${fileExtension}`;
      const filePath = join(appFolder, fileName);

      // Save file
      writeFileSync(filePath, file.buffer);

      // Return relative path (matching old system format)
      const relativePath = `/ScholerShipData/${applicationId}/${fileName}`;

      this.logger.log(`Saved document: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving document: ${error}`);
      throw error;
    }
  }

  /**
   * Save student photo following the old system's pattern
   * Pattern: /Photos/{ApplicationNo}_Photo.{ext}
   */
  async savePhoto(
    applicationId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    try {
      const photosFolder = join(this.uploadBasePath, 'Photos');

      // Get file extension
      const fileExtension = this.getFileExtension(file.originalname);

      // Create filename following pattern: {ApplicationNo}_Photo.{ext}
      const fileName = `${applicationId}_Photo${fileExtension}`;
      const filePath = join(photosFolder, fileName);

      // Save file
      writeFileSync(filePath, file.buffer);

      // Return relative path (matching old system format)
      const relativePath = `/Photos/${fileName}`;

      this.logger.log(`Saved photo: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving photo: ${error}`);
      throw error;
    }
  }

  /**
   * Save PDF file following the old system's pattern
   * Pattern: /Registered_Pdf_ScholerShip/{ApplicationNo}.pdf
   */
  async savePDF(
    applicationId: string,
    file: Express.Multer.File | Buffer,
    customName?: string,
  ): Promise<FileUploadResult> {
    try {
      const pdfFolder = join(this.uploadBasePath, 'Registered_Pdf_ScholerShip');

      // Create filename
      const fileName = customName || `${applicationId}.pdf`;
      const filePath = join(pdfFolder, fileName);

      // Save file
      const buffer = Buffer.isBuffer(file) ? file : file.buffer;
      writeFileSync(filePath, buffer);

      // Return relative path (matching old system format)
      const relativePath = `/Registered_Pdf_ScholerShip/${fileName}`;

      this.logger.log(`Saved PDF: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving PDF: ${error}`);
      throw error;
    }
  }

  /**
   * Save barcode image following the old system's pattern
   * Pattern: /BarcodeImage/{ApplicationNo}_Barcode.png
   */
  async saveBarcode(
    applicationId: string,
    file: Express.Multer.File | Buffer,
  ): Promise<FileUploadResult> {
    try {
      const barcodeFolder = join(this.uploadBasePath, 'BarcodeImage');

      // Create filename following pattern: {ApplicationNo}_Barcode.png
      const fileName = `${applicationId}_Barcode.png`;
      const filePath = join(barcodeFolder, fileName);

      // Save file
      const buffer = Buffer.isBuffer(file) ? file : file.buffer;
      writeFileSync(filePath, buffer);

      // Return relative path (matching old system format)
      const relativePath = `/BarcodeImage/${fileName}`;

      this.logger.log(`Saved barcode: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving barcode: ${error}`);
      throw error;
    }
  }

  /**
   * Save temporary file (for image cropping, etc.)
   * Pattern: /TempImage/{filename}
   */
  async saveTempFile(
    file: Express.Multer.File,
    customName?: string,
  ): Promise<FileUploadResult> {
    try {
      const tempFolder = join(this.uploadBasePath, 'TempImage');

      // Create filename
      const fileName = customName || file.originalname;
      const filePath = join(tempFolder, fileName);

      // Save file
      writeFileSync(filePath, file.buffer);

      // Return relative path
      const relativePath = `/TempImage/${fileName}`;

      this.logger.log(`Saved temp file: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving temp file: ${error}`);
      throw error;
    }
  }

  /**
   * Delete file by path
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      // If path is relative, convert to absolute
      const fullPath = filePath.startsWith('/')
        ? join(this.uploadBasePath, filePath)
        : filePath;

      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        this.logger.log(`Deleted file: ${fullPath}`);
      } else {
        this.logger.warn(`File not found: ${fullPath}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file: ${error}`);
      throw error;
    }
  }

  /**
   * Get full file path from relative path
   */
  getFullPath(relativePath: string): string {
    if (relativePath.startsWith('/')) {
      return join(this.uploadBasePath, relativePath);
    }
    return relativePath;
  }

  /**
   * Check if file exists
   */
  fileExists(relativePath: string): boolean {
    const fullPath = this.getFullPath(relativePath);
    return existsSync(fullPath);
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
  }

  /**
   * Save user profile image
   * Pattern: /user_profile_images/{userId}_{timestamp}.{ext}
   */
  async saveProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    try {
      const profileImagesFolder = join(
        this.uploadBasePath,
        'user_profile_images',
      );

      // Get file extension
      const fileExtension = this.getFileExtension(file.originalname);

      // Create filename: {userId}_{timestamp}.{ext}
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}${fileExtension}`;
      const filePath = join(profileImagesFolder, fileName);

      // Save file
      writeFileSync(filePath, file.buffer);

      // Return relative path (matching old system format)
      const relativePath = `/user_profile_images/${fileName}`;

      this.logger.log(`Saved profile image: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving profile image: ${error}`);
      throw error;
    }
  }

  /**
   * Save medical document file
   * Pattern: /MedicalDocuments/{ApplicationNo}/{ApplicationNo}_{DocumentType}.{ext}
   */
  async saveMedicalDocument(
    applicationId: string,
    documentType: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    try {
      // Ensure MedicalDocuments folder exists
      const medicalDocsFolder = join(this.uploadBasePath, 'MedicalDocuments');
      if (!existsSync(medicalDocsFolder)) {
        mkdirSync(medicalDocsFolder, { recursive: true });
        this.logger.log(`Created MedicalDocuments directory: ${medicalDocsFolder}`);
      }

      // Create application-specific folder in MedicalDocuments
      const appFolder = join(medicalDocsFolder, applicationId);
      if (!existsSync(appFolder)) {
        mkdirSync(appFolder, { recursive: true });
        this.logger.log(`Created medical documents folder: ${appFolder}`);
      }

      // Get file extension
      const fileExtension = this.getFileExtension(file.originalname);

      // Create filename following pattern: {ApplicationNo}_{DocumentType}.{ext}
      const fileName = `${applicationId}_${documentType}${fileExtension}`;
      const filePath = join(appFolder, fileName);

      // Save file
      writeFileSync(filePath, file.buffer);

      // Return relative path
      const relativePath = `/MedicalDocuments/${applicationId}/${fileName}`;

      this.logger.log(`Saved medical document: ${relativePath}`);

      return {
        filePath: relativePath,
        fileName,
        fullPath: filePath,
      };
    } catch (error) {
      this.logger.error(`Error saving medical document: ${error}`);
      throw error;
    }
  }

  /**
   * Get upload base path
   */
  getUploadBasePath(): string {
    return this.uploadBasePath;
  }
}

