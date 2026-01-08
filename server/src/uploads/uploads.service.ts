import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ScreenshotResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  status: 'success' | 'pending_ocr';
  message: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir = './uploads';

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async processScreenshot(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ScreenshotResult> {
    // TODO: Implement OCR processing here
    // For now, just store the file and return success

    return {
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      status: 'pending_ocr',
      message:
        '스크린샷이 업로드되었습니다. OCR 기능은 추후 업데이트될 예정입니다.',
    };
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
