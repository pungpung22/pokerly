import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { VisionService, PokerSessionData } from './vision.service';

export interface ScreenshotResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  status: 'success' | 'pending_ocr' | 'ocr_complete' | 'ocr_failed';
  message: string;
  extractedData?: PokerSessionData;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadsDir = './uploads';

  constructor(private readonly visionService: VisionService) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async processScreenshot(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ScreenshotResult> {
    this.logger.log(`Processing screenshot for user ${userId}: ${file.originalname}`);

    try {
      // OCR 처리
      const extractedData = await this.visionService.parsePokerScreenshot(file.path);

      return {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        status: 'ocr_complete',
        message: 'OCR 처리가 완료되었습니다.',
        extractedData,
      };
    } catch (error) {
      this.logger.error(`OCR failed: ${error.message}`);

      // OCR 실패해도 파일은 업로드됨
      return {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        status: 'ocr_failed',
        message: `OCR 처리 실패: ${error.message}. 수동으로 입력해주세요.`,
      };
    }
  }

  async processScreenshots(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<{ results: ScreenshotResult[]; totalProcessed: number }> {
    const results: ScreenshotResult[] = [];

    for (const file of files) {
      const result = await this.processScreenshot(userId, file);
      results.push(result);
    }

    return {
      results,
      totalProcessed: results.length,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
